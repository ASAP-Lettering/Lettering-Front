import React from "react";
import styled, { css } from "styled-components";
import { useSwipeable } from "react-swipeable";
import { contentType } from "./Letter";

interface SwipeableContentProps {
  contentType: contentType;
  content: string[];
  setPage: (page: number) => void;
  totalPage: number;
  isImage: boolean;
  page: number;
}

const SwipeableContent: React.FC<SwipeableContentProps> = ({
  contentType = "all",
  content,
  setPage,
  totalPage,
  isImage,
  page,
}) => {
  const handlers = useSwipeable({
    onSwipedLeft: () => setPage(page < totalPage - 1 ? page + 1 : page),
    onSwipedRight: () => setPage(page > 0 ? page - 1 : page),
    trackTouch: true,
    trackMouse: true,
  });

  const xOffset = -page * 100;

  return (
    <SwipeableContainer {...handlers}>
      <ContentSlider style={{ transform: `translateX(${xOffset}%)` }}>
        {contentType === "one" ? (
          <ContentItem>
            {isImage ? (
              <ImageContainer src={content[0]} />
            ) : (
              <ClampedText $contentType={contentType}>{content}</ClampedText>
            )}
          </ContentItem>
        ) : (
          content.map((item, index) =>
            isImage ? (
              <ContentItem key={index}>
                <ImageContainer src={content[index]} />
              </ContentItem>
            ) : (
              <ContentItem key={index}>
                <ClampedText $contentType={contentType}>{item}</ClampedText>
              </ContentItem>
            )
          )
        )}
      </ContentSlider>
    </SwipeableContainer>
  );
};

export default SwipeableContent;

const SwipeableContainer = styled.div`
  overflow: hidden;
  width: 100%;
  min-height: 200px;
  height: auto;
  box-sizing: border-box;
  border-radius: 10px;
`;

const ContentSlider = styled.div`
  display: flex;
  transition: transform 0.5s ease-out;
`;

const ContentItem = styled.div`
  width: 100%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  min-height: 200px;
`;

// const ContentImage = styled.img`
//     width: 100%;
//     height: 100%;
//     object-fit: fill;
//     object-position: center;
//     position: absolute;
//     width: 100%;
//     top: 50%;
//     left: 50%;
//     transform: translate(-50%, -50%);

//     -webkit-user-select: none;
//     -khtml-user-select: none;
//     -moz-user-select: none;
//     -o-user-select: none;
//     user-select: none;
//     -webkit-user-drag: none;
//     -khtml-user-drag: none;
//     -moz-user-drag: none;
//     -o-user-drag: none;
// `;

const ImageContainer = styled.div<{ src: string }>`
  width: 100%;
  min-height: 230px;
  max-height: 100%;
  border-radius: 10px;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
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
    $contentType === "one"
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
