import { useEffect, useMemo, useState } from "react";
import { useDragControls } from "framer-motion";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import useMeasure from "react-use-measure";
import { theme } from "@/styles/theme";
import Button from "./Button";

const BottomSheet = ({
  viewport = "100dvh",
  title,
  subtitle,
  button = "",
  subButton = "",
  isOpen,
  handleOpen,
  onConfirm,
}: {
  viewport: string;
  title: string;
  subtitle?: string;
  button?: string;
  subButton?: string;
  isOpen: boolean;
  handleOpen: (state: boolean) => void;
  onConfirm: () => void;
}) => {
  //const [isOpened, setIsOpened] = useState(isOpen);
  const [contentRef, contentBounds] = useMeasure();
  const dragControls = useDragControls();

  //   useEffect(() => {
  //     setIsOpened(isOpen);
  //   }, [isOpen]);

  const animateState = isOpen ? "opened" : "closed";

  const expandedHeight = useMemo(
    () => Math.min(contentBounds.height - 180, window.innerHeight - 50),
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
        onTap={() => {
          //setIsOpened(false);
          handleOpen(false);
        }}
      />

      <SheetBackground
        initial="closed"
        animate={animateState}
        variants={{
          opened: { top: `calc(${viewport}  - ${expandedHeight}px)` },
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

          //setIsOpened(newIsOpened);
          handleOpen(newIsOpened);
        }}
      >
        <BottomHeader onPointerDown={(e) => dragControls.start(e)}>
          <HandleBar style={{ borderRadius: 9999 }} />
        </BottomHeader>
        <SheetContentWrapper style={{ height: 500 }} ref={contentRef}>
          <SheetContent>
            <TitleWrapper>
              <SheetTitle>{title}</SheetTitle>
              <SheetSubTitle>{subtitle}</SheetSubTitle>
            </TitleWrapper>
            <Button
              buttonType="primary"
              size="large"
              text="확인 완료"
              onClick={onConfirm}
            />
          </SheetContent>
          <WriteAgain onClick={() => handleOpen(false)}>
            다시 수정할게요
          </WriteAgain>
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
  background:${theme.colors.gray900};
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
  height: 4px;
  background: ${theme.colors.gray700};
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
  display: flex;
  flex-direction: column;
`;

const TitleWrapper = styled.div`
  margin-bottom: 50px;
`;

const SheetTitle = styled.div`
    ${theme.fonts.title01}
    color: white;
    padding: 5px 0;
`;

const SheetSubTitle = styled.div`
    ${theme.fonts.body07}
    color: ${theme.colors.gray300};
`;

const WriteAgain = styled.button`
    width: 100%;
    padding: 10px;
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    ${theme.fonts.caption02}
    color: ${theme.colors.gray200};
`;
