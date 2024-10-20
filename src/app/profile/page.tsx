"use client";

import { getUserInfo, putUserBirthday } from "@/api/mypage/user";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Loader, { LoaderContainer } from "@/components/common/Loader";
import NavigatorBar from "@/components/common/NavigatorBar";
import Modal from "@/components/profile/DateModal";
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

  const router = useRouter();

  const fetchUserInfo = async () => {
    try {
      const response = await getUserInfo();
      setEmail(response.data.email);
      setBirthday(response.data.birthday.replace(/-/g, "."));
      console.log("회원정보 조회 성공:", response.data);

      const [year, month, day] = response.data.birthday.split("-");
      setSelectedYear(year);
      setSelectedMonth(parseInt(month).toString());
      setSelectedDate(parseInt(day).toString());

      setLoading(false);
    } catch (error) {
      console.error("회원정보 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const popupPicker = () => {
    if (birthday && selectedDate && selectedMonth && selectedYear) {
      setPicker(!picker);
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
        <Button
          buttonType="primary"
          size="large"
          text="수정하기"
          onClick={handleSubmit}
        />
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
