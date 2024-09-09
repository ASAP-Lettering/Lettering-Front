import { useMemo, useState } from "react";
import { useDragControls } from "framer-motion";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import useMeasure from "react-use-measure";

const BottomSheet = ({
  viewport = "100dvh",
  title,
  subtitle,
  button = "",
  subButton = "",
}: {
  viewport: string;
  title: string;
  subtitle: string;
  button?: string;
  subButton?: string;
}) => {
  const [isOpened, setIsOpened] = useState(false);
  const [contentRef, contentBounds] = useMeasure();
  const dragControls = useDragControls();

  const animateState = isOpened ? "opened" : "closed";

  const expandedHeight = useMemo(
    () => Math.min(contentBounds.height + 50, window.innerHeight - 50),
    [contentBounds.height]
  );

  return (
    <>
      <BackgroundOverlay
        initial={false}
        animate={animateState}
        variants={{
          opened: {
            backdropFilter: "blur(1px)",
            pointerEvents: "all",
            opacity: 0.7,
          },
          closed: {
            backdropFilter: "blur(0px)",
            pointerEvents: "none",
            opacity: 0,
          },
        }}
        onTap={() => setIsOpened(false)}
      />

      <SheetBackground
        initial="closed"
        animate={animateState}
        variants={{
          opened: { top: `calc(${viewport} - ${expandedHeight}px)` },
          closed: { top: `calc(${viewport} - 60px)` },
        }}
        transition={{ type: "spring", bounce: 0, duration: 0.5 }}
        drag="y"
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        // dragMomentum={false}
        // dragTransition={{ min: 0, max: 1, bounceStiffness: 200, bounceDamping: 20 }}
        onDragEnd={(event, info) => {
          // y가 음수이면 위로, 양수이면 아래로
          const offsetThreshold = 150;
          const deltaThreshold = 5;

          const isOverOffsetThreshold =
            Math.abs(info.offset.y) > offsetThreshold;
          const isOverDeltaThreshold = Math.abs(info.delta.y) > deltaThreshold;

          const isOverThreshold = isOverOffsetThreshold || isOverDeltaThreshold;

          if (!isOverThreshold) return;

          const newIsOpened = info.offset.y < 0;

          setIsOpened(newIsOpened);
        }}
      >
        <BottomHeader onPointerDown={(e) => dragControls.start(e)}>
          <HandleBar style={{ borderRadius: 9999 }} />
        </BottomHeader>
        <SheetContentWrapper style={{ height: 500 }} ref={contentRef}>
          <SheetContent>{title}</SheetContent>
        </SheetContentWrapper>
      </SheetBackground>
    </>
  );
};

export default BottomSheet;

const BackgroundOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100dvh;
  background: black;
`;

const SheetBackground = styled(motion.div)`
  position: absolute;
  top: 0;
  /* bottom: 0; */
  left: 0;
  width: 100%;
  height: 100lvh;
  background: white;
  box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.5);
  border-radius: 24px 24px 0 0;
  padding: 12px 0 24px 0;
  will-change: transform;
`;

const BottomHeader = styled.div`
  height: 50px;
  cursor: grab;
  user-select: none;
`;

const HandleBar = styled.div`
  width: 58px;
  height: 8px;
  background: #dfdfdf;
  margin: 0 auto;
  /* border: 1px solid red; */
`;

const SheetContentWrapper = styled.div`
  width: 100%;
  color: black;
  padding: 24px;
`;

const SheetContent = styled.div`
  width: 100%;
`;
