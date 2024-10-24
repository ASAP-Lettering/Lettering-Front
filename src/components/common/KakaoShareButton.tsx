import { useEffect, useState } from "react";
import Button from "./Button";
import Image from "next/image";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { userState } from "@/recoil/userStore";
import useKakaoSDK from "@/hooks/useKakaoSDK";

type buttonType = "default" | "small";

interface KakaoShareButtonProps {
  type?: buttonType;
  letterId: string;
}

const KakaoShareButton: React.FC<KakaoShareButtonProps> = ({
  type = "default",
  letterId,
}) => {
  const isKakaoLoaded = useKakaoSDK();
  const { name } = useRecoilValue(userState);

  const shareToKakao = () => {
    const { Kakao, location } = window;

    if (!Kakao || !Kakao.isInitialized()) {
      console.error("Kakao is not initialized");
      return;
    }

    // Kakao.Share.sendDefault({
    //   objectType: "feed",
    //   content: {
    //     title: "나만의 디지털 편지 아카이브, 레터링",
    //     description: `${senderName} 님으로부터 한 통의 편지가 도착했습니다! 소중한 편지를 손쉽게 보관하고 나의 스페이스에 수놓아보세요!`,
    //     imageUrl: imageAsset,
    //     link: {
    //       mobileWebUrl: location.href,
    //       webUrl: location.href,
    //     },
    //   },
    // });

    Kakao.Share.sendScrap({
      requestUrl: location.origin + location.pathname,
      templateId: 112798,
      templateArgs: {
        senderName: name,
        id: letterId,
      },
    });
  };

  return type === "default" ? (
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
  ) : (
    <ReShareBtnWrapper onClick={shareToKakao}>
      <img src="/assets/icons/ic_kakao_talk.svg" />
      편지 다시 보내기
    </ReShareBtnWrapper>
  );
};

export default KakaoShareButton;

const ReShareBtnWrapper = styled.button`
  display: flex;
  width: 45%;
  box-sizing: border-box;
  padding: 12px;
  gap: 10px;
  border-radius: 20px;
  text-align: center;
  justify-content: center;
  min-width: 151px;
  flex-direction: row;
  color: ${(props) => props.theme.colors.gray100};
  background-color: ${(props) => props.theme.colors.gray800};
  ${(props) => props.theme.fonts.caption01};
`;
