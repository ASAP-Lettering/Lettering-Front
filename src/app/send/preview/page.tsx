"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { theme } from "@/styles/theme";
import NavigatorBar from "@/components/common/NavigatorBar";
import Button from "@/components/common/Button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Letter from "@/components/letter/Letter";
import { useRecoilState, useRecoilValue } from "recoil";
import { postSendLtter } from "@/api/send/send";
import { sendLetterState } from "@/recoil/letterStore";
import useKakaoSDK from "@/hooks/useKakaoSDK";
import { userState } from "@/recoil/userStore";
import { getLetterShareStatus } from "@/api/letter/share";

const SendPreviewPage = () => {
  const router = useRouter();
  const isKakaoLoaded = useKakaoSDK();
  const [letterState, setLetterState] = useRecoilState(sendLetterState);
  const { draftId, receiverName, content, images, templateType, letterId } =
    useRecoilValue(sendLetterState);
  const { name } = useRecoilValue(userState);
  const [isImage, setIsImage] = useState<boolean>(false);
  const [letterCode, setLetterCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSharing, setIsSharing] = useState<boolean>(false);

  useEffect(() => {
    setIsImage(!!!(content.length > 0));
  }, []);

  const handleFlipLetter = () => {
    setIsImage(!isImage);
  };

  const handleSendLetterAndShare = async () => {
    /* 편지 전송 및 카카오 공유 */
    if (isSharing) return; // 중복 실행 방지

    setIsSharing(true);
    setIsLoading(true);

    const { Kakao, location } = window;

    if (!isKakaoLoaded) {
      console.error("Kakao SDK is not loaded yet");
      return;
    }

    try {
      // 1. 편지 전송 API 요청
      const response = await postSendLtter({
        draftId,
        receiverName,
        content,
        images,
        templateType,
      });
      console.log("편지 쓰기 성공");
      setLetterState((prevState) => ({
        ...prevState,
        letterId: response.data.letterCode,
      }));
      setLetterCode(response.data.letterCode);
      console.log(response.data.letterCode);

      // 2. 카카오 공유 로직 실행 (letterId 상태와 무관하게 항상 실행)
      Kakao.Share.sendScrap({
        requestUrl: location.origin + location.pathname,
        templateId: 112798,
        templateArgs: {
          senderName: name,
          id: response.data.letterCode,
        },
        serverCallbackArgs: {
          requestType: "SHARE",
          requestId: response.data.letterCode,
        },
        // 카카오톡 미설치 시 카카오톡 설치 경로이동
        installTalk: true,
      });
    } catch (error) {
      console.log("편지 전송 또는 카카오 공유 실패:", error);
    } finally {
      setIsLoading(false);
      setIsSharing(false);
    }
  };

  // 3. 공유 완료 상태 폴링
  useEffect(() => {
    if (letterCode.length > 0) {
      console.log("letterCode", letterCode);
      let intervalTime = 300;
      const interval = setInterval(async () => {
        try {
          const status = await getLetterShareStatus(letterCode || "");
          console.log(status);
          if (status.isShared) {
            console.log("완료");
            router.push("/send/complete");
            clearInterval(interval); // 폴링 중단
          }
        } catch (error) {
          console.error("공유 상태 조회 실패:", error);
        }
      }, intervalTime);

      return () => clearInterval(interval);
    }
  }, [letterCode]);

  return (
    <Layout>
      <NavigatorBar title="편지 보내기" cancel={false} />
      <Container>
        <Column>
          <Label>이렇게 편지를 보낼까요?</Label>
          <LetterWrapper>
            <LetterContainer>
              <Letter
                showType="previewSend"
                id={"0"}
                templateType={templateType}
                name={receiverName}
                content={content}
                images={images}
                isImage={isImage}
                width="100%"
                height="100%"
                padding="25px 35px 20px 35px"
              />
            </LetterContainer>
            {content.length > 0 && images.length > 0 && (
              <ChangeButton onClick={handleFlipLetter}>
                <Image
                  src="/assets/icons/ic_change.svg"
                  width={20}
                  height={20}
                  alt="클릭"
                />
                클릭하면 {isImage ? "편지 내용" : "사진"}을 확인할 수 있어요
              </ChangeButton>
            )}
          </LetterWrapper>
        </Column>
        <ButtonWrapper>
          <Button
            buttonType="primary"
            text={isLoading ? "잠시만 기다려주세요..." : "카카오로 편지 보내기"}
            onClick={handleSendLetterAndShare}
            disabled={!receiverName || !content || isLoading}
          >
            <Image
              src="/assets/icons/ic_kakao_talk.svg"
              width={24}
              height={24}
              alt="카카오"
            />
          </Button>
        </ButtonWrapper>
      </Container>
    </Layout>
  );
};

export default SendPreviewPage;

const Layout = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  gap: 7px;
  padding: 20px 20px 20px 20px;
  background-color: ${theme.colors.bg};
  position: relative;

  @media (max-height: 628px) {
    padding-top: 0px;
  }
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Column = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
`;

const Label = styled.div`
  display: flex;
  align-items: center;
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.title01};
  margin-top: 49px;
  margin-bottom: 28px;

  @media (max-height: 820px) {
    margin-top: 10px;
    margin-bottom: 20px;
  }

  @media (max-height: 690px) {
    margin-top: 0px;
    margin-bottom: 10px;
    ${theme.fonts.subtitle};
  }

  @media (max-height: 628px) {
    margin-top: 20px;
    margin-bottom: 20px;
    ${theme.fonts.body14};
  }
`;

const LetterWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 49px;

  @media (max-height: 780px) {
    gap: 20px;
  }

  @media (max-height: 628px) {
    gap: 20px;
  }

  @media (max-height: 580px) {
    gap: 30px;
  }
`;

const LetterContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 345px;
  min-height: 398px;
  max-height: 398px;

  @media (max-height: 660px) {
    max-width: 320px;
    min-height: 350px;
  }

  @media (max-height: 628px) {
    max-width: 320px;
    min-height: 320px;
    max-height: 320px;
  }

  @media (max-height: 580px) {
    max-width: 250px;
    min-height: 250px;
    max-height: 250px;
  }

  @media (max-height: 550px) {
    max-width: 220px;
    min-height: 220px;
    max-height: 220px;
  }
`;

const ChangeButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 4px;
  color: ${theme.colors.gray300};
  ${(props) => props.theme.fonts.caption02};
  margin-bottom: 100px;

  @media (max-height: 730px) {
    flex-direction: row;
    margin-bottom: 50px;
    gap: 10px;
  }

  @media (max-height: 628px) {
    flex-direction: row;
    margin-bottom: 50px;
    gap: 6px;
    ${theme.fonts.body12};
  }

  @media (max-height: 580px) {
    flex-direction: row;
    margin-bottom: 50px;
    gap: 6px;
    ${theme.fonts.body12};
  }
`;

const ButtonWrapper = styled.div`
  width: 100%;
  position: absolute;
  padding: 0 20px;
  bottom: 40px;
  left: 0;
`;
