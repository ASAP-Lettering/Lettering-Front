"use client";

import { login } from "@/api/login/user";
import { signinState } from "@/recoil/signinStore";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useRecoilState } from "recoil";

const Auth = () => {
  const [registerToken, setRegisterToken] = useRecoilState(signinState);
  const router = useRouter();
  const REST_API_KEY = process.env.NEXT_PUBLIC_REST_API_KEY;
  const REDIRECT_URL = process.env.NEXT_PUBLIC_REDIRECT_URI;
  const storeUrl = localStorage.getItem("letter_url");

  useEffect(() => {
    const getToken = async () => {
      const AUTHORIZATION_CODE = new URL(window.location.href).searchParams.get(
        "code"
      );

      if (!AUTHORIZATION_CODE) {
        console.error("Authorization Code is missing");
        if (storeUrl) {
          localStorage.removeItem("letter_url");
        }
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
          login("kakao", kakao_accessToken).then((res) => {
            if (res.data.registerToken) {
              console.log("registerToken", res.data.registerToken);
              setRegisterToken(res.data.registerToken);
              if (storeUrl) {
                router.push(`/signin/step1?url=${storeUrl}`);
                localStorage.removeItem("letter_url");
              } else {
                router.push("/signin/step1");
              }
            } else {
              console.log("accessToken", res.data.accessToken);
              localStorage.setItem("lettering_access", res.data.accessToken);
              localStorage.setItem("lettering_refresh", res.data.refreshToken);
              if (storeUrl) {
                router.push(`/verify?url=${storeUrl}`);
                localStorage.removeItem("letter_url");
              } else {
                router.push("/");
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

  return null;
};

export default Auth;
