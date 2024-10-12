import { getNewTokens } from "@/api/login/user";
import { useRouter } from "next/navigation";

/* accessToken, refreshToken */
export const setTokens = (accessToken: string, refreshToken: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("lettering_access", accessToken);
    localStorage.setItem("lettering_refresh", refreshToken);
  }
};

export const getAccessToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("lettering_access");
  }
  return null;
};

export const getRefreshToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("lettering_refresh");
  }
  return null;
};

export const clearTokens = () => {
  localStorage.removeItem("lettering_access");
  localStorage.removeItem("lettering_refresh");
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

export const getSpaceId= () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("spaceId");
  }
  return null;
};

/* 메인 홈 초기 유저 Toast 상태 */
export const setInitUserToast = () => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("initUserToast", "true");
  }
};

export const getInitUserToast= (): string | null  => {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem("initUserToast");
  }
  return null;
};

export const clearInitUserToast= ()  => {
  sessionStorage.removeItem("initUserToast");
};