'use client';

import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';
import Pagination from '@/components/letter/Pagination';

import { Suspense, useState, useRef, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import styled from 'styled-components';

const Onboarding = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPage = 2;
  const handlers = useSwipeable({
    onSwipedLeft: () =>
      setCurrentPage(
        currentPage < totalPage - 1 ? currentPage + 1 : currentPage
      ),
    onSwipedRight: () =>
      setCurrentPage(currentPage > 0 ? currentPage - 1 : currentPage),
    trackTouch: true,
    trackMouse: true
  });
  const xOffset = -currentPage * 100;
  // 페이지 변경 시 애니메이션 효과 적용
  useEffect(() => {
    console.log(currentPage);
  }, [currentPage]);

  return (
    <Container>
      <MainContainer>
        <Pagination currentPage={currentPage} totalPage={totalPage} />
        <ContentWrapper {...handlers}>
          <ContentSlider style={{ transform: `translateX(${xOffset}%)` }}>
            <Content active={currentPage === 0}>페이지 1의 내용</Content>
            <Content active={currentPage === 1}>페이지 2의 내용</Content>
          </ContentSlider>
        </ContentWrapper>
        <Button buttonType="primary" text="다음" />
      </MainContainer>
    </Container>
  );
};

export default function LetterTypePaging() {
  return (
    <Suspense
      fallback={
        <LoaderContainer>
          <Loader />
        </LoaderContainer>
      }
    >
      <Onboarding />
    </Suspense>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 393px;
  height: 100%;
  justify-content: space-between;
  color: white;
  background-image: url('/assets/mypage/img_background.png');
  background-size: cover;
  background-position: center;
  overflow: hidden;
  position: relative;
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  overflow: hidden;
  box-sizing: border-box;
  width: 100%;
  touch-action: none; /* 기본 스크롤 방지 */
  transition: transform 0.3s ease-in-out; /* 페이지 전환 애니메이션 */
`;

const ContentWrapper = styled.div`
  overflow: hidden;
  width: 100%;
  height: auto;
  box-sizing: border-box;
  border-radius: 10px;
  transition: transform 0.3s ease-in-out;
  @media (max-width: 375px) {
    max-height: 235px;
  }
`;

const ContentSlider = styled.div`
  display: flex;
  transition: transform 0.5s ease-out;
`;

const Content = styled.div<{ active: boolean }>`
  width: 100%;
  height: 100%;
  min-height: 500px;
  flex-shrink: 0;
  display: flex;
  overflow: hidden;
  align-items: center;
`;

/* 로딩 */
const LoaderContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
