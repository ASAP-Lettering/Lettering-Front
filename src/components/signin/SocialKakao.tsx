import React, { useEffect, useState } from "react";
import Image from "next/image";
import styled from "styled-components";
import { useRouter, useSearchParams } from "next/navigation";
import { useRecoilState } from "recoil";
import { accessState } from "@/recoil/accessStore";

const SocialKakao = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const url = searchParams.get("url");
  const REST_API_KEY = process.env.NEXT_PUBLIC_REST_API_KEY;
  const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI;
  const accessToken = localStorage.getItem("lettering_access");
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
      localStorage.setItem("letter_url", url);
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

export default SocialKakao;

const SocialLoginBox = styled.div`
  width: 100%;
  height: 100%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 2rem;
`;

const StyledImage = styled(Image)`
  width: 100%;
  height: 100%;
  padding: 0 20px;
  object-fit: contain;
`;
