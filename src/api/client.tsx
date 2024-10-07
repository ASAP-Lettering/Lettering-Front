import { getAccessToken, getRefreshToken } from "@/utils/storage";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getNewTokens } from "./login/user";

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
  (config: InternalAxiosRequestConfig) => {
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
    if (response.status >= 400) {
      console.log("인터셉터 status:", response.status);
    }
    console.log("인터셉터 응답:", response);
    return response;
  },
  async (error) => {
    console.log(error.response);
    return Promise.reject(error);
  }
);

export default client;
