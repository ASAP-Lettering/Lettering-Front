"use client";

import Button from "@/components/common/Button";
import NavigatorBar from "@/components/common/NavigatorBar";
import styled from "styled-components";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "@/components/common/Input";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import Toast from "@/components/common/Toast";
import useMeasure from "react-use-measure";
import BottomSheet from "@/components/common/BottomSheet";
import { Suspense, useState } from "react";
import Loader, { LoaderContainer } from "@/components/common/Loader";
import { signupState, userInfo } from "@/recoil/signupStore";
import { signup } from "@/api/login/user";

const SignupStep3 = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isPopupToast, setisPopupToast] = useState(false);
  const [viewportRef, { height: viewportHeight }] = useMeasure();
  const [isBottomUp, setIsBottomUp] = useState(false);
  const [isDisplayed, setIsDisplayed] = useState(false);
  const [isVaild, setIsVaild] = useState(true);
  const [user, setUser] = useRecoilState(userInfo);
  const [registerToken, setRegisterToken] = useRecoilState(signupState);

  const handleButtonClick = () => {
    if (canSignin()) {
      setIsBottomUp(true);
    } else {
      handleShowToast();
      setIsDisplayed(false);
    }
    router.push(`/signup/complete`);
  };

  useEffect(() => {
    if (isBottomUp) {
      setIsDisplayed(true);
    } else {
      setTimeout(() => {
        setIsDisplayed(false);
      }, 490);
    }
  }, [isBottomUp]);

  const handleLoginClick = () => {
    //router.push(`/signin/complete`);
    signup({
      registerToken: registerToken,
      privatePermission: user.privatePermission,
      servicePermission: user.servicePermission,
      marketingPermission: user.marketingPermission,
      birthday: user.birthday,
      realName: name,
    })
      .then((res) => {
        console.log("accessToken", res.data.accessToken);
        localStorage.setItem("lettering_access", res.data.accessToken);
        localStorage.setItem("lettering_refresh", res.data.refreshToken);
      })
      .catch((error) => {
        console.log(error);
        router.push("/error");
        return;
      });

    router.push(`/signin/complete`);
    console.log(user);
  };

  //   useEffect(() => {
  //     console.log(isVaild);
  //   }, [name]);

  const canSignin = () => {
    if (isVaild && name.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  const handleShowToast = () => {
    setisPopupToast(true);
    setTimeout(() => {
      setisPopupToast(false);
    }, 3000);
  };

  const handleBottomUpChange = (state: boolean) => {
    setIsBottomUp(state);
  };

  return (
    <Container ref={viewportRef}>
      {isDisplayed && (
        <BottomSheet
          viewport={`${viewportHeight - 30}px`}
          title={`'${name}'가 본인 이름이 맞나요?`}
          subtitle="본인의 이름이 아닐 경우, 편지를 보내거나 받을 때에
          오류가 발생할 수 있어요"
          isOpen={isBottomUp}
          handleOpen={handleBottomUpChange}
          onConfirm={handleLoginClick}
        />
      )}
      <MainWrapper>
        <NavigatorBar cancel={false} />
        <Header>
          <HeaderTitle>
            회원가입을 하기 전
            <br />
            먼저 본인 인증이 필요해요
          </HeaderTitle>
          <HeaderSubTitle>
            별명이 아닌 정확한 실명을 입력해주세요
          </HeaderSubTitle>
        </Header>
        <InputWrapper>
          <Input
            inputType="underline"
            value={name}
            onChange={setName}
            placeholder="ex)홍길동"
            isValid={isVaild}
            isValidChange={setIsVaild}
            errorMessage="단독 자음, 모음만 쓸 수 없어요 (ex) ㄱ, ㅏ)"
          />
        </InputWrapper>
        {isPopupToast && (
          <Toast
            text={`형식에 맞지 않는 이름입니다!`}
            icon={true}
            bottom="120px"
            left="50%"
          />
        )}
      </MainWrapper>
      <ButtonWrapper>
        <DescriptionText onClick={() => router.push("/signup/step3/check")}>
          왜 실명 인증이 필요한가요?
        </DescriptionText>
        <Button
          buttonType="primary"
          text="다음"
          onClick={handleButtonClick}
        ></Button>
      </ButtonWrapper>
    </Container>
  );
};

export default function SignupStep3Paging() {
  return (
    <Suspense
      fallback={
        <LoaderContainer>
          <Loader />
        </LoaderContainer>
      }
    >
      <SignupStep3 />
    </Suspense>
  );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: space-between;
    min-height: 100%;
    color: white;
    background:${(props) => props.theme.colors.bg};
    padding: 25px;
    padding-bottom: 40px;
    position: relative;
    overflow: hidden;
`;

const MainWrapper = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  margin-bottom: 100px;
`;

const InputWrapper = styled.div`
  padding: 10px;
`;

const DescriptionText = styled.button`
  ${(props) => props.theme.fonts.regular14};
  color: ${(props) => props.theme.colors.gray400};
  text-decoration: underline;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 23px;
  cursor: pointer;
`;

const HeaderTitle = styled.div`
  width: 100%;
  ${(props) => props.theme.fonts.heading01};
  margin-top: 2.5rem;
`;

const HeaderSubTitle = styled.div`
  width: 100%;
  ${(props) => props.theme.fonts.body07};
  color: ${(props) => props.theme.colors.gray300};
  padding-top: 10px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
