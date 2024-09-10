import React, { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import styled from "styled-components";
import { useRouter, useSearchParams } from "next/navigation";
import { useRecoilState } from "recoil";
import { accessState } from "@/recoil/accessStore";
import { getAccessToken, setLetterUrl } from "@/utils/storage";
import Loader, { LoaderContainer } from "../common/Loader";

const SocialKakao = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const url = searchParams.get("url");
  const REST_API_KEY = process.env.NEXT_PUBLIC_REST_API_KEY;
  const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI;
  const accessToken = getAccessToken();
  const KAKAO_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code&url=${url}`;
  const [localAccessToken, setAccessToken] = useRecoilState(accessState);

  const handleLogin = () => {
    //이때 localStorage에 저장된 accessToken이 만료되었는지 확인해야함.
    // if (accessToken) {
    //   if (url) {
    //     router.push(`/verify?url=${url}`);
    //   } else {
    //     router.push("/");
    //   }
    //   setAccessToken(accessToken);
    // } else {
    if (url) {
      setLetterUrl(url);
    }
    window.location.href = KAKAO_URL;
  };

  return (
    <SocialLoginBox onClick={handleLogin}>
      <StyledImage
        src="/assets/login/mobile_btn_login.svg"
        width={440}
        height={48}
        alt="kakao"
      />
    </SocialLoginBox>
  );
};

export default function SocialKakaoPaging() {
  return (
    <Suspense
      fallback={
        <LoaderContainer>
          <Loader />
        </LoaderContainer>
      }
    >
      <SocialKakao />
    </Suspense>
  );
}

const SocialLoginBox = styled.div`
  display: flex;
  box-sizing: border-box;
  width: 100%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledImage = styled(Image)`
  width: 100%;
  height: 100%;
  padding: 0 20px;
  object-fit: contain;
`;
