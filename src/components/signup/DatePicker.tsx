// components/common/DatePicker.tsx

import { DatePickerState } from "@/app/signup/step2/page";
import React from "react";
import styled from "styled-components";

interface DatePickerProps {
  date: DatePickerState;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
  onDayChange: (day: number) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({
  date,
  onYearChange,
  onMonthChange,
  onDayChange,
}) => {
  const years = Array.from({ length: 115 }, (_, i) => 1910 + i);
  const months = Array.from({ length: 12 }, (_, i) => 1 + i);
  const days = Array.from(
    { length: new Date(date.year, date.month, 0).getDate() },
    (_, i) => 1 + i
  );

  return (
    <PickerContainer>
      <select
        value={date.year}
        onChange={(e) => onYearChange(parseInt(e.target.value))}
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      <select
        value={date.month}
        onChange={(e) => onMonthChange(parseInt(e.target.value))}
      >
        {months.map((month) => (
          <option key={month} value={month}>
            {month}
          </option>
        ))}
      </select>
      <select
        value={date.day}
        onChange={(e) => onDayChange(parseInt(e.target.value))}
      >
        {days.map((day) => (
          <option key={day} value={day}>
            {day}
          </option>
        ))}
      </select>
    </PickerContainer>
  );
};

const PickerContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
`;

export default DatePicker;
