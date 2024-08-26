"use client";

import styled from "styled-components";

export default function Signin() {
  return <Container>회원가입 완료</Container>;
}

const Container = styled.div`
  display: flex;
  min-height: 100%;
  padding: 20px;
  color: white;
  background-image: url('/assets/signin/bg_signin_complete.svg'); 
  background-size: 100% auto; 
  background-position: center;
  background-repeat: no-repeat;
`;
