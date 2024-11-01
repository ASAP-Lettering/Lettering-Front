import React, { useState, useRef } from "react";
import styled from "styled-components";

interface YearSliderProps {
  startYear?: number;
  endYear?: number;
  onYearChange?: (year: number) => void;
}

const YearSlider: React.FC<YearSliderProps> = ({
  startYear = 1980,
  endYear = 2023,
  onYearChange,
}) => {
  const [currentYear, setCurrentYear] = useState<number>(startYear);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleTouchStart = () => {
    console.log("픽커 터치 시작");
    setIsDragging(true);
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    console.log("픽커 터치 끝");
    setIsDragging(false);
    const slider = sliderRef.current;
    if (!slider) return;

    const rect = slider.getBoundingClientRect();
    const sliderHeight = rect.height;

    const clientY = event.touches[0].clientY;
    const offsetY = clientY - rect.top;
    const percentage = 1 - offsetY / sliderHeight;

    const yearRange = endYear - startYear;
    const newYear = Math.round(startYear + yearRange * percentage);

    const validYear = Math.max(startYear, Math.min(newYear, endYear));

    setCurrentYear(validYear);
    if (onYearChange) {
      onYearChange(validYear);
    }
  };

  const handleDrag = (event: React.TouchEvent<HTMLDivElement>) => {
    console.log("픽커 터치 중");
    if (!isDragging) return;

    const slider = sliderRef.current;
    if (!slider) return;

    const rect = slider.getBoundingClientRect();
    const sliderHeight = rect.height;

    const clientY = event.touches[0].clientY;
    const offsetY = clientY - rect.top;
    const percentage = 1 - offsetY / sliderHeight;

    const yearRange = endYear - startYear;
    const newYear = Math.round(startYear + yearRange * percentage);

    const validYear = Math.max(startYear, Math.min(newYear, endYear));

    setCurrentYear(validYear);
    if (onYearChange) {
      onYearChange(validYear);
    }
  };

  return (
    <SliderContainer
      ref={sliderRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleDrag}
      onTouchEnd={handleTouchEnd}
    >
      <YearDisplay>{currentYear}</YearDisplay>
    </SliderContainer>
  );
};

export default YearSlider;

const SliderContainer = styled.div`
  width: 100%;
  height: 200px;
  background-color: ${(props) => props.theme.colors.bgSecondary};
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  touch-action: none;
  user-select: none;
`;

const YearDisplay = styled.div`
  ${(props) => props.theme.fonts.heading02};
  color: ${(props) => props.theme.colors.primary};
`;
