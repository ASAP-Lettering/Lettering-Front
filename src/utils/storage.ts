import { getNewTokens } from "@/api/login/user";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

/* accessToken, refreshToken */
export const setTokens = (accessToken: string, refreshToken: string) => {
  if (typeof window !== "undefined") {
    setCookie("lettering-access", accessToken, 300);
    setCookie("lettering-refresh", refreshToken, 300);
  }
};

export const getAccessToken = () => {
  if (typeof window !== "undefined") {
    return getCookie("lettering-access");
  }
  return null;
};

export const getRefreshToken = () => {
  if (typeof window !== "undefined") {
    return getCookie("lettering-refresh");
  }
  return null;
};

export const clearTokens = () => {
  removeCookie("lettering-access");
  removeCookie("lettering-refresh");
};

/* letter URL */
export const setLetterUrl = (url: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("letter_url", url);
  }
  return null;
};

export const getLetterUrl = () => {
  if (typeof window !== "undefined") {
    localStorage.getItem("letter_url");
    console.log("url 있음");
  }
  return null;
};

export const clearLetterUrl = () => {
  localStorage.removeItem("letter_url");
};

export const getSession = async () => {
  const router = useRouter();
  await getNewTokens()
    .then((res) => {
      console.log("Refresh new Token!");
      setTokens(res.data.accessToken, res.data.refreshToken);
    })
    .catch((error) => {
      console.log(`Cannot Refresh: ${error.response.message}`);
      router.push("/login");
    });
};

/* spaceId */
export const setSpaceId = (spaceId: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("spaceId", spaceId);
  }
};

export const getSpaceId = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("spaceId");
  }
  return null;
};

/* 메인 홈 초기 유저 Toast 상태 */
export const setInitUserToast = () => {
  if (typeof window !== "undefined") {
    localStorage.setItem("initUserToast", "true");
  }
};

export const getInitUserToast = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("initUserToast");
  }
  return null;
};

export const clearInitUserToast = () => {
  localStorage.removeItem("initUserToast");
};

//쿠키
export const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date();
  expires.setDate(expires.getDate() + days);
  Cookies.set(name, value, { path: "/", expires });
};

export const getCookie = (name: string): string | null => {
  if (typeof window !== "undefined") {
    const cookieValue = Cookies.get(name);
    return cookieValue ? cookieValue : null;
  }
  return null;
};

export const removeCookie = (name: string) => {
  Cookies.remove(name, { path: "/" });
};
