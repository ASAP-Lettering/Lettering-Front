"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Auth = () => {
  const router = useRouter();
  const REST_API_KEY = process.env.NEXT_PUBLIC_REST_API_KEY;
  const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI;

  useEffect(() => {
    const AUTHORIZATION_CODE = new URL(window.location.href).searchParams.get(
      "code"
    );
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
          `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&code=${AUTHORIZATION_CODE}`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        const kakao_accessToken = response.data.access_token;
        console.log(kakao_accessToken);
        if (kakao_accessToken) {
          router.push("/");
        }
      } catch (error) {
        console.error(error);
        return;
      }
    };
    getToken();

    // async function getTokenFromKakao(authCode: string) {
    //   const tokenUrl = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&code=${AUTHORIZATION_CODE}`;
    //   const response = await fetch(tokenUrl, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //   }).then((res) => res.json());
    //   console.log(response.access_token);
    //   return response;
    // }
    // if (AUTHORIZATION_CODE) {
    //   getTokenFromKakao(AUTHORIZATION_CODE);
    // }
    // router.push("/");
  }, []);

  return null;
};

export default Auth;