"use client";

import React, { Suspense, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { theme } from "@/styles/theme";
import NavigatorBar from "@/components/common/NavigatorBar";
import Button from "@/components/common/Button";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Letter from "@/components/letter/Letter";
import {
  postPhysicalLetter,
  putIndependentLetter,
  putLetter,
} from "@/api/letter/letter";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { registerLetterState } from "@/recoil/letterStore";
import Loader, { LoaderContainer } from "@/components/common/Loader";

const LetterPreviewPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const letterId = searchParams.get("letterId");
  const independent = searchParams.get("independent");
  const { senderName, content, images, templateType } =
    useRecoilValue(registerLetterState);

  const [isImage, setIsImage] = useState<boolean>(false);
  const resetLetterState = useResetRecoilState(registerLetterState);

  useEffect(() => {
    setIsImage(!!!(content.length > 0));
  }, []);

  const handleFlipLetter = () => {
    setIsImage(!isImage);
  };

  const handleRegisterLetter = async () => {
    if (letterId) {
      /* 편지 수정 */
      if (independent === "true") {
        try {
          await putIndependentLetter({
            letterId,
            senderName,
            content,
            images,
            templateType,
          });
          console.log("궤도 편지 수정 성공");
          resetLetterState();
          router.push(`/independent/${letterId}`);
        } catch {
          console.log("궤도 편지 수정 실패");
        }
      } else {
        try {
          await putLetter({
            letterId,
            senderName,
            content,
            images,
            templateType,
          });
          console.log("행성 편지 수정 성공");
          resetLetterState();
          router.push(`/letter/${letterId}`);
        } catch {
          console.log("행성 편지 수정 실패");
        }
      }
    } else {
      /* 편지 등록 */
      try {
        await postPhysicalLetter({ senderName, content, images, templateType });
        console.log("실물 편지 등록 성공");
        resetLetterState();
        router.push("/planet");
      } catch {
        console.log("실물 편지 등록 실패");
      }
    }
  };

  return (
    <Layout>
      <NavigatorBar
        title={letterId ? "편지 수정하기" : "새 편지 등록하기"}
        cancel={false}
      />
      <Container>
        <Column>
          <Label>이렇게 편지를 {letterId ? "수정" : "등록"}할까요?</Label>
          <LetterWrapper>
            <LetterContainer>
              <Letter
                showType="previewReceive"
                contentType="all"
                id={"0"}
                templateType={templateType}
                name={senderName}
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
            size="large"
            text={letterId ? "수정 완료" : "등록 완료"}
            onClick={handleRegisterLetter}
          />
        </ButtonWrapper>
      </Container>
    </Layout>
  );
};

export default function LetterPreviewPaging() {
  return (
    <Suspense
      fallback={
        <LoaderContainer>
          <Loader />
        </LoaderContainer>
      }
    >
      <LetterPreviewPage />
    </Suspense>
  );
}

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
