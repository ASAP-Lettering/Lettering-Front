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
  }
  return null;
};

export const clearLetterUrl = () => {
  localStorage.removeItem("letter_url");
};
