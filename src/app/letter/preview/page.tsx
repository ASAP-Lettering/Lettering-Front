"use client";

import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { theme } from "@/styles/theme";
import NavigatorBar from "@/components/common/NavigatorBar";
import Button from "@/components/common/Button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Letter from "@/components/letter/Letter";
import { postPhysicalLetter } from "@/api/letter/letter";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { registerLetterState } from "@/recoil/letterStore";

const LetterPreviewPage = () => {
  const router = useRouter();
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
    /* 편지 등록 */
    try {
      await postPhysicalLetter({ senderName, content, images, templateType });
      console.log("실물 편지 등록 성공");
      resetLetterState();
      router.push("/planet");
    } catch {
      console.log("실물 편지 등록 실패");
    }
  };

  return (
    <Layout>
      <NavigatorBar title="새 편지 등록하기" cancel={false} />
      <Container>
        <Column>
          <Label>이렇게 편지를 등록할까요?</Label>
          <LetterWrapper>
            <Letter
              showType="previewReceive"
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
            text="등록 완료"
            onClick={handleRegisterLetter}
          />
        </ButtonWrapper>
      </Container>
    </Layout>
  );
};

export default LetterPreviewPage;

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
