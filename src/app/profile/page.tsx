"use client";

import { getUserInfo, putUserBirthday } from "@/api/mypage/user";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Loader, { LoaderContainer } from "@/components/common/Loader";
import NavigatorBar from "@/components/common/NavigatorBar";
import Modal from "@/components/profile/DateModal";
import { theme } from "@/styles/theme";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import styled from "styled-components";

type DateType = {
  date: string;
  month: string;
  year: string;
};

const Profile = () => {
  const [email, setEmail] = useState("shyo0000@gmail.com");
  const [birthday, setBirthday] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [picker, setPicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [prevBirthday, setPrevBirthday] = useState("");
  const [isAbled, setIsAbled] = useState(false);

  const router = useRouter();

  const fetchUserInfo = async () => {
    try {
      const response = await getUserInfo();
      setEmail(response.data.email);
      if (response.data.birthday) {
        setBirthday(response.data.birthday.replace(/-/g, "."));
        setPrevBirthday(response.data.birthday.replace(/-/g, "."));

        const [year, month, day] = response.data.birthday.split("-");
        setSelectedYear(year);
        setSelectedMonth(parseInt(month).toString());
        setSelectedDate(parseInt(day).toString());
      } else {
        setPrevBirthday("null");
      }

      console.log("회원정보 조회 성공:", response.data);

      setLoading(false);
    } catch (error) {
      console.error("회원정보 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (birthday !== prevBirthday && birthday) {
      setIsAbled(true);
      const [year, month, day] = birthday.split(".");
      setSelectedYear(year);
      setSelectedMonth(parseInt(month).toString());
      setSelectedDate(parseInt(day).toString());
    } else {
      setIsAbled(false);
    }
  }, [birthday]);

  const popupPicker = () => {
    if (birthday && selectedDate && selectedMonth && selectedYear) {
      setPicker(!picker);
    } else {
      setBirthday("2004-01-01");
      setSelectedYear("2004");
      setSelectedMonth("01");
      setSelectedDate("01");
      setPicker(true);
    }
  };

  const handleSubmit = () => {
    let formatBirthday = birthday.replace(/\./g, "-");
    fetchNewBirthday(formatBirthday);
    router.push("/mypage");
  };

  const confirmModal = (newbirthday: string) => {
    setBirthday(newbirthday);
    setPicker(!picker);
  };

  const closeModal = () => {
    setPicker(false);
    fetchUserInfo();
  };

  const fetchNewBirthday = async (birthday: string) => {
    try {
      await putUserBirthday(birthday);
    } catch (error) {
      console.log(error);
    }
  };

  return loading ? (
    <LoaderContainer>
      <Loader />
    </LoaderContainer>
  ) : (
    <Container>
      {picker && (
        <Modal
          onConfirm={confirmModal}
          onClose={closeModal}
          onDateChange={setBirthday}
          initialYear={selectedYear}
          initialMonth={selectedMonth}
          initialDate={selectedDate}
        />
      )}
      <NavigatorBarWrapper>
        <NavigatorBar title="내 프로필" cancel={false} />
      </NavigatorBarWrapper>
      <MainWrapper>
        <ProfileImage src="/assets/profile/img_profile_letter.png" />
        <InfoWrapper>
          <InfoName>
            연동된 계정
            <img
              src="/assets/icons/ic_kakao_profile.svg"
              width={16}
              height={16}
            />
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
            value={birthday ? birthday : "생년월일을 입력해주세요"}
            onChange={setBirthday}
            placeholder="BoxText Input"
            disabled={true}
            icon={<img src="/assets/icons/ic_calendar.svg" />}
            onIconClick={popupPicker}
          />
        </InfoWrapper>
      </MainWrapper>
      <ButtonWrapper>
        <Button
          buttonType="primary"
          size="large"
          text="수정하기"
          disabled={!isAbled}
          onClick={handleSubmit}
        />
      </ButtonWrapper>
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
  color: ${theme.colors.white};
  background: ${(props) => props.theme.colors.bg};
  position: relative;
`;

const NavigatorBarWrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 24px 24px 0 24px;
`;

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 5px 24px;
  align-items: center;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: ${(props: any) => props.theme.colors.gray800};
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props: any) => props.theme.colors.gray600};
    border-radius: 10px;
  }
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
  width: 100%;
  gap: 12px;
`;

const InfoName = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  ${(props: any) => props.theme.fonts.body06};
  color: ${(props: any) => props.theme.colors.white};
`;

const ProfileImage = styled.img`
  width: 100%;
  height: auto;

  @media (max-height: 760px) {
    width: 200px;
  }

  @media (max-height: 580px) {
    width: 150px;
    height: 150px;
  }
`;

const ButtonWrapper = styled.div`
  width: 100%;
  position: absolute;
  padding: 0 20px;
  bottom: 40px;
  left: 0;
`;
