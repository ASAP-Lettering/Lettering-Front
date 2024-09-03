import React, { useState, useEffect } from "react";
import styled from "styled-components";

interface ScrollPickerProps {
  items: number[];
  onChange: (value: number) => void;
}

const ScrollPicker: React.FC<ScrollPickerProps> = ({ items, onChange }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    onChange(items[selectedIndex]);
  }, [selectedIndex, items, onChange]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const index = Math.round(e.currentTarget.scrollTop / 40);
    setSelectedIndex(index);
  };

  return (
    <ScrollContainer onScroll={handleScroll}>
      {items.map((item, index) => (
        <ScrollItem key={index} selected={index === selectedIndex}>
          {item}
        </ScrollItem>
      ))}
    </ScrollContainer>
  );
};

export default ScrollPicker;

const ScrollContainer = styled.div`
  overflow-y: scroll;
  height: 200px;
  color: white;
`;

const ScrollItem = styled.div<{ selected: boolean }>`
  display: flex;
  color: white;
  justify-content: center;
  align-items: center;
  height: 40px;
  color: ${({ selected }) => (selected ? "black" : "rgba(0, 0, 0, 0.5)")};
  font-weight: ${({ selected }) => (selected ? "bold" : "normal")};
`;
