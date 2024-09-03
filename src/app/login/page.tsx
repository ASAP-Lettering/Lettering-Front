"use client";

import SocialKakao from "@/components/signin/SocialKakao";
import { useEffect } from "react";
import styled from "styled-components";

export default function Login() {
  return (
    <Container>
      <SocialKakao />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  min-height: 100%;
  padding: 20px;
  flex-direction: column-reverse;
  background-image: url('/assets/login/background_login.svg'); 
  background-size: 100% auto; 
  background-position: center;
  background-repeat: no-repeat;
`;
