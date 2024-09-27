"use client";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Loader, { LoaderContainer } from "@/components/common/Loader";
import NavigatorBar from "@/components/common/NavigatorBar";
import Modal from "@/components/profile/DateModal";
import { Suspense, useEffect, useState } from "react";
import styled from "styled-components";

const Profile = () => {
  const [email, setEmail] = useState("shyo0000@gmail.com");
  const [birthday, setBirthday] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [picker, setPicker] = useState(false);

  useEffect(() => {
    if (birthday) {
      const [year, month, day] = birthday.split(".");
      setSelectedYear(year);
      setSelectedMonth(parseInt(month).toString());
      setSelectedDate(parseInt(day).toString());
    }
  }, [birthday]);

  useEffect(() => {
    setBirthday("2001.02.18");
    const [year, month, day] = birthday.split(".");
    setSelectedYear(year);
    setSelectedMonth(parseInt(month).toString());
    setSelectedDate(parseInt(day).toString());
  }, []);

  const popupPicker = () => {
    if (birthday && selectedDate && selectedMonth && selectedYear) {
      setPicker(!picker);
      updateNewBirthday();
    }
  };

  const updateNewBirthday = () => {
    console.log("새 생일 날짜는 ", birthday);
  };
  return (
    <Container>
      {picker && (
        <Modal
          onConfirm={popupPicker}
          onDateChange={setBirthday}
          initialYear={selectedYear}
          initialMonth={selectedMonth}
          initialDate={selectedDate}
        />
      )}
      <Wrapper>
        <NavigatorBar title="내 프로필" cancel={false} />
      </Wrapper>
      <MainWrapper>
        <ProfileImage src="/assets/profile/img_profile_letter.png" />
        <InfoWrapper>
          <InfoName>
            <img src="/assets/icons/ic_kakao_profile.svg" />
            연동된 계정
          </InfoName>
          <Input
            inputType="boxText"
            value={email}
            onChange={setEmail}
            placeholder="BoxText Input"
            disabled={true}
          />
        </InfoWrapper>
        <InfoWrapper>
          <InfoName>생년월일</InfoName>
          <Input
            inputType="boxText"
            value={birthday}
            onChange={setBirthday}
            placeholder="BoxText Input"
            disabled={true}
            icon={<img src="/assets/icons/ic_calendar.svg" />}
            onIconClick={popupPicker}
          />
        </InfoWrapper>
      </MainWrapper>
      <Wrapper>
        <Button buttonType="primary" size="large" text="수정하기" />
      </Wrapper>
    </Container>
  );
};

export default function ProfilePaging() {
  return (
    <Suspense
      fallback={
        <LoaderContainer>
          <Loader />
        </LoaderContainer>
      }
    >
      <Profile />
    </Suspense>
  );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 100%;
    max-height: 100%;
    justify-content: space-between;
    color: white;
    background:${(props) => props.theme.colors.bg};
`;

const MainWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 5px 24px;
    height: 100%;
    overflow-y: auto;
    box-sizing: border-box;
    &::-webkit-scrollbar {
        width: 5px; /* Width of the scrollbar */
    }

    &::-webkit-scrollbar-track {
        background: ${(props: any) => props.theme.colors.gray800};
        border-radius: 10px; /* Rounded corners */
    }

    &::-webkit-scrollbar-thumb {
        background: ${(props: any) => props.theme.colors.gray600};
        border-radius: 10px; /* Rounded corners */
    }
`;

const InfoWrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 30px;
    gap: 12px;
`;

const InfoName = styled.div`
    display: flex;
    gap: 5px;
    ${(props: any) => props.theme.fonts.body06};
    color: ${(props: any) => props.theme.colors.white};
`;

const ProfileImage = styled.img`
    width: 100%;
    height: auto;
`;

const Wrapper = styled.div`
    display: flex;
    width: 100%;
    padding: 24px;
`;
