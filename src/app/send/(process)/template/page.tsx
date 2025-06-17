'use client';

import React, { Suspense, useEffect, useState } from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import Button from '@/components/common/Button/Button';
import { useRouter, useSearchParams } from 'next/navigation';
import Letter from '@/components/letter/Letter';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { sendLetterState, useSsrComplectedState } from '@/recoil/letterStore';
import LetterTemplateList from '@/components/letter/LetterTemplateList';
import { ALL_TEMPLATES } from '@/constants/templates';
import Loader, { LoaderContainer } from '@/components/common/Loader';

const SendTemplatePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { receiverName, content, images, templateType } =
    useRecoilValue(sendLetterState);
  const setSendLetterState = useSetRecoilState(sendLetterState);
  const [maxLinesPerPage, setMaxLinesPerPage] = useState(7);
  const [fontSize, setFontSize] = useState<string>('16px');

  const [template, setTemplate] = useState<number>(
    templateType || ALL_TEMPLATES[0]
  );

  const isGuest = searchParams.get('guest') === 'true';

  /* SSR 완료 시 상태 업데이트 */
  const setSsrCompleted = useSsrComplectedState();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSsrCompleted();
    }
  }, [setSsrCompleted]);

  useEffect(() => {
    const updateMaxLines = () => {
      if (window.innerHeight > 725) {
        setMaxLinesPerPage(8);
        setFontSize('16px');
      } else if (window.innerHeight > 628) {
        setMaxLinesPerPage(7);
        setFontSize('16px');
      } else if (window.innerHeight > 580) {
        setMaxLinesPerPage(6);
        setFontSize('16px');
      } else if (window.innerHeight > 550) {
        setMaxLinesPerPage(5);
        setFontSize('16px');
      } else {
        setMaxLinesPerPage(4);
        setFontSize('11px');
      }
    };

    updateMaxLines();
    window.addEventListener('resize', updateMaxLines);

    return () => {
      window.removeEventListener('resize', updateMaxLines);
    };
  }, []);

  const hanleChangeTemplate = (id: number) => {
    setTemplate(id);
  };

  const handleAddNext = () => {
    /* 다음 페이지 */
    setSendLetterState((prevState) => ({
      ...prevState,
      templateType: template
    }));

    router.push(`/send/preview${isGuest ? '?guest=true' : ''}`);
  };

  return (
    <>
      <Container>
        <Column>
          <Label>편지지 고르기</Label>
          <LetterWrapper>
            <LetterContainer>
              <Letter
                key={`${maxLinesPerPage}-${fontSize}`}
                showType="send"
                contentType="one"
                isTemplate={true}
                id={'0'}
                templateType={template}
                name={receiverName}
                content={content}
                images={images}
                isImage={!(content.length > 0)}
                width="100%"
                height="100%"
                padding="40px 30px"
                maxLines={maxLinesPerPage}
                fontSize={fontSize}
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

export default function SendTemplatePaging() {
  return (
    <Suspense
      fallback={
        <LoaderContainer>
          <Loader />
        </LoaderContainer>
      }
    >
      <SendTemplatePage />
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
