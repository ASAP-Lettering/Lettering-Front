"use client";

import Button from "@/components/common/Button";
import Loader, { LoaderContainer } from "@/components/common/Loader";
import NavigatorBar from "@/components/common/NavigatorBar";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import styled from "styled-components";

const ErrorLetterPage = () => {
  return (
    <Container>
      <MainWrapper>
        <Header>
          <HeaderTitle>열람 접근이 허용되지 않은 편지예요</HeaderTitle>
          <HeaderSubTitle>
            레터링 편지 열람은 지정된 수신자만 가능해요.
            <br />
            본인의 편지가 맞는지 다시 한 번 확인해주세요.
          </HeaderSubTitle>
        </Header>
      </MainWrapper>
      <div>
        <ImageWrapper>
          <Image src="/assets/signup/verify_image.png" />
        </ImageWrapper>
        <Button buttonType="primary" text="내 스페이스 바로가기"></Button>
      </div>
    </Container>
  );
};

export default function ErrorLetterPaging() {
  return (
    <Suspense
      fallback={
        <LoaderContainer>
          <Loader />
        </LoaderContainer>
      }
    >
      <ErrorLetterPage />
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
  justify-content: center;
  text-align: center;
`;

const HeaderTitle = styled.div`
    width: 100%;
    ${(props) => props.theme.fonts.heading01};
    margin-top: 5rem;
`;

const HeaderSubTitle = styled.div`
    width: 100%;
    ${(props) => props.theme.fonts.body09};
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
