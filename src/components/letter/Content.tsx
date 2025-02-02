import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { useSwipeable } from 'react-swipeable';
import { contentType } from './Letter';
import Image from 'next/image';
import { theme } from '@/styles/theme';

interface SwipeableContentProps {
  contentType: contentType;
  content: string[];
  setPage: (page: number) => void;
  totalPage: number;
  isImage: boolean;
  page: number;
  maxLines?: number;
}

const SwipeableContent: React.FC<SwipeableContentProps> = ({
  contentType = 'all',
  content,
  setPage,
  totalPage,
  isImage,
  page,
  maxLines
}) => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [popupPage, setPopupPage] = useState(page);
  const [minWidth, setMinWidth] = useState(393);

  useEffect(() => {
    console.log('maxLines', maxLines);
    const updateWidth = () => {
      setMinWidth(window.innerWidth || 393);
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);

    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  /* 스와이프 핸들러 */
  const handlers = useSwipeable({
    onSwipedLeft: () => setPage(page < totalPage - 1 ? page + 1 : page),
    onSwipedRight: () => setPage(page > 0 ? page - 1 : page),
    trackTouch: true,
    trackMouse: true
  });

  /* 팝업 내 스와이프 핸들러 */
  const popupHandlers = useSwipeable({
    onSwipedLeft: () =>
      setPopupPage(popupPage < totalPage - 1 ? popupPage + 1 : popupPage),
    onSwipedRight: () =>
      setPopupPage(popupPage > 0 ? popupPage - 1 : popupPage),
    trackTouch: true,
    trackMouse: true
  });

  const xOffset = -page * 100;
  const popupOffset = -popupPage * 100;

  const openPopup = (index: number) => {
    setPopupPage(index);
    setPopupOpen(true);
  };

  const closePopup = () => setPopupOpen(false);

  return (
    <SwipeableContainer {...handlers}>
      {isPopupOpen && (
        <PopupOverlay {...popupHandlers}>
          <PopupTop>
            <PopupPage>
              {totalPage > 1 && (
                <span>
                  {popupPage + 1} / {totalPage}
                </span>
              )}
            </PopupPage>
            <PopupCloseButton onClick={closePopup}>
              <img src="/assets/icons/ic_cancel.svg" width={24} height={24} />
            </PopupCloseButton>
          </PopupTop>
          {/* 팝업 이미지 슬라이더*/}
          <PopupImageSlider
            style={{ transform: `translateX(${popupOffset}%)` }}
          >
            {content.map((imgSrc, index) => (
              <PopupImage
                key={index}
                src={imgSrc}
                draggable="false"
                $minWidth={minWidth}
              />
            ))}
          </PopupImageSlider>
        </PopupOverlay>
      )}
      <ContentSlider style={{ transform: `translateX(${xOffset}%)` }}>
        {contentType === 'one' ? (
          <ContentItem $isImage={isImage}>
            {isImage ? (
              <ImageContainerWrapper>
                <ImageContainer src={content[0]} alt="image" fill />
                <PopupBtn onClick={() => openPopup(0)}>
                  <img src="/assets/icons/ic_search.svg" />
                </PopupBtn>
              </ImageContainerWrapper>
            ) : (
              <ClampedText $contentType={contentType} $maxLines={maxLines}>
                {content[0]}
              </ClampedText>
            )}
          </ContentItem>
        ) : (
          content.map((item, index) => (
            <ContentItem key={index} $isImage={isImage}>
              {isImage ? (
                <ImageContainerWrapper>
                  <ImageContainer
                    src={content[index]}
                    alt="image"
                    fill
                    draggable="false"
                  />
                  <PopupBtn onClick={() => openPopup(index)}>
                    <img src="/assets/icons/ic_search.svg" />
                  </PopupBtn>
                </ImageContainerWrapper>
              ) : (
                <ClampedText $contentType={contentType} $maxLines={maxLines}>
                  {item}
                </ClampedText>
              )}
            </ContentItem>
          ))
        )}
      </ContentSlider>
    </SwipeableContainer>
  );
};

export default SwipeableContent;

const SwipeableContainer = styled.div`
  overflow: hidden;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border-radius: 10px;
  position: relative;

  @media (max-width: 375px) {
    max-height: 235px;
  }
`;

const ContentSlider = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  transition: transform 0.5s ease-out;
`;

const ContentItem = styled.div<{ $isImage: boolean }>`
  width: 100%;
  height: 100%;
  flex-shrink: 0;
  display: flex;
  overflow: hidden;
`;

const ImageContainerWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const ImageContainer = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  overflow: hidden;

  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -o-user-select: none;
  user-select: none;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
`;

const ClampedText = styled.div<{
  $contentType: contentType;
  $maxLines: number;
}>`
  width: 100%;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;

  ${({ $contentType, $maxLines }) =>
    $contentType === 'one'
      ? css`
          -webkit-line-clamp: ${$maxLines || 7};
          text-overflow: ellipsis;
        `
      : css`
          white-space: normal;
          word-break: break-all;
          overflow-wrap: break-word;
          white-space: pre-wrap;
        `}
`;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 393px;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  z-index: 99999;
  overflow: hidden;
`;

const PopupTop = styled.div`
  width: 100%;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  position: fixed;
  top: 53px;
  z-index: 10;
`;

const PopupPage = styled.div`
  color: ${theme.colors.white};
  ${theme.fonts.body09};
`;

const PopupCloseButton = styled.button`
  width: 24px;
  height: 24px;
`;

const PopupImageSlider = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.5s ease-out;
`;

const PopupImage = styled.img<{ $minWidth: number }>`
  width: 100%;
  min-width: ${({ $minWidth }) => `${$minWidth < 393 ? $minWidth : 393}px`};
  height: 100%;
  object-fit: contain;
`;

const PopupBtn = styled.button`
  position: absolute;
  width: 35px;
  height: 32px;
  bottom: 12px;
  right: 9px;
  z-index: 1; /* 버튼이 이미지 위에 표시되도록 설정 */
  background: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 10px;
  padding: 6px;
  font-size: 14px;
  cursor: pointer;
`;
