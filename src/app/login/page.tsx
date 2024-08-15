"use client";

import SocialKakao from "@/components/signin/SocialKakao";
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
  flex-direction: column;
  justify-content: space-between;
  min-height: 100%;
  padding: 20px;
`;
