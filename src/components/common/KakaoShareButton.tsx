import { useEffect, useState } from "react";
import Button from "./Button";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface KakaoShareButtonProps {
  senderName: string;
  letterId: string;
}

const KakaoShareButton: React.FC<KakaoShareButtonProps> = ({
  senderName,
  letterId,
}) => {
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);
  const JS_KEY = process.env.NEXT_PUBLIC_JAVASCRIPT_KEY;
  const router = useRouter();

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
    const { Kakao, location } = window;

    if (!Kakao || !Kakao.isInitialized()) {
      console.error("Kakao is not initialized");
      return;
    }

    Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "나만의 디지털 편지 아카이브, 레터링",
        description: `${senderName} 님으로부터 한 통의 편지가 도착했습니다! 소중한 편지를 손쉽게 보관하고 나의 스페이스에 수놓아보세요!`,
        // imageUrl: imageAsset,
        link: {
          mobileWebUrl: location.href,
          webUrl: location.href,
        },
      },
    });

    Kakao.Share.sendScrap({
      requestUrl: location.origin + location.pathname,
      templateId: 112798,
      templateArgs: {
        senderName: senderName,
        id: letterId,
      },
      success: () => {
        router.push("/send/complete");
      },
      fail: (err: any) => {
        console.error("카카오 공유 실패:", err);
      },
    });
  };

  return (
    <Button
      buttonType="primary"
      text="카카오로 편지 보내기"
      onClick={shareToKakao}
    >
      <Image
        src="/assets/icons/ic_kakao_talk.svg"
        width={24}
        height={24}
        alt="카카오"
      />
    </Button>
  );
};

export default KakaoShareButton;

// import Button from "./Button";
// import Image from "next/image";

// interface KakaoShareButtonProps {
//   senderName: string;
//   letterId: string;
//   onSuccess: () => void;
// }

// const KakaoShareButton: React.FC<KakaoShareButtonProps> = ({
//   senderName,
//   letterId,
//   onSuccess,
// }) => {
//   const shareToKakao = () => {
//     const { Kakao, location } = window;

//     if (!Kakao || !Kakao.isInitialized()) {
//       console.error("Kakao is not initialized");
//       return;
//     }

//     Kakao.Share.sendScrap({
//       requestUrl: location.origin + location.pathname,
//       templateId: 112798,
//       templateArgs: {
//         senderName: senderName,
//         id: letterId,
//       },
//       success: () => {
//         onSuccess();
//       },
//       fail: (err: any) => {
//         console.log("카카오 공유 실패:", err);
//       },
//     });
//   };

//   return (
//     <Button
//       buttonType="primary"
//       text="카카오로 편지 보내기"
//       onClick={shareToKakao}
//     >
//       <Image
//         src="/assets/icons/ic_kakao_talk.svg"
//         width={24}
//         height={24}
//         alt="카카오"
//       />
//     </Button>
//   );
// };

// export default KakaoShareButton;
