// components/KakaoShareButton.tsx
import { useEffect, useState } from "react";
import Button from "./Button";

interface KakaoShareButtonProps {
  title: string;
  description: string;
  imageUrl: string;
  webUrl: string;
}

const KakaoShareButton: React.FC<KakaoShareButtonProps> = ({
  title,
  description,
  imageUrl,
  webUrl,
}) => {
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

  const shareToKakao = () => {
    console.log("버튼클릭");

    const { Kakao, location } = window;

    if (!Kakao || !Kakao.isInitialized()) {
      console.error("Kakao is not initialized");
      return;
    }

    Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "타이틀",
        description: "설명",
        imageUrl,
        link: {
          mobileWebUrl: location.href,
          webUrl: location.href,
        },
      },
    });
  };

  return (
    <Button
      buttonType="primary"
      text="카카오톡 공유하기"
      onClick={shareToKakao}
    />
  );
};

export default KakaoShareButton;
