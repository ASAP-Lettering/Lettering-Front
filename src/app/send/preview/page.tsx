"use client";

import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
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

const SendPreviewPage = () => {
  const router = useRouter();
  const [letterState, setLetterState] = useRecoilState(sendLetterState);
  const { draftId, receiverName, content, images, templateType, letterId } =
    useRecoilValue(sendLetterState);
  const { name } = useRecoilValue(userState);
  const [isImage, setIsImage] = useState<boolean>(false);

  const isKakaoLoaded = useKakaoSDK();

  useEffect(() => {
    setIsImage(!!!(content.length > 0));
  }, []);

  const handleFlipLetter = () => {
    setIsImage(!isImage);
  };

  const handleSendLetterAndShare = async () => {
    /* 편지 전송 및 카카오 공유 */
    try {
      // 1. 편지 전송 API 요청
      if (!letterId) {
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

        // 2. 카카오 공유 로직 실행
        if (isKakaoLoaded && response.data.letterCode) {
          setTimeout(() => {
            const { Kakao, location } = window;
            Kakao.Share.sendScrap({
              requestUrl: location.origin + location.pathname,
              templateId: 112798,
              templateArgs: {
                senderName: name,
                id: response.data.letterCode,
              },
            });
          }, 1000);
          setTimeout(() => {
            router.push("/send/complete");
          }, 8000);
        }
      }
    } catch (error) {
      console.log("편지 전송 또는 카카오 공유 실패:", error);
    }
  };

  return (
    <Layout>
      <NavigatorBar title="편지 보내기" cancel={false} />
      <Container>
        <Column>
          <Label>이렇게 편지를 보낼까요?</Label>
          <LetterWrapper>
            <Letter
              showType="previewSend"
              id={"0"}
              templateType={templateType}
              name={receiverName}
              content={content}
              images={images}
              isImage={isImage}
              width="345px"
              height="398px"
              padding="25px 35px 20px 35px"
            />
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
            text="카카오로 편지 보내기"
            onClick={handleSendLetterAndShare}
            disabled={!receiverName || !content}
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

  @media (max-height: 550px) {
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

  @media (max-height: 628px) {
    margin-top: 10px;
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

  @media (max-height: 628px) {
    gap: 20px;
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
