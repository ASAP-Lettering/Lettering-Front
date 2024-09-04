"use client";

import Button from "@/components/common/Button";
import NavigatorBar from "@/components/common/NavigatorBar";
import styled from "styled-components";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
// import DatePicker from "@/components/signin/DatePicker";
import { useRecoilState } from "recoil";
import { signinState, userInfo } from "@/recoil/signinStore";
import ItemPicker from "@/components/signin/ItemPicker";

export interface DatePickerState {
  year: number;
  month: number;
  day: number;
}

export default function Signin() {
  const [registerToken, setRegisterToken] = useRecoilState(signinState);
  const [user, setUser] = useRecoilState(userInfo);
  const router = useRouter();
  const searchParams = useSearchParams();
  const url = searchParams.get("url");
  const [date, setDate] = useState<DatePickerState>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  });
  const formattedMonth = String(date.month).padStart(2, "0");
  const formattedDay = String(date.day).padStart(2, "0");
  const newBirthday = `${date.year}-${formattedMonth}-${formattedDay}`;
  const [isBirthdayUpdated, setIsBirthdayUpdated] = useState(false);
  const [selectedYear, setSelectedYear] = useState("2001");
  const [selectedMonth, setSelectedMonth] = useState("1");
  const [selecetedDate, setSelecetedDate] = useState("");

  const years = Array.from({ length: 115 }, (_, i) => (1910 + i).toString());
  const months = Array.from({ length: 12 }, (_, i) => (1 + i).toString());
  const days = Array.from(
    {
      length: new Date(
        parseInt(selectedYear),
        parseInt(selectedMonth),
        0
      ).getDate(),
    },
    (_, i) => (1 + i).toString()
  );

  useEffect(() => {
    if (isBirthdayUpdated) {
      if (url) {
        router.push(`/signin/complete?url=${url}`);
      } else {
        router.push(`/signin/complete`);
      }
      setIsBirthdayUpdated(false);
    }
  }, [isBirthdayUpdated]);

  const handleButtonClick = async () => {
    await setUser((prevUser) => ({
      ...prevUser,
      birthday: newBirthday,
    }));

    // signin({
    //   registerToken: registerToken,
    //   privatePermission: user.privatePermission,
    //   servicePermission: user.servicePermission,
    //   marketingPermission: user.marketingPermission,
    //   birthday: user.birthday,
    // })
    //   .then((res) => {
    //     console.log("accessToken", res.data.accessToken);
    //     localStorage.setItem("lettering_access", res.data.accessToken);
    //     localStorage.setItem("lettering_refresh", res.data.refreshToken);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    setIsBirthdayUpdated(true);
    // if (url) {
    //   router.push(`/signin/complete?url=${url}`);
    // } else {
    //   router.push(`/signin/complete`);
    //   console.log(user);
    // }
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
        <ItemPickerWrapper>
          <ItemPicker items={years} defaultItem={"2004"} unit="년" />
          <ItemPicker items={months} defaultItem={"1"} unit="월" />
          <ItemPicker items={days} defaultItem={"1"} unit="일" />
        </ItemPickerWrapper>
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

const ItemPickerWrapper = styled.div`
    width: 100%;
    overflow: hidden;
    margin-top: 15vh;
    display: flex;
    flex-direction: row;
    gap: 50px;
    justify-content: center;
    position: relative;
`;