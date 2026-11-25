import { access, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const checked = new Set();

const localPath = (fromFile, reference) => {
  const cleaned = reference.split(/[?#]/, 1)[0];
  if (
    !cleaned ||
    cleaned.startsWith("#") ||
    cleaned.startsWith("data:") ||
    cleaned.startsWith("mailto:") ||
    cleaned.startsWith("http:") ||
    cleaned.startsWith("https:")
  ) {
    return null;
  }

  return resolve(dirname(fromFile), cleaned);
};

const checkReference = async (sourceFile, reference) => {
  const target = localPath(sourceFile, reference);
  if (!target || checked.has(`${sourceFile}:${reference}`)) return;
  checked.add(`${sourceFile}:${reference}`);

  try {
    await access(target);
  } catch {
    failures.push({
      source: sourceFile.slice(root.length + 1),
      reference,
      target: target.slice(root.length + 1),
    });
  }
};

const indexFile = resolve(root, "index.html");
const indexHtml = await readFile(indexFile, "utf8");
for (const match of indexHtml.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
  await checkReference(indexFile, match[1]);
}

const mobileFile = resolve(root, "mobile-preview.html");
const mobileHtml = await readFile(mobileFile, "utf8");
for (const match of mobileHtml.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
  await checkReference(mobileFile, match[1]);
}

for (const relativeFile of ["css/styles.css", "css/ziaoh-theme.css"]) {
  const cssFile = resolve(root, relativeFile);
  const css = await readFile(cssFile, "utf8");
  for (const match of css.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
    await checkReference(cssFile, match[1]);
  }
}

const scriptFile = resolve(root, "js/script.js");
const script = await readFile(scriptFile, "utf8");
const assetPattern =
  /["'](\.\/[^"']+\.(?:png|jpe?g|webp|gif|mp3|mp4|pdf|css|js|html))["']/g;
for (const match of script.matchAll(assetPattern)) {
  // Runtime image URLs in script.js are resolved by the browser against index.html.
  await checkReference(indexFile, match[1]);
}

if (failures.length) {
  console.error(`Found ${failures.length} broken local reference(s):`);
  for (const failure of failures) {
    console.error(
      `- ${failure.source}: ${failure.reference} -> ${failure.target}`,
    );
  }
  process.exitCode = 1;
} else {
  console.log(`Checked ${checked.size} local references; no missing files.`);
}
