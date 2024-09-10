"use client";

import { login } from "@/api/login/user";
import Loader from "@/components/common/Loader";
import { signinState } from "@/recoil/signinStore";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";

const Auth = () => {
  const [registerToken, setRegisterToken] = useRecoilState(signinState);
  const router = useRouter();
  const REST_API_KEY = process.env.NEXT_PUBLIC_REST_API_KEY;
  const REDIRECT_URL = process.env.NEXT_PUBLIC_REDIRECT_URI;
  const storeUrl =
    typeof window !== "undefined" ? localStorage.getItem("letter_url") : null;

  useEffect(() => {
    const getToken = async () => {
      const AUTHORIZATION_CODE = new URL(window.location.href).searchParams.get(
        "code"
      );

      if (!AUTHORIZATION_CODE) {
        console.error("Authorization Code is missing");
        // if (storeUrl) {
        //   localStorage.removeItem("letter_url");
        // }
        return;
      }

      try {
        const response = await axios.post(
          `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URL}&code=${AUTHORIZATION_CODE}`,
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
              localStorage.setItem("lettering_access", res.data.accessToken);
              localStorage.setItem("lettering_refresh", res.data.refreshToken);
              if (storeUrl) {
                router.push(`/verify?url=${storeUrl}`);
                localStorage.removeItem("letter_url");
              } else {
                router.push("/");
              }
            })
            .catch((error) => {
              if (error.response && error.response.status === 401) {
                console.log("registerToken", error.response.data.registerToken);
                setRegisterToken(error.response.data.registerToken);
                if (storeUrl) {
                  router.push(`/signin/step1?url=${storeUrl}`);
                  localStorage.removeItem("letter_url");
                } else {
                  router.push("/signin/step1");
                }
              }
            });
        }
      } catch (error) {
        console.error(error);
        return;
      }
    };
    getToken();
  }, []);

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
  max-height: 852px;
  background:${(props) => props.theme.colors.bg};
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
