import React, { createRef } from "react";
import { createRoot, type Root } from "react-dom/client";
import MacbookScrollDemo from "./demo";

const rootElement = document.getElementById("sico-macbook-root");
const caseDialog = document.getElementById("case-dialog");

if (rootElement && caseDialog) {
  const shadowRoot =
    rootElement.shadowRoot ?? rootElement.attachShadow({ mode: "open" });
  const stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = new URL(
    "./assets/vendor/macbook-island.css?v=20261125-macbook-mobile-proportion-106",
    document.baseURI,
  ).href;
  shadowRoot.append(stylesheet);

  const mountElement = document.createElement("div");
  shadowRoot.append(mountElement);

  const scrollContainer = createRef<HTMLElement>();
  let reactRoot: Root | null = null;
  let renderFrame = 0;

  const renderIsland = () => {
    if (!(caseDialog instanceof HTMLDialogElement) || !caseDialog.open) return;

    const scrollCandidates = [
      document.querySelector(".pr-main"),
      document.querySelector(".pr-shell"),
    ];
    scrollContainer.current =
      scrollCandidates.find((element): element is HTMLElement => {
        if (!(element instanceof HTMLElement)) return false;
        const overflowY = window.getComputedStyle(element).overflowY;
        return (
          (overflowY === "auto" || overflowY === "scroll") &&
          element.scrollHeight > element.clientHeight
        );
      }) ?? null;

    reactRoot ??= createRoot(mountElement);
    reactRoot.render(
      <React.StrictMode>
        <MacbookScrollDemo scrollContainer={scrollContainer} />
      </React.StrictMode>,
    );
  };

  const scheduleRender = () => {
    if (renderFrame) return;
    renderFrame = window.requestAnimationFrame(() => {
      renderFrame = 0;
      renderIsland();
    });
  };

  new MutationObserver(scheduleRender).observe(caseDialog, {
    attributes: true,
    attributeFilter: ["open"],
  });

  scheduleRender();
}
