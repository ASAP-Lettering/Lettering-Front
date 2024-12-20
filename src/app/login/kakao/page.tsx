"use client";

import { login } from "@/api/login/user";
import Loader from "@/components/common/Loader";
import { signupState } from "@/recoil/signupStore";
import {
  clearLetterUrl,
  getLetterUrl,
  setOnboarding,
  setTokens,
} from "@/utils/storage";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";

const Auth = () => {
  const [registerToken, setRegisterToken] = useRecoilState(signupState);
  const router = useRouter();
  const REST_API_KEY = process.env.NEXT_PUBLIC_REST_API_KEY;
  const [absoluteUrl, setAbsoluteUrl] = useState("");
  const [storeUrl, setstoreUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = `${window.location.protocol}//${window.location.host}/login/kakao`;
      const letterId = localStorage.getItem("letter_url");
      setAbsoluteUrl(url);
      if (letterId) setstoreUrl(letterId);
    }
  }, []);

  useEffect(() => {
    if (!absoluteUrl) {
      return;
    }
    const getToken = async () => {
      const AUTHORIZATION_CODE = new URL(window.location.href).searchParams.get(
        "code"
      );

      if (!AUTHORIZATION_CODE) {
        console.error("Authorization Code is missing");
        return;
      }

      try {
        const response = await axios.post(
          `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${REST_API_KEY}&redirect_uri=${absoluteUrl}&code=${AUTHORIZATION_CODE}`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        const kakao_accessToken = response.data.access_token;
        console.log(kakao_accessToken);
        if (kakao_accessToken) {
          login("KAKAO", kakao_accessToken)
            .then((res) => {
              console.log("accessToken", res.data.accessToken);
              setTokens(res.data.accessToken, res.data.refreshToken);
              /* 온보딩 여부 저장 */
              setOnboarding(res.data.isProcessedOnboarding);
              if (storeUrl) {
                router.push(`/verify/letter?url=${storeUrl}`);
                clearLetterUrl();
              } else {
                router.push("/planet");
              }
            })
            .catch((error) => {
              if (error.response && error.response.status === 401) {
                console.log("registerToken", error.response.data.registerToken);
                setRegisterToken(error.response.data.registerToken);
                if (storeUrl) {
                  router.push(`/signup/step1?url=${storeUrl}`);
                  clearLetterUrl();
                } else {
                  router.push("/signup/step1");
                }
              }
            });
        }
      } catch (error) {
        console.error(error);
        clearLetterUrl();
        return;
      }
    };
    getToken();
  }, [absoluteUrl]);

  return (
    <Container>
      <LoaderContainer>
        <Loader />
        <Guidetext>
          로그인 중입니다
          <br />
          잠시만 기다려주세요...
        </Guidetext>
      </LoaderContainer>
    </Container>
  );
};

export default Auth;

const Container = styled.div`
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  height: 100%;
  padding: 25px;
  background: ${(props) => props.theme.colors.bg};
`;

const LoaderContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Guidetext = styled.div`
  width: 100%;
  display: flex;
  text-align: center;
  justify-content: center;
  ${(props) => props.theme.fonts.regular16};
  color: ${(props) => props.theme.colors.gray300};
  padding-top: 10px;
`;
