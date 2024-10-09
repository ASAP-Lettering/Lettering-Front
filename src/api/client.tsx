import { clearTokens, getAccessToken, getRefreshToken } from "@/utils/storage";
import axios from "axios";
import { getNewTokens } from "./login/user";
import Router from "next/router";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    "Access-Control-Allow-Credentials": "include",
    withCredentials: true,
  },
});

export const authClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    "Access-Control-Allow-Credentials": "include",
    withCredentials: true,
  },
});

authClient.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

authClient.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 재발급 중복처리
    if (error.status === 401) {
      try {
        const newAccessToken = await getNewTokens().catch((tokenError) => {
          console.error("토큰 갱신 실패:", tokenError);
          throw tokenError;
        });
        if (newAccessToken) {
          console.log("새 액세스 토큰 받아 처리중입니다.");
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return authClient(originalRequest);
        }
      } catch (refreshError) {
        console.error("토큰 갱신 중 에러 발생:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    //500일때는 에러페이지로
    if (error.status === 500) {
      window.location.href = "/error";
    }
    return Promise.reject(error);
  }
);

export default client;
