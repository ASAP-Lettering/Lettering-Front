"use client";

import Button from "@/components/common/Button";
import KakaoShareButton from "@/components/common/KakaoShareButton";
import { sendLetterState } from "@/recoil/letterStore";
import { theme } from "@/styles/theme";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { useRecoilValue, useResetRecoilState } from "recoil";
import styled from "styled-components";

const SendCompletePage = () => {
  const router = useRouter();

  const { receiverName, letterId } = useRecoilValue(sendLetterState);

  return (
    <Layout>
      <Container>
        <Title>
          {receiverName}에게
          <br />
          편지를 전달했어요!
          <Sub>레터링으로 편지에 담긴 진심을 수놓았어요</Sub>
        </Title>
        <ImageWrapper>
          <Image src="/assets/send/send_complete.png" fill alt="편지" />
        </ImageWrapper>
      </Container>
      <ButtonWrapper>
        <Button
          buttonType="primary"
          text="홈으로 돌아가기"
          onClick={() => {
            router.push("/planet");
          }}
        />
        <KakaoShareButton
          type="reshare"
          letterId={letterId || ""}
          width="90px"
        />
      </ButtonWrapper>
    </Layout>
  );
};

export default SendCompletePage;

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  color: ${theme.colors.white};
  padding: 76px 24px 54px 24px;
  overflow-x: hidden;
  padding-bottom: 40px;
  background: ${(props) => props.theme.colors.bg};
  background-image: url("/assets/send/img_send_background.png");
  background-size: cover;
  background-position: bottom 80px center;
  background-repeat: no-repeat;
  position: relative;
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 80px;
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 8px;
  ${theme.fonts.heading01};
`;

const Sub = styled.div`
  color: ${theme.colors.gray300};
  ${theme.fonts.body07};
`;

const ImageWrapper = styled.div`
  width: 480px;
  height: 460px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-height: 580px) {
    width: 350px;
    height: 340px;
    top: 55%;
  }

  @media (max-height: 550px) {
    width: 300px;
    height: 290px;
    top: 55%;
  }
`;

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  position: absolute;
  padding: 0 24px;
  bottom: 54px;
  left: 0;
`;
