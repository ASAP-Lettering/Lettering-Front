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
  // const content =
  //   "오래전에 함께 듣던 노래가 발걸음을 다시 멈춰서게 해\n이 거리에서 너를 느낄 수 있어\n널 이곳에서 꼭 다시 만날 것 같아\n너일까봐 한 번 더 바라보고\n너일까봐 자꾸 돌아보게 돼\n어디선가 같은 노래를 듣고\n날 생각하며 너 역시 멈춰있을까\n오래전에 함께 듣던 노래가\n거리에서 내게 우연히 들려온 것처럼\n살아가다 한 번 쯤 우연히 만날 것 같아\n사랑했던 그 모습 그대로\n오래전에 함께 듣던 노래가 발걸음을 다시 멈춰서게 해\n이 거리에서 너를 느낄 수 있어\n널 이곳에서 꼭 다시 만날 것 같아\n너일까봐 한 번 더 바라보고\n너일까봐 자꾸 돌아보게 돼\n어디선가 같은 노래를 듣고\n날 생각하며 너 역시 멈춰있을까\n오래전에 함께 듣던 노래가\n거리에서 내게 우연히 들려온 것처럼\n살아가다 한 번 쯤 우연히 만날 것 같아\n사랑했던 그 모습 그대로\n";

  // const imageData = [
  //   "https://via.assets.so/album.png?id=6&q=95&w=360&h=360&fit=fill",
  //   "https://via.assets.so/album.png?id=2&q=95&w=360&h=360&fit=fill",
  //   "https://via.assets.so/album.png?id=3&q=95&w=360&h=360&fit=fill",
  // ];

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
            <Letter
              showType="previewReceive"
              contentType="all"
              id={"0"}
              templateType={templateType}
              name={senderName}
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

  @media (max-height: 735px) {
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

  @media (max-height: 735px) {
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

  @media (max-height: 735px) {
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
