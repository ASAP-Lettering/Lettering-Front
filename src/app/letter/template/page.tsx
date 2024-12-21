"use client";

import React, { Suspense, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { theme } from "@/styles/theme";
import NavigatorBar from "@/components/common/NavigatorBar";
import Button from "@/components/common/Button";
import { useRouter, useSearchParams } from "next/navigation";
import Letter from "@/components/letter/Letter";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  registerLetterState,
  useSsrComplectedState,
} from "@/recoil/letterStore";
import Loader, { LoaderContainer } from "@/components/common/Loader";
import LetterTemplateList from "@/components/letter/LetterTemplateList";
import { ALL_TEMPLATES } from "@/constants/templates";

const LetterTemplatePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const letterId = searchParams.get("letterId");
  const independent = searchParams.get("independent");
  const { senderName, content, images, templateType } =
    useRecoilValue(registerLetterState);
  const setRegisterLetterState = useSetRecoilState(registerLetterState);

  const [template, setTemplateType] = useState<number>(templateType || 0);
  const totalPage = 10;

  /* SSR 완료 시 상태 업데이트 */
  const setSsrCompleted = useSsrComplectedState();

  useEffect(() => {
    setSsrCompleted();
  }, [setSsrCompleted]);

  const hanleChangeTemplate = (id: number) => {
    setTemplateType(id);
  };

  const handleAddNext = () => {
    /* 다음 페이지 */
    setRegisterLetterState((prevState) => ({
      ...prevState,
      templateType: template,
    }));
    if (letterId) {
      if (independent === "true") {
        router.push(`/letter/preview?letterId=${letterId}&independent=true`);
      } else {
        router.push(`/letter/preview?letterId=${letterId}`);
      }
    } else {
      router.push("/letter/preview");
    }
  };

  return (
    <Layout>
      <NavigatorBar
        title={letterId ? "편지 수정하기" : "받은 편지 보관하기"}
        cancel={false}
      />
      <Container>
        <Essential>* 필수</Essential>
        <Column>
          <Label>편지지를 골라볼까요? *</Label>
          <SmallText>마음에 드는 배경으로 편지를 보관할 수 있어요</SmallText>
          <LetterWrapper>
            <LetterContainer>
              <Letter
                showType="previewReceive"
                contentType="one"
                id={"0"}
                templateType={template}
                name={senderName}
                content={content}
                images={images}
                isImage={!(content.length > 0)}
                width="100%"
                height="100%"
              />
            </LetterContainer>
          </LetterWrapper>
          <LetterTemplateList
            selectedTemplate={template}
            onChangeTemplate={hanleChangeTemplate}
            templates={ALL_TEMPLATES}
          />
          <Page>
            <Current>{template + 1}</Current>/{totalPage}
          </Page>
        </Column>
        <ButtonWrapper>
          <Button
            buttonType="primary"
            size="large"
            text="다음"
            disabled={template == null}
            onClick={handleAddNext}
          />
        </ButtonWrapper>
      </Container>
    </Layout>
  );
};

export default function LetterTemplatePaging() {
  return (
    <Suspense
      fallback={
        <LoaderContainer>
          <Loader />
        </LoaderContainer>
      }
    >
      <LetterTemplatePage />
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

  @media (max-height: 550px) {
    padding-top: 0px;
  }
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
`;

const Essential = styled.div`
  text-align: right;
  color: ${theme.colors.gray400};
  ${(props) => props.theme.fonts.caption03};
  margin-bottom: 17px;

  @media (max-height: 780px) {
    display: none;
  }
`;

const Column = styled.div`
  margin-bottom: 40px;
`;

const Label = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.title01};

  @media (max-height: 628px) {
    ${theme.fonts.title01};
  }

  @media (max-height: 580px) {
    ${theme.fonts.subtitle};
  }

  @media (max-height: 550px) {
    ${theme.fonts.body14};
  }
`;

const SmallText = styled.div`
  color: ${theme.colors.gray300};
  ${(props) => props.theme.fonts.caption02};
  margin-bottom: 33px;

  @media (max-height: 680px) {
    margin-bottom: 10px;
  }

  @media (max-height: 580px) {
    ${theme.fonts.body09};
  }

  @media (max-height: 550px) {
    ${theme.fonts.body13};
    margin-bottom: 24px;
  }
`;

const LetterWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const LetterContainer = styled.div`
  width: 100px;
  min-width: 276px;
  max-height: 283px;

  @media (max-height: 628px) {
    max-width: 250px;
    min-width: 250px;
    max-height: 260px;
    min-height: 260px;
  }

  @media (max-height: 580px) {
    max-width: 220px;
    min-width: 220px;
    max-height: 220px;
    min-height: 220px;
  }

  @media (max-height: 550px) {
    max-width: 178px;
    min-width: 178px;
    max-height: 182px;
    min-height: 182px;
  }
`;

const Page = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  color: ${theme.colors.gray500};
  ${theme.fonts.caption03};
`;

const Current = styled.span`
  color: ${theme.colors.white};
  margin-bottom: 100px;

  @media (max-height: 628px) {
    margin-bottom: 50px;
  }
`;

const ButtonWrapper = styled.div`
  width: 100%;
  position: absolute;
  padding: 0 20px;
  bottom: 40px;
  left: 0;
`;
