"use client";

import React, { Suspense, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { theme } from "@/styles/theme";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { useRouter, useSearchParams } from "next/navigation";
import { useRecoilState } from "recoil";
import { registerLetterState } from "@/recoil/letterStore";
import Loader, { LoaderContainer } from "@/components/common/Loader";

const LetterSenderPage = () => {
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
        router.push(`/store/content?letterId=${letterId}&independent=true`);
      } else {
        router.push(`/store/content?letterId=${letterId}`);
      }
    } else {
      router.push("/store/content");
    }
  };

  return (
    <>
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
    </>
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
      <LetterSenderPage />
    </Suspense>
  );
}

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

const ButtonWrapper = styled.div`
  width: 100%;
  position: absolute;
  padding: 0 20px;
  bottom: 40px;
  left: 0;
  z-index: 1000;
`;
