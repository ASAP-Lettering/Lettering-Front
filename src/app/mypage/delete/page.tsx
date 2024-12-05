"use client";

import { deleteUser, logout } from "@/api/mypage/user";
import Button from "@/components/common/Button";
import Check from "@/components/common/Check";
import Dropdown from "@/components/common/Dropdown";
import Input from "@/components/common/Input";
import Loader, { LoaderContainer } from "@/components/common/Loader";
import NavigatorBar from "@/components/common/NavigatorBar";
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
      <Wrapper>
        <NavigatorBar title="회원 탈퇴" cancel={false} />
      </Wrapper>
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
          <Input
            inputType="boxTextArea"
            value={textarea}
            onChange={setTextarea}
            //placeholder="BoxTexarea Input (height=150px)"
            height="150px"
          />
        </QuestionWrapper>
        <Check
          checkType="box"
          labelFont="button03"
          label="모든 데이터를 삭제하고 탈퇴하는 것에 동의합니다"
          checked={isCheckedBox}
          onChange={handleBoxChange}
        />
      </MainWrapper>
      <Wrapper>
        <Button
          buttonType="primary"
          size="large"
          text="탈퇴하기"
          disabled={!isAbled}
          onClick={handleDeleteUser}
        />
      </Wrapper>
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
  color: white;
  background: ${(props) => props.theme.colors.bg};
`;

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
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

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 24px;
`;

const MainTitle = styled.div`
  ${(props: any) => props.theme.fonts.title01};
  color: ${(props: any) => props.theme.colors.white};
  padding: 9px 0;
`;

const SubTitle = styled.div`
  ${(props: any) => props.theme.fonts.body08};
  color: ${(props: any) => props.theme.colors.white};
  margin-bottom: 35px;

  //반응형
  @media (max-width: 375px) {
    margin-bottom: 5px;
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
`;

const QuestionWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 12px;
  padding: 20px 0;
`;
