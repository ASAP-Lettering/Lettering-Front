import { getAccessToken, getRefreshToken } from "@/utils/storage";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getNewTokens } from "./login/user";
import { useRouter } from "next/router";

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

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// 응답 인터셉터
authClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    const router = useRouter();

    if (
      originalRequest &&
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await getNewTokens();
        // 원래 요청에 새로운 액세스 토큰을 헤더에 설정
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        // 새로운 토큰으로 원래 요청 재시도
        return authClient(originalRequest);
      } catch (refreshError) {
        router.push("/login");
        return Promise.reject(refreshError);
      }
    } else {
      router.push("/login");
    }

    return Promise.reject(error);
  }
);

export default client;
