"use client";

import SocialKakao from "@/components/signup/SocialKakao";
import { theme } from "@/styles/theme";
import styled from "styled-components";

export default function Login() {
  return (
    <Container>
      <ImageWrapper>
        <LogoTitle src="/assets/login/login_text.png" />
        <LogoText>편지로 수놓는 나의 스페이스</LogoText>
        <LogoImage src="/assets/login/login_logo.png" />
      </ImageWrapper>
      <SocialKakao />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  box-sizing: border-box;
  padding: 50px 20px;
  height: 100%;
  min-height: 754px;
  max-height: 852px;
  flex-direction: column;
  justify-content: space-between;
  background-image: url("/assets/login/login_bg.png");
  background-size: 100% auto;
  background-position: center;
  background-repeat: no-repeat;
//overflow-y: scroll;
  -webkit-scrollbar {
        display: none; 
    }

`;

const LogoTitle = styled.img`
  display: flex;
  box-sizing: border-box;
  width: 70%;
  height: auto;
  max-width: 257px;
  max-height: 150px;
    //드래그방지
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -o-user-select: none;
    user-select: none;
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
`;

const LogoText = styled.div`
  display: flex;
  width: 100%;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  line-height: 134%; /* 26.8px */
  letter-spacing: -0.6px;
  ${theme.fonts.regular16}
  justify-content: center;
    //드래그방지
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -o-user-select: none;
    user-select: none;
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
`;

const LogoImage = styled.img`
  display: flex;
  width: 150%;
  height: auto;
  max-width: 520px;
  max-height: 520px;
    //드래그방지
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -o-user-select: none;
    user-select: none;
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
`;

const ImageWrapper = styled.div`
  display: flex;
  box-sizing: border-box;
  padding-top: 50px;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;
