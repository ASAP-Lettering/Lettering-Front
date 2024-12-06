"use client";

import { deleteUser, logout } from "@/api/mypage/user";
import Button from "@/components/common/Button";
import Check from "@/components/common/Check";
import Dropdown from "@/components/common/Dropdown";
import Input from "@/components/common/Input";
import Loader, { LoaderContainer } from "@/components/common/Loader";
import NavigatorBar from "@/components/common/NavigatorBar";
import { theme } from "@/styles/theme";
import {
  clearOnboarding,
  clearTokens,
  getRefreshToken,
  removeCookie,
} from "@/utils/storage";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import styled from "styled-components";

const DeleteAccount = () => {
  const [selectedOption, setSelectedOption] = useState(""); //드롭다운
  const options = [
    "개인정보를 삭제하고 싶어요",
    "서비스 이용이 불편해요",
    "탈퇴 후 다시 가입할 예정이에요",
    "서비스를 이용하지 않아요",
    "그 외 기타",
  ];
  const [textarea, setTextarea] = useState(""); //질문2
  const [isCheckedBox, setIsCheckedBox] = useState(false); // 체크박스
  const [isAbled, setisAbled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (selectedOption.length > 0 && isCheckedBox) {
      setisAbled(true);
    } else {
      setisAbled(false);
    }
  }, [selectedOption, isCheckedBox]);

  const handleBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCheckedBox(e.target.checked);
  };

  useEffect(() => {
    if (textarea.length > 500) {
      setTextarea(textarea.substring(0, 500));
    }
  }, [textarea]);

  const handleDeleteUser = () => {
    deleteUser()
      .then((res) => {
        console.log(res.data);
        clearTokens();
        clearOnboarding();
        router.push("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 테스트 해본 코드
  // const handleDeleteUser = async () => {
  //   try {
  //     // 회원 탈퇴 요청
  //     const res = await deleteUser();
  //     console.log(res.data);

  //     // 로그아웃 요청을 위해 refreshToken 가져오기
  //     const refreshToken = getRefreshToken();

  //     if (refreshToken) {
  //       // 서버 로그아웃 요청
  //       const logoutRes = await logout(refreshToken);
  //       console.log(logoutRes.data);
  //     }

  //     clearTokens();
  //     removeCookie("letter-onboard");

  //     router.push("/login");
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  return (
    <Container>
      <NavigatorBarWrapper>
        <NavigatorBar title="회원 탈퇴" cancel={false} />
      </NavigatorBarWrapper>
      <MainWrapper>
        <MainTitle>정말 레터링을 탈퇴하시겠어요?</MainTitle>
        <SubTitle>
          회원 탈퇴 후에는 레터링에 저장된 행성과 편지들이
          <br />
          모두 삭제되며, 삭제된 내용은 복구할 수 없어요{" "}
        </SubTitle>
        <QuestionWrapper>
          <QuestionText>레터링을 탈퇴하는 이유를 말씀해주세요</QuestionText>
          <Dropdown
            options={options}
            value={selectedOption}
            onChange={setSelectedOption}
            placeholder="선택해주세요"
          ></Dropdown>
        </QuestionWrapper>
        <QuestionWrapper>
          <QuestionText>
            더 나은 서비스를 위해 의견을 남겨주세요
            <span>{textarea.length + " / 500"}</span>
          </QuestionText>
          <InputWrapper>
            <Input
              inputType="boxTextArea"
              value={textarea}
              onChange={setTextarea}
              height="100%"
            />
          </InputWrapper>
        </QuestionWrapper>
        <Check
          checkType="box"
          labelFont="button03"
          label="모든 데이터를 삭제하고 탈퇴하는 것에 동의합니다"
          checked={isCheckedBox}
          onChange={handleBoxChange}
        />
      </MainWrapper>
      <ButtonWrapper>
        <Button
          buttonType="primary"
          size="large"
          text="탈퇴하기"
          disabled={!isAbled}
          onClick={handleDeleteUser}
        />
      </ButtonWrapper>
    </Container>
  );
};

export default function SendedLetterPaging() {
  return (
    <Suspense
      fallback={
        <LoaderContainer>
          <Loader />
        </LoaderContainer>
      }
    >
      <DeleteAccount />
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
  padding: 24px;

  @media (max-height: 720px) {
    padding: 24px 24px 0 24px;
  }
`;

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px 24px;
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

const MainTitle = styled.div`
  ${(props: any) => props.theme.fonts.title01};
  color: ${(props: any) => props.theme.colors.white};
  padding: 9px 0;

  @media (max-height: 720px) {
    ${theme.fonts.title02};
  }

  @media (max-height: 628px) {
    ${theme.fonts.body14};
  }

  @media (max-height: 628px) {
    ${theme.fonts.body14};
  }
`;

const SubTitle = styled.div`
  ${(props: any) => props.theme.fonts.body08};
  color: ${(props: any) => props.theme.colors.white};
  margin-bottom: 35px;

  @media (max-height: 720px) {
    margin-bottom: 18px;
  }

  @media (max-height: 700px) {
    color: ${theme.colors.gray300};
    ${theme.fonts.body09};
  }

  @media (max-height: 628px) {
    color: ${theme.colors.gray300};
    ${theme.fonts.body13};
  }
`;

const QuestionText = styled.div`
  ${(props: any) => props.theme.fonts.subtitle};
  color: ${(props: any) => props.theme.colors.white};
  display: flex;
  justify-content: space-between;

  //글자수
  span {
    display: flex;
    text-align: center;
    align-items: center;
    ${(props: any) => props.theme.fonts.caption03};
    color: ${(props: any) => props.theme.colors.white};
  }

  @media (max-width: 330px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const QuestionWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 12px;
  padding: 20px 0;

  @media (max-height: 700px) {
    padding: 0 0 30px 0;
  }

  @media (max-height: 628px) {
    padding: 0 0 20px 0;
  }
`;

const InputWrapper = styled.div`
  width: 100%;
  height: 150px;

  @media (max-height: 670px) {
    height: 130px;
  }

  @media (max-height: 628px) {
    height: 110px;
  }

  @media (max-height: 550px) {
    height: 90px;
  }
`;

const ButtonWrapper = styled.div`
  width: 100%;
  position: absolute;
  padding: 0 20px;
  bottom: 40px;
  left: 0;
`;
