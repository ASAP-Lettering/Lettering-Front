import { useEffect, useState } from "react";

const useKakaoSDK = () => {
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);
  const JS_KEY = process.env.NEXT_PUBLIC_JAVASCRIPT_KEY;

  useEffect(() => {
    if (!JS_KEY) {
      console.error("Kakao JavaScript key is missing");
      return;
    }

    const script = document.createElement("script");
    script.src = "https://developers.kakao.com/sdk/js/kakao.js";
    script.async = true;

    script.onload = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init(JS_KEY);
        setIsKakaoLoaded(true);
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [JS_KEY]);

  return isKakaoLoaded;
};

export default useKakaoSDK;
