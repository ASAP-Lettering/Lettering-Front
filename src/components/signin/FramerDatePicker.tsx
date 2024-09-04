// styles/DatePickerStyles.ts
import styled, { css } from "styled-components";
// components/DatePicker.tsx
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface DatePickerProps {
  initialDate: Date;
}

interface DateItemProps {
  isSelected: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({ initialDate }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const refContainer = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const dateElementsRef = useRef<(HTMLDivElement | null)[]>([]);

  const dates: Date[] = Array.from(
    { length: 31 },
    (_, i) => new Date(initialDate.getFullYear(), initialDate.getMonth(), i + 1)
  );
  useEffect(() => {
    const halfItemHeight = 30;
    const observerOptions = {
      root: refContainer.current,
      rootMargin: `-${halfItemHeight}px 0px -${halfItemHeight}px 0px`,
      threshold: 0.8,
    };

    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          const dateStr = entry.target.getAttribute("data-date");
          if (dateStr) setSelectedDate(new Date(dateStr));
        }
      });
    }, observerOptions);

    dateElementsRef.current.forEach((elem) => {
      if (elem) observer.current?.observe(elem);
    });

    return () => {
      dateElementsRef.current.forEach((elem) => {
        if (elem) observer.current?.unobserve(elem);
      });
      observer.current?.disconnect();
    };
  }, []);

  return (
    <DatePickerContainer ref={refContainer}>
      {Array.from({ length: 31 }, (_, i) => {
        const date = new Date(
          initialDate.getFullYear(),
          initialDate.getMonth(),
          i + 1
        );
        return (
          <DateItem
            key={i}
            ref={(el) => {
              dateElementsRef.current[i] = el;
            }}
            as={motion.div}
            data-date={date.toISOString()}
            isSelected={date.toDateString() === selectedDate.toDateString()}
            onClick={() => setSelectedDate(date)}
            whileTap={{ scale: 0.95 }}
          >
            {date.getDate()}
          </DateItem>
        );
      })}
    </DatePickerContainer>
  );
};

export default DatePicker;
const DatePickerContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 180px;  // 이 높이는 중앙 요소가 정확히 위치할 수 있도록 설정
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const DateItem = styled.div<DateItemProps>`
  flex: 0 0 auto;
  height: 60px; // 각 요소의 높이
  line-height: 60px; // 텍스트 중앙 정렬
  text-align: center;
  scroll-snap-align: center; // 스냅 정렬을 center로 설정
  font-size: 16px;
  color: ${({ isSelected }) => (isSelected ? "blue" : "white")};
  transition: color 0.3s, border 0.3s;
  &:hover {
    cursor: pointer;
  }
`;
