import React from "react";
import styled from "styled-components";
import { useSwipeable } from "react-swipeable";

interface SwipeableContentProps {
  content: string[];
  setPage: (page: number) => void;
  direction: number; // This could be used to set the swipe direction
  totalPage: number;
  page: number;
}

const SwipeableContent: React.FC<SwipeableContentProps> = ({
  content,
  setPage,
  totalPage,
  direction,
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
        {content.map((item, index) => (
          <ContentItem key={index}>{item}</ContentItem>
        ))}
      </ContentSlider>
    </SwipeableContainer>
  );
};

export default SwipeableContent;

const SwipeableContainer = styled.div`
  width: 100%;
  overflow: hidden; 
`;

const ContentSlider = styled.div`
  display: flex;
  transition: transform 0.3s ease-out; 
`;

const ContentItem = styled.div`
  width: 100%;
  flex-shrink: 0; 
  display: flex;
  justify-content: center;
  align-items: center;
`;
