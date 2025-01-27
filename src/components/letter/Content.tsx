import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { useSwipeable } from 'react-swipeable';
import { contentType } from './Letter';

interface SwipeableContentProps {
  contentType: contentType;
  content: string[];
  setPage: (page: number) => void;
  totalPage: number;
  isImage: boolean;
  page: number;
}

const SwipeableContent: React.FC<SwipeableContentProps> = ({
  contentType = 'all',
  content,
  setPage,
  totalPage,
  isImage,
  page
}) => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [popupImage, setPopupImage] = useState('');
  const handlers = useSwipeable({
    onSwipedLeft: () => setPage(page < totalPage - 1 ? page + 1 : page),
    onSwipedRight: () => setPage(page > 0 ? page - 1 : page),
    trackTouch: true,
    trackMouse: true
  });

  const xOffset = -page * 100;

  const openPopup = (image: string) => {
    setPopupImage(image);
    setPopupOpen(true);
  };

  const closePopup = () => setPopupOpen(false);

  return (
    <SwipeableContainer {...handlers}>
      {isPopupOpen && (
        <PopupOverlay onClick={closePopup}>
          <PopupImage src={popupImage} onClick={(e) => e.stopPropagation()} />
        </PopupOverlay>
      )}
      <ContentSlider style={{ transform: `translateX(${xOffset}%)` }}>
        {contentType === 'one' ? (
          <ContentItem $isImage={isImage}>
            {isImage ? (
              <ImageContainerWrapper>
                <ImageContainer src={content[0]}></ImageContainer>
                <PopupBtn onClick={() => openPopup(content[0])}>Open</PopupBtn>
              </ImageContainerWrapper>
            ) : (
              <ClampedText $contentType={contentType}>{content}</ClampedText>
            )}
          </ContentItem>
        ) : (
          content.map((item, index) => (
            <ContentItem key={index} $isImage={isImage}>
              {isImage ? (
                <ImageContainerWrapper>
                  <ImageContainer src={content[index]} />
                  <PopupBtn onClick={() => openPopup(content[index])}>
                    <img src="/assets/icons/ic_search.svg"></img>
                  </PopupBtn>
                </ImageContainerWrapper>
              ) : (
                <ClampedText $contentType={contentType}>{item}</ClampedText>
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
  height: auto;
  box-sizing: border-box;
  border-radius: 10px;
  @media (max-width: 375px) {
    max-height: 235px;
  }
`;

const ContentSlider = styled.div`
  display: flex;
  transition: transform 0.5s ease-out;
`;

const ContentItem = styled.div<{ $isImage: boolean }>`
  width: 100%;
  flex-shrink: 0;
  display: flex;
  overflow: hidden;
  align-items: center;
  ${($isImage) =>
    $isImage &&
    css`
      overflow: hidden;
    `}
`;

const ImageContainerWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const ImageContainer = styled.div<{ src: string }>`
  width: 100%;
  height: 100%; /* 부모 컨테이너에 맞추어 높이를 조정 */
  min-height: 200px;
  max-height: 300px;
  overflow: hidden;
  background-image: url(${(props) => props.src});
  background-size: cover; /* 이미지를 부모 컨테이너에 맞추고 초과된 부분을 크롭 */
  background-position: center; /* 이미지의 가운데를 표시 */
  background-repeat: no-repeat;

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

const ClampedText = styled.div<{ $contentType: contentType }>`
  width: 100%;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;

  ${({ $contentType }) =>
    $contentType === 'one'
      ? css`
          -webkit-line-clamp: 7;
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
  justify-content: center;
  align-items: center;
  z-index: 99999;
`;

const PopupImage = styled.img`
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  border-radius: 10px;
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
