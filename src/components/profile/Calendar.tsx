import { theme } from "@/styles/theme";
import React, { useState, useEffect } from "react";
import styled from "styled-components";

interface CalendarProps {
  selectedYear: string;
  selectedMonth: string;
  selectedDate: string;
  onDateChange: (day: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  selectedYear,
  selectedMonth,
  selectedDate,
  onDateChange,
}) => {
  const [daysInMonth, setDaysInMonth] = useState<number[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(selectedDate);
  const [startDay, setStartDay] = useState<number>(0);
  const [prevMonthDays, setPrevMonthDays] = useState<number[]>([]);
  const [nextMonthDays, setNextMonthDays] = useState<number[]>([]);

  useEffect(() => {
    const currentYear = parseInt(selectedYear);
    const currentMonth = parseInt(selectedMonth);

    // 현재 월의 일 수 계산
    const daysCount = new Date(currentYear, currentMonth, 0).getDate();
    const daysArray = Array.from({ length: daysCount }, (_, i) => i + 1);
    setDaysInMonth(daysArray);

    // 전달의 마지막 날 계산
    const prevMonthLastDay = new Date(
      currentYear,
      currentMonth - 1,
      0
    ).getDate();

    // 1일이 시작되는 요일 계산
    const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1).getDay();
    setStartDay(firstDayOfMonth);

    // 전달의 보여줄 날짜 계산
    const prevMonthStart = prevMonthLastDay - firstDayOfMonth + 1;
    const prevMonthDaysArray = Array.from(
      { length: firstDayOfMonth },
      (_, i) => prevMonthStart + i
    );
    setPrevMonthDays(prevMonthDaysArray);

    // 다음 달의 시작 날짜 계산
    const totalDaysDisplayed = firstDayOfMonth + daysCount;
    const remainingDays = 7 - (totalDaysDisplayed % 7);
    const nextMonthDaysArray =
      remainingDays < 7
        ? Array.from({ length: remainingDays }, (_, i) => i + 1)
        : [];
    setNextMonthDays(nextMonthDaysArray);
  }, [selectedYear, selectedMonth]);

  const handleDayClick = (day: number) => {
    setSelectedDay(day.toString());
    onDateChange(day.toString());
    console.log(selectedYear + "." + selectedMonth + "." + selectedDay);
  };

  return (
    <CalendarContainer>
      <DaysOfWeek>
        {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
          <DayOfWeek key={day}>{day}</DayOfWeek>
        ))}
      </DaysOfWeek>
      <DaysGrid startDay={startDay}>
        {/* 전달의 날짜 표시 */}
        {prevMonthDays.map((day, index) => (
          <Day key={`prev-${index}`} isDimmed={true}>
            {day}
          </Day>
        ))}
        {/* 현재 월의 날짜 표시 */}
        {daysInMonth.map((day) => (
          <Day
            key={day}
            onClick={() => handleDayClick(day)}
            isSelected={selectedDay === day.toString()}
          >
            {day}
            {selectedDay === day.toString() && <Dot />}
          </Day>
        ))}
        {/* 다음 달의 날짜 표시 */}
        {nextMonthDays.map((day, index) => (
          <Day key={`next-${index}`} isDimmed={true}>
            {day}
          </Day>
        ))}
      </DaysGrid>
    </CalendarContainer>
  );
};

export default Calendar;

const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
`;

const DaysOfWeek = styled.div`
  ${(props) => props.theme.fonts.caption03};
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  text-align: center;
  font-weight: bold;
`;

const DayOfWeek = styled.div`
  padding: 8px;
`;

const DaysGrid = styled.div<{ startDay: number }>`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  box-sizing: border-box;
  gap: 2px;
`;

const Day = styled.div<{ isSelected?: boolean; isDimmed?: boolean }>`
  padding: 10px;
  border-radius: 4px;
  text-align: center;
  ${(props) => props.theme.fonts.body07};
  cursor: pointer;
  color: ${({ isSelected, isDimmed }) =>
    isSelected
      ? theme.colors.sub03
      : isDimmed
      ? theme.colors.gray500
      : "inherit"};
  position: relative;
`;

const EmptyDay = styled.div`
  padding: 10px;
`;

const Dot = styled.div`
  width: 6px;
  height: 6px;
  background-color: ${(props) => props.theme.colors.sub03};
  border-radius: 50%;
  position: absolute;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
`;
