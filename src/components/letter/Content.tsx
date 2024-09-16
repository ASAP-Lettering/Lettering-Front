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
              {/* <ContentImage src={content[index]}></ContentImage> */}
              <ImageContainer src={content[index]} />
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
    overflow: hidden;
    width: 100%;
    max-width: 272px; 
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
    justify-content: center;
    align-items: center;
    min-height: 200px;
    
    /* position: relative; */
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
