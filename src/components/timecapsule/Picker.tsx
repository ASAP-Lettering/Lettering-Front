import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

interface ItemPickerProps {
  items: string[];
  value: string;
  onChange: (value: string) => void;
  height?: number; // 전체 높이, 기본 200
  visibleCount?: number; // 보이는 아이템 개수, 기본 5
  itemPadding?: number; // 아이템 위아래 padding(px)
}

const ItemPicker: React.FC<ItemPickerProps> = ({
  items,
  value,
  onChange,
  height = 200,
  visibleCount = 5,
  itemPadding = 10 // 위아래 10px씩
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemHeight = height / visibleCount;
  const padCount = Math.floor(visibleCount / 2);

  // 선택된 값이 중앙에 오도록 스크롤
  useEffect(() => {
    const idx = items.indexOf(value);
    if (idx !== -1 && containerRef.current) {
      let scrollPos = (idx + padCount) * itemHeight - (height - itemHeight) / 2;
      scrollPos = Math.max(scrollPos, 0);
      containerRef.current.scrollTo({ top: scrollPos, behavior: 'smooth' });
    }
  }, [value, items, height, itemHeight, padCount]);

  // 스크롤이 멈췄을 때 중앙값 자동 선택
  const handleScroll = () => {
    if (!containerRef.current) return;
    const scrollTop = containerRef.current.scrollTop;
    let centerIdx =
      Math.round((scrollTop + height / 2 - itemHeight / 2) / itemHeight) -
      padCount;
    centerIdx = Math.max(centerIdx, 0);
    if (items[centerIdx] && items[centerIdx] !== value) {
      onChange(items[centerIdx]);
    }
  };

  // 패딩 추가된 배열
  const paddedItems = [
    ...Array(padCount).fill(''), // 위쪽 패딩
    ...items,
    ...Array(padCount).fill('') // 아래쪽 패딩
  ];

  return (
    <PickerContainer
      ref={containerRef}
      height={height}
      onScroll={handleScroll}
      tabIndex={0}
    >
      {paddedItems.map((item, idx) => {
        const realIdx = idx - padCount;
        const selected = items[realIdx] === value;
        const distance = Math.abs(realIdx - items.indexOf(value));
        return (
          <PickerItem
            key={idx}
            $selected={selected}
            $distance={distance}
            $itemHeight={itemHeight}
            $isEmpty={item === ''}
            $itemPadding={itemPadding}
          >
            {item}
          </PickerItem>
        );
      })}
    </PickerContainer>
  );
};

export default ItemPicker;

// 스타일
const PickerContainer = styled.div<{ height: number }>`
  position: relative;
  height: ${({ height }) => height}px;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  -webkit-overflow-scrolling: touch;
  background: #18181c;
  border-radius: 16px;
  padding: 0;
  box-sizing: border-box;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const PickerItem = styled.div<{
  $selected: boolean;
  $distance: number;
  $itemHeight: number;
  $isEmpty: boolean;
  $itemPadding: number;
}>`
  scroll-snap-align: center;
  height: ${({ $itemHeight }) => $itemHeight}px;
  padding: ${({ $itemPadding }) => `${$itemPadding}px 0`};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ $selected }) => ($selected ? '1.5rem' : '1.1rem')};
  font-weight: ${({ $selected }) => ($selected ? 700 : 400)};
  color: ${({ $selected, $distance, $isEmpty }) =>
    $isEmpty
      ? 'transparent'
      : $selected
      ? '#fff'
      : `rgba(255,255,255,${1 - Math.min($distance * 0.4, 0.8)})`};
  opacity: ${({ $selected, $distance, $isEmpty }) =>
    $isEmpty ? 0 : $selected ? 1 : 1 - Math.min($distance * 0.3, 0.6)};
  transition: color 0.3s, opacity 0.3s, font-size 0.3s;
  cursor: ${({ $isEmpty }) => ($isEmpty ? 'default' : 'pointer')};
  user-select: none;
`;
