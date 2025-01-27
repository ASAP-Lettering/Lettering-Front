'use client';

import React, { Suspense, useEffect, useState } from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import Button from '@/components/common/Button';
import { useRouter, useSearchParams } from 'next/navigation';
import Letter from '@/components/letter/Letter';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  registerLetterState,
  useSsrComplectedState
} from '@/recoil/letterStore';
import Loader, { LoaderContainer } from '@/components/common/Loader';
import LetterTemplateList from '@/components/letter/LetterTemplateList';
import { ALL_TEMPLATES } from '@/constants/templates';
import Header from '@/components/store/Header';

const LetterTemplatePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const letterId = searchParams.get('letterId');
  const independent = searchParams.get('independent');
  const { senderName, content, images, templateType } =
    useRecoilValue(registerLetterState);
  const setRegisterLetterState = useSetRecoilState(registerLetterState);

  const [template, setTemplateType] = useState<number>(
    templateType || ALL_TEMPLATES[0]
  );

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
      templateType: template
    }));
    if (letterId) {
      if (independent === 'true') {
        router.push(`/store/preview?letterId=${letterId}&independent=true`);
      } else {
        router.push(`/store/preview?letterId=${letterId}`);
      }
    } else {
      router.push('/store/preview');
    }
  };

  return (
    <>
      <Header current={3} edit={!!letterId} />
      <Container>
        <Column>
          <Label>편지지 고르기</Label>
          <LetterWrapper>
            <LetterContainer>
              <Letter
                showType="previewReceive"
                contentType="one"
                id={'0'}
                templateType={template}
                name={senderName}
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

  @media (max-height: 725px) {
    max-height: 250px;
    min-height: 250px;
  }

  @media (max-height: 628px) {
    max-width: 250px;
    min-width: 250px;
    max-height: 230px;
    min-height: 230px;
  }

  @media (max-height: 580px) {
    max-width: 250px;
    min-width: 250px;
    max-height: 210px;
    min-height: 210px;
  }

  @media (max-height: 550px) {
    max-width: 240px;
    min-width: 240px;
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
