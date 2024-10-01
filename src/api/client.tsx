import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    "Access-Control-Allow-Credentials": "include",
    withCredentials: true,
  },
});

export default client;
