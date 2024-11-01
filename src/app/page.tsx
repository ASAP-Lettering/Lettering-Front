"use client";

import { getAllSpaceName, getNewTokens } from "@/api/login/user";
import Button from "@/components/common/Button";
import KakaoShareButton from "@/components/common/KakaoShareButton";
import Loader from "@/components/common/Loader";
import {
  clearInitUserToast,
  clearTokens,
  getAccessToken,
  getCookie,
  setCookie,
} from "@/utils/storage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styled from "styled-components";

export default function Home() {
  const router = useRouter();
  const accessToken = getAccessToken();

  useEffect(() => {
    if (!accessToken) {
      router.push("/login");
    } else {
      router.push("/planet");
    }
  }, []);

  return (
    <Container>
      {/* <ButtonContainer>
        <Button
          buttonType="primary"
          text="로그아웃하기"
          onClick={handleLogout}
        ></Button>
        <KakaoShareButton letterId="aa" />
      </ButtonContainer> */}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  height: 100vh;
  padding: 25px;
  background: ${(props) => props.theme.colors.bg};
`;

const LoaderContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
