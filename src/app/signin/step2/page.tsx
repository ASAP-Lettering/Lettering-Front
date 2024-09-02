"use client";

import Button from "@/components/common/Button";
import NavigatorBar from "@/components/common/NavigatorBar";
import styled from "styled-components";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import ScrollPicker from "@/components/signin/ScrollPicker";

interface DatePickerState {
  year: number;
  month: number;
  day: number;
}

export default function Signin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const url = searchParams.get("url");
  const [date, setDate] = useState<DatePickerState>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  });

  const handleYearChange = (year: number) => {
    setDate({ ...date, year });
  };

  const handleMonthChange = (month: number) => {
    setDate({ ...date, month });
  };

  const handleDayChange = (day: number) => {
    setDate({ ...date, day });
  };

  const years = Array.from({ length: 115 }, (_, i) => 1910 + i);
  const months = Array.from({ length: 12 }, (_, i) => 1 + i);
  const days = Array.from(
    { length: new Date(date.year, date.month, 0).getDate() },
    (_, i) => 1 + i
  );

  const handleButtonClick = () => {
    if (url) {
      router.push(`/signin/complete?url=${url}`);
    } else {
      router.push(`/signin/complete`);
    }
  };
  return (
    <Container>
      <MainWrapper>
        <NavigatorBar
          cancel={false}
          nextlabel={true}
          nextClick={handleButtonClick}
        />
        <Header>
          <HeaderTitle>생년월일을 입력해주세요</HeaderTitle>
          <HeaderSubTitle>이후에 마이페이지에서 변경이 가능해요</HeaderSubTitle>
        </Header>
        <ScrollPicker items={years} onChange={handleYearChange} />
        <ScrollPicker items={months} onChange={handleMonthChange} />
        <ScrollPicker items={days} onChange={handleDayChange} />
      </MainWrapper>
      <Button
        buttonType="primary"
        text="다음"
        onClick={handleButtonClick}
      ></Button>
    </Container>
  );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 100%;
    color: white;
    background:${(props) => props.theme.colors.bg};
    padding: 25px;
    padding-bottom: 40px;
`;

const MainWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

const Header = styled.div`
    display: flex;
    flex-direction: column;
    padding: 10px;
`;

const HeaderTitle = styled.div`
    width: 100%;
    ${(props) => props.theme.fonts.heading01};
    margin-top: 2.5rem;
`;

const HeaderSubTitle = styled.div`
    width: 100%;
    ${(props) => props.theme.fonts.regular16};
    color: ${(props) => props.theme.colors.gray300};
    padding-top: 10px;
`;
