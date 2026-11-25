import React from "react";
import { MotionValue, motion, useTransform } from "motion/react";
import { MacbookScroll } from "./components/ui/macbook-scroll";

const SicoBadge = () => {
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-[linear-gradient(135deg,#7ee6d1,#6f6be4)] text-[7px] font-semibold tracking-[-0.02em] text-white shadow-[0_6px_18px_rgba(90,86,190,0.2)]">
      SICO
    </span>
  );
};

const ScreenContent = ({ progress }: { progress: MotionValue<number> }) => {
  const y = useTransform(progress, [0, 0.52], ["0%", "-83.23%"]);

  return (
    <motion.img
      style={{ y, backfaceVisibility: "hidden" }}
      src="./assets/cases/login/sico-login-page-screen.jpg"
      alt="SICO login and product landing page preview"
      width="1024"
      height="4578"
      className="block h-auto w-full transform-gpu will-change-transform"
      loading="eager"
      decoding="async"
    />
  );
};

export default function MacbookScrollDemo({
  scrollContainer,
}: {
  scrollContainer: React.RefObject<HTMLElement | null>;
}) {
  return (
    <div className="w-full overflow-hidden bg-white">
      <MacbookScroll
        title={
          <span>
            SICO Login. <br />
            One continuous product experience.
          </span>
        }
        badge={<SicoBadge />}
        screenContent={(progress) => <ScreenContent progress={progress} />}
        scrollContainer={scrollContainer}
        showTitle={false}
        showGradient={false}
      />
    </div>
  );
}
