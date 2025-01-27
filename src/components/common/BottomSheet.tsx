import { useDragControls } from 'framer-motion';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { theme } from '@/styles/theme';
import Button from './Button';
import Image from 'next/image';

const BottomSheet = ({
  height,
  title,
  subtitle,
  isOpen,
  confirmText = '확인 완료',
  cancelText = '다시 수정할게요',
  handleOpen,
  onConfirm
}: {
  height: number;
  title: string;
  subtitle?: string;
  isOpen: boolean;
  confirmText?: string;
  cancelText?: string;
  handleOpen: (state: boolean) => void;
  onConfirm: () => void;
}) => {
  const dragControls = useDragControls();

  const animateState = isOpen ? 'opened' : 'closed';

  return (
    <>
      <BackgroundOverlay
        initial={false}
        animate={animateState}
        variants={{
          opened: {
            backdropFilter: 'blur(1px)',
            pointerEvents: 'all',
            opacity: 0.7
          },
          closed: {
            backdropFilter: 'blur(0px)',
            pointerEvents: 'none',
            opacity: 0
          }
        }}
        onTap={() => {
          handleOpen(false);
        }}
      />

      <SheetBackground
        $sheetHeight={height}
        initial="closed"
        animate={animateState}
        variants={{
          opened: { bottom: `-200px` },
          closed: { bottom: `-${height + 200}px` }
        }}
        transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
        drag="y"
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={(event, info) => {
          const offsetThreshold = 10;
          if (info.offset.y > offsetThreshold) {
            handleOpen(false);
          }
        }}
      >
        <BottomHeader onPointerDown={(e) => dragControls.start(e)}>
          <HandleBar style={{ borderRadius: 9999 }} />
        </BottomHeader>
        <SheetContentWrapper>
          <Image
            src={'/assets/images/bottomsheet/bottomsheet_letter.svg'}
            width={40}
            height={27}
            alt="letter"
          />
          <SheetContent>
            <TitleWrapper>
              <SheetTitle>{title}</SheetTitle>
              <SheetSubTitle>{subtitle}</SheetSubTitle>
            </TitleWrapper>
            <Button
              buttonType="primary"
              size="large"
              text={confirmText}
              onClick={onConfirm}
            />
            <WriteAgain onClick={() => handleOpen(false)}>
              {cancelText}
            </WriteAgain>
          </SheetContent>
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
  height: 100%;
  background: ${theme.colors.black};
`;

const SheetBackground = styled(motion.div)<{ $sheetHeight: number }>`
  position: absolute;
  bottom: 0px;
  left: 0;
  width: 100%;
  height: ${(props) => props.$sheetHeight + 200}px;
  background: ${theme.colors.gray900};
  box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.5);
  border-radius: 24px 24px 0 0;
  padding: 0 0 24px 0;
  will-change: transform;
  z-index: 9999;
`;

const BottomHeader = styled.div`
  height: 56px;
  cursor: grab;
  padding-top: 12px;
  user-select: none;
`;

const HandleBar = styled.div`
  width: 77px;
  height: 4px;
  background: ${theme.colors.gray700};
  margin: 0 auto;
`;

const SheetContentWrapper = styled.div`
  width: 100%;
  color: ${theme.colors.black};
  padding: 0 24px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 19px;
`;

const SheetContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const TitleWrapper = styled.div`
  margin-bottom: 32px;
`;

const SheetTitle = styled.div`
  ${theme.fonts.title01}
  color: ${theme.colors.white};
  padding: 5px 0;

  @media (max-height: 628px) {
    ${theme.fonts.title02};
  }

  @media (max-height: 580px) {
    ${theme.fonts.subtitle};
  }
`;

const SheetSubTitle = styled.div`
  ${theme.fonts.body07}
  color: ${theme.colors.gray300};

  @media (max-height: 628px) {
    ${theme.fonts.body09};
  }

  @media (max-height: 580px) {
    ${theme.fonts.caption04};
  }
`;

const WriteAgain = styled.button`
  width: 100%;
  padding: 14px;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  ${theme.fonts.caption02}
  color: ${theme.colors.gray200};
`;
