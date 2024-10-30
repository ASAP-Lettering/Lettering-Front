"use client";

import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { theme } from "@/styles/theme";
import NavigatorBar from "@/components/common/NavigatorBar";
import Button from "@/components/common/Button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Letter from "@/components/letter/Letter";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { sendLetterState, useSsrComplectedState } from "@/recoil/letterStore";

const SendTemplatePage = () => {
  const router = useRouter();
  const { receiverName, content, images, templateType } =
    useRecoilValue(sendLetterState);
  const setSendLetterState = useSetRecoilState(sendLetterState);

  const [template, setTemplate] = useState<number>(templateType || 0);
  const totalPage = 10;
  /* SSR 완료 시 상태 업데이트 */
  const setSsrCompleted = useSsrComplectedState();

  // SSR 완료 후에 상태를 업데이트
  useEffect(() => {
    if (typeof window !== "undefined") {
      setSsrCompleted();
    }
  }, [setSsrCompleted]);

  const hanleChangeTemplate = (id: number) => {
    setTemplate(id);
  };

  const handleAddNext = () => {
    /* 다음 페이지 */
    setSendLetterState((prevState) => ({
      ...prevState,
      templateType: template,
    }));
    router.push("/send/preview");
  };

  return (
    <Layout>
      <NavigatorBar title="편지 보내기" cancel={false} />
      <Container>
        <Essential>* 필수</Essential>
        <Column>
          <Label>편지지를 골라볼까요? *</Label>
          <SmallText>마음에 드는 배경으로 편지를 저장할 수 있어요</SmallText>
          <LetterWrapper>
            <Letter
              showType="previewSend"
              contentType="one"
              id={"0"}
              templateType={template}
              name={receiverName}
              content={content}
              images={images}
              isImage={!(content.length > 0)}
              width="276px"
              height="283px"
            />
          </LetterWrapper>
          <TemplatesList>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
              <TemplateImage
                key={item}
                src={`/assets/letter/background_${item}.png`}
                width={70}
                height={70}
                alt="편지지"
                style={{ borderRadius: "8px" }}
                $selected={template === item}
                onClick={() => hanleChangeTemplate(item)}
              />
            ))}
          </TemplatesList>
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

export default SendTemplatePage;

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
`;

const SmallText = styled.div`
  color: ${theme.colors.gray300};
  ${(props) => props.theme.fonts.caption02};
  margin-bottom: 33px;
`;

const LetterWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const TemplatesList = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 12px;
  height: 78px;
  padding-left: 4px;
  margin-top: 69px;
  margin-bottom: 14px;
  overflow-x: scroll;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE, Edge */
  scrollbar-width: none; /* Firefox */
`;

const TemplateImage = styled(Image)<{ $selected: boolean }>`
  width: 70px;
  height: 70px;
  border-radius: 8px;
  box-sizing: content-box;

  ${({ $selected, theme }) =>
    $selected &&
    css`
      box-shadow: 0 0 0 4px ${theme.colors.sub03};
    `}
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
`;

const ButtonWrapper = styled.div`
  width: 100%;
  position: absolute;
  padding: 0 20px;
  bottom: 40px;
  left: 0;
`;
