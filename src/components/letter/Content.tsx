import React from "react";
import styled from "styled-components";
import { useSwipeable } from "react-swipeable";

interface SwipeableContentProps {
  content: string[];
  setPage: (page: number) => void;
  totalPage: number;
  isImage: boolean;
  page: number;
}

const SwipeableContent: React.FC<SwipeableContentProps> = ({
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
        {content.map((item, index) =>
          isImage ? (
            <ContentItem key={index}>
              <ContentImage src={content[index]}></ContentImage>
            </ContentItem>
          ) : (
            <ContentItem key={index}>{item}</ContentItem>
          )
        )}
      </ContentSlider>
    </SwipeableContainer>
  );
};

export default SwipeableContent;

const SwipeableContainer = styled.div`
  width: 100%;
`;

const ContentSlider = styled.div`
  display: flex;
  transition: transform 0.5s ease-out; 
`;

const ContentItem = styled.div`
    width: 100%;
    flex-shrink: 0; 
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ContentImage = styled.img`
    width: 300px;
    height: auto;
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
