"use client";

import React, { Suspense, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { theme } from "@/styles/theme";
import NavigatorBar from "@/components/common/NavigatorBar";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { useRouter, useSearchParams } from "next/navigation";
import { useRecoilState } from "recoil";
import { registerLetterState } from "@/recoil/letterStore";
import Loader, { LoaderContainer } from "@/components/common/Loader";
import ProgressBar from "@/components/common/ProgressBar";

const LetterReceiverPage = () => {
  const router = useRouter();
  const [sender, setSender] = useState<string>("");
  const [isImageUploadLoading, setImageUploadLoading] =
    useState<boolean>(false); // 서버 이미지 업로드 상태

  const [letterState, setLetterState] = useRecoilState(registerLetterState);
  const searchParams = useSearchParams();
  const letterId = searchParams.get("letterId");
  const independent = searchParams.get("independent");

  useEffect(() => {
    if (letterState) {
      setSender(letterState.senderName);
    }
  }, [letterState]);

  const handleSenderChange = (newValue: string) => {
    setSender(newValue);
    setLetterState((prevState) => ({
      ...prevState,
      senderName: newValue,
    }));
  };

  const handleAddNext = async () => {
    /* 다음 페이지 */
    setLetterState((prevState) => ({
      ...prevState,
      senderName: sender,
    }));
    if (letterId) {
      if (independent === "true") {
        router.push(`/letter/content?letterId=${letterId}&independent=true`);
      } else {
        router.push(`/letter/content?letterId=${letterId}`);
      }
    } else {
      router.push("/letter/content");
    }
  };

  return (
    <Layout>
      <NavigatorBar
        title={letterId ? "편지 수정하기" : "받은 편지 보관하기"}
        cancel={false}
      />
      <ProgressBarWrapper>
        <ProgressBar current={1} total={3} />
      </ProgressBarWrapper>
      <Container>
        <Column>
          <Label>나에게 편지 보낸 사람</Label>
          <Input
            inputType="boxText"
            value={sender}
            onChange={handleSenderChange}
            placeholder="이름을 입력해주세요"
          />
        </Column>
      </Container>
      <ButtonWrapper>
        <Button
          buttonType="primary"
          size="large"
          text={isImageUploadLoading ? "Loading..." : "다음"}
          disabled={!sender}
          onClick={handleAddNext}
        />
      </ButtonWrapper>
    </Layout>
  );
};

export default function LetterReceiverPaging() {
  return (
    <Suspense
      fallback={
        <LoaderContainer>
          <Loader />
        </LoaderContainer>
      }
    >
      <LetterReceiverPage />
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
  padding: 20px;
  background-color: ${theme.colors.bg};
  position: relative;

  @media (max-height: 550px) {
    padding-top: 0px;
  }
`;

const ProgressBarWrapper = styled.div`
  width: 100%;
  padding: 32px 0 56px 0;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-height: 628px) {
    position: relative;
  }
`;

const Column = styled.div<{ $position?: boolean }>`
  margin-bottom: 40px;

  @media (max-height: 710px) {
    margin-bottom: 20px;
  }

  @media (max-height: 628px) {
    ${({ $position }) =>
      $position &&
      css`
        width: 100%;
        position: absolute;
        top: 300px;
      `}
  }

  @media (max-height: 580px) {
    ${({ $position }) =>
      $position &&
      css`
        width: 100%;
        position: absolute;
        top: 280px;
      `}
  }
`;

const Label = styled.div<{ $show?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.subtitle};
  margin-bottom: 12px;

  @media (max-height: 628px) {
    ${theme.fonts.body6}
    margin-bottom: 12px;
    ${({ $show }) =>
      $show === false &&
      css`
        display: none;
        margin-bottom: 0px;
      `}
  }

  @media (max-height: 580px) {
    ${theme.fonts.body10};
    margin-bottom: 8px;
  }
`;

const Count = styled.div`
  display: flex;
  color: ${theme.colors.gray400};
  ${theme.fonts.body09};

  @media (max-height: 628px) {
    ${theme.fonts.body11};
  }
`;

const Span = styled.span`
  color: ${theme.colors.white};
`;

const AddImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
`;

const AddImageLabel = styled.label`
  width: 100%;
  height: 57px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 18px;
  border-radius: 12px;
  background: ${theme.colors.gray700};
  color: ${theme.colors.gray400};
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  ${theme.fonts.body08}

  @media (max-height: 628px) {
    height: 48px;
    ${theme.fonts.body12};
  }

  @media (max-height: 580px) {
    height: 42px;
    ${theme.fonts.caption04}
  }
`;

const SmallText = styled.div`
  color: ${theme.colors.gray500};
  ${theme.fonts.caption04};
  text-align: center;
  margin-bottom: 100px;

  @media (max-height: 550px) {
    display: none;
  }
`;

const AddImagesLabel = styled.label`
  width: 52px;
  height: 52px;
  padding: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
  background: ${theme.colors.gray700};
  color: ${theme.colors.gray400};
  ${(props) => props.theme.fonts.body08};
  text-align: center;

  @media (max-height: 628px) {
    width: 45px;
    height: 45px;
    ${theme.fonts.body12};
  }

  @media (max-height: 580px) {
    width: 39px;
    height: 39px;
    ${theme.fonts.body12};
  }
`;

const ImagesList = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 6px;
  margin-top: 16px;
  margin-bottom: 100px;

  @media (max-height: 628px) {
    margin-top: 0px;
  }
`;

const ImagesWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 13px;
`;

const ImageDiv = styled.div`
  width: 52px;
  height: 52px;
  position: relative;

  @media (max-height: 628px) {
    width: 45px;
    height: 45px;
  }

  @media (max-height: 580px) {
    width: 39px;
    height: 39px;
  }
`;

const DeleteIcon = styled.button`
  width: 20px;
  height: 20px;
  position: absolute;
  top: -5px;
  right: -5px;

  @media (max-height: 628px) {
    width: 18px;
    height: 18px;
  }

  @media (max-height: 580px) {
    width: 13px;
    height: 13px;
  }
`;

const ButtonWrapper = styled.div`
  width: 100%;
  position: absolute;
  padding: 0 20px;
  bottom: 40px;
  left: 0;
  z-index: 1000;
`;
