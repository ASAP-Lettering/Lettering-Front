"use client";

import Button from "@/components/common/Button";
import Loader, { LoaderContainer } from "@/components/common/Loader";
import NavigatorBar from "@/components/common/NavigatorBar";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import styled from "styled-components";

const VerifyComplete = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const url = searchParams.get("url");

  const handleButtonClick = () => {
    router.push(`/verify/letter?url=${url}`);
  };
  return (
    <Container>
      <MainWrapper>
        <NavigatorBar cancel={false} />
        <Header>
          <HeaderTitle>본인 인증이 완료되었어요</HeaderTitle>
          <HeaderSubTitle>
            받은 편지 속, 소중한 마음을 읽고 저장해볼까요?
          </HeaderSubTitle>
        </Header>
      </MainWrapper>
      <div>
        <ImageWrapper>
          <Image src="/assets/signup/verify_image.png" />
        </ImageWrapper>
        <Button
          buttonType="primary"
          text="편지 바로 열기"
          onClick={handleButtonClick}
        ></Button>
      </div>
    </Container>
  );
};

export default function VerifyCompletePaging() {
  return (
    <Suspense
      fallback={
        <LoaderContainer>
          <Loader />
        </LoaderContainer>
      }
    >
      <VerifyComplete />
    </Suspense>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  height: 100%;
  max-height: 852px;
  color: white;
  padding: 25px;
  overflow-x: hidden;
  padding-bottom: 40px;
  background: ${(props) => props.theme.colors.bg};
  /* background-image: url('/assets/signup/verify_image.png'); 
    background-size: 550px auto; 
    background-position: bottom 80px center;
    background-repeat: no-repeat; */
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

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const Image = styled.img`
  display: flex;
  width: 140%;
  height: auto;
  max-width: 537px;
  max-height: 400px;
`;
