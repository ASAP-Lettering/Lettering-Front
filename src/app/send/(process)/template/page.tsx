'use client';

import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { theme } from '@/styles/theme';
import Button from '@/components/common/Button';
import { useRouter } from 'next/navigation';
import Letter from '@/components/letter/Letter';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { sendLetterState, useSsrComplectedState } from '@/recoil/letterStore';
import LetterTemplateList from '@/components/letter/LetterTemplateList';
import { ALL_TEMPLATES } from '@/constants/templates';

const SendTemplatePage = () => {
  const router = useRouter();
  const { receiverName, content, images, templateType } =
    useRecoilValue(sendLetterState);
  const setSendLetterState = useSetRecoilState(sendLetterState);

  const [template, setTemplate] = useState<number>(
    templateType || ALL_TEMPLATES[0]
  );

  /* SSR 완료 시 상태 업데이트 */
  const setSsrCompleted = useSsrComplectedState();

  useEffect(() => {
    if (typeof window !== 'undefined') {
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
      templateType: template
    }));
    router.push('/send/preview');
  };

  return (
    <>
      <Container>
        <Column>
          <Label>편지지 고르기</Label>
          <LetterWrapper>
            <LetterContainer>
              <Letter
                showType="previewSend"
                contentType="one"
                id={'0'}
                templateType={template}
                name={receiverName}
                content={content}
                images={images}
                isImage={!(content.length > 0)}
                width="100%"
                height="100%"
                padding="40px 30px"
              />
            </LetterContainer>
          </LetterWrapper>
          <LetterTemplateList
            selectedTemplate={template}
            onChangeTemplate={hanleChangeTemplate}
            templates={ALL_TEMPLATES}
          />
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
    </>
  );
};

export default SendTemplatePage;

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

const Column = styled.div`
  margin-bottom: 40px;
`;

const Label = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.subtitle};
  margin-bottom: 12px;

  @media (max-height: 628px) {
    ${theme.fonts.body6}
    margin-bottom: 12px;
  }

  @media (max-height: 580px) {
    ${theme.fonts.body10};
    margin-bottom: 8px;
  }
`;

const LetterWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const LetterContainer = styled.div`
  width: 276px;
  min-height: 284px;
  max-height: 284px;

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

const ButtonWrapper = styled.div`
  width: 100%;
  position: absolute;
  padding: 0 20px;
  bottom: 40px;
  left: 0;
`;
