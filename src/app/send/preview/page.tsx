"use client";

import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { theme } from "@/styles/theme";
import NavigatorBar from "@/components/common/NavigatorBar";
import Button from "@/components/common/Button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Letter from "@/components/letter/Letter";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { postSendLtter } from "@/api/send/send";
import { sendLetterState } from "@/recoil/letterStore";
import KakaoShareButton from "@/components/common/KakaoShareButton";

const SendPreviewPage = () => {
  const router = useRouter();
  const { draftId, receiverName, content, images, templateType } =
    useRecoilValue(sendLetterState);

  const [isImage, setIsImage] = useState<boolean>(false);
  const resetLetterState = useResetRecoilState(sendLetterState);

  useEffect(() => {
    setIsImage(!!!(content.length > 0));
  }, []);
  const handleFlipLetter = () => {
    setIsImage(!isImage);
  };

  const handleSendLetter = async () => {
    /* 편지 등록 */
    try {
      await postSendLtter({
        draftId,
        receiverName,
        content,
        images,
        templateType,
      });
      console.log("편지 쓰기 성공");
      resetLetterState();
      router.push("/send/complete");
    } catch {
      console.log("편지 쓰기 실패");
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
          {/* <Button
            buttonType="primary"
            size="large"
            text="카카오로 편지 보내기"
            onClick={handleSendLetter}
          /> */}
          <KakaoShareButton senderName={receiverName} letterId={"aa"} />
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
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Column = styled.div`
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
`;

const LetterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 49px;
`;

const ChangeButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 4px;
  color: ${theme.colors.gray300};
  ${(props) => props.theme.fonts.caption02};
  margin-bottom: 33px;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  position: absolute;
  padding: 0 20px;
  bottom: 40px;
  left: 0;
`;
