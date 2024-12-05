"use client";

import Button from "@/components/common/Button";
import Loader, { LoaderContainer } from "@/components/common/Loader";
import NavigatorBar from "@/components/common/NavigatorBar";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import styled from "styled-components";

const Signup = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const url = searchParams.get("url");

  const handleButtonClick = () => {
    if (url) {
      router.push(`/verify/letter?url=${url}`);
    } else {
      router.push("/onboarding");
    }
  };
  return (
    <Container>
      <MainWrapper>
        <NavigatorBar cancel={false} url="/login" />
        <Header>
          <HeaderTitle>
            회원가입 완료!
            <br /> 레터링에 오신 걸 환영해요
          </HeaderTitle>
          <HeaderSubTitle>
            편지에 담긴 진심으로 나만의 우주를 채워보세요!
          </HeaderSubTitle>
        </Header>
        <ImageWrapper>
          <Image src="/assets/signup/signup_image.png" />
        </ImageWrapper>
      </MainWrapper>
      <Wrapper>
        <Button
          buttonType="primary"
          text={url ? "나에게 온 편지 열기" : "나의 스페이스에 접속하기"}
          onClick={handleButtonClick}
        ></Button>
      </Wrapper>
    </Container>
  );
};

export default function SignupPaging() {
  return (
    <Suspense
      fallback={
        <LoaderContainer>
          <Loader />
        </LoaderContainer>
      }
    >
      <Signup />
    </Suspense>
  );
}

const Container = styled.div`
  color: white;
  display: flex;
  box-sizing: border-box;
  width: 100%;
  max-width: 393px;
  height: 100%;
  max-height: 853px;
  flex-direction: column;
  //overflow: scroll;
  justify-content: space-between;
  background-image: url("/assets/signup/signup_bg.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 0 24px;
  padding-top: 20px;
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

const ImageWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;

const Header = styled.div`
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  padding-left: 10px;
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

const Image = styled.img`
  display: flex;
  box-sizing: border-box;
  margin-top: 20px;
  width: 80%;
  height: auto;
  max-width: 520px;
  max-height: 400px;
`;

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 24px;
`;
