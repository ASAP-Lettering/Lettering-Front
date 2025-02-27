'use client';

import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';
import Pagination from '@/components/letter/Pagination';

import { Suspense, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSwipeable } from 'react-swipeable';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { putOnboarding } from '@/api/mypage/user';
import { setOnboarding } from '@/utils/storage';

const Onboarding = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const router = useRouter();
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

  const handleBtnClick = () => {
    if (currentPage === 0) {
      setCurrentPage(1);
    } else {
      putOnboarding();
      setOnboarding('true');
      router.push('/planet');
    }
  };

  return (
    <Container>
      <MainContainer>
        <Pagination currentPage={currentPage} totalPage={totalPage} />
        <ContentWrapper {...handlers}>
          <ContentSlider style={{ transform: `translateX(${xOffset}%)` }}>
            <Content active={currentPage === 0}>
              <Text>
                <MainTitle>채팅방 속 잠들어 있는 편지를 보관하세요</MainTitle>
                <SubTitle>
                  소중한 사람에게 받은 메신저 편지를
                  <br /> 레터링에 모아둘 수 있어요
                </SubTitle>
              </Text>
              <ContentImage src="/assets/onboarding/onboarding-pic2.png" />
            </Content>
            <Content active={currentPage === 1}>
              <Text>
                <MainTitle>드래그하여 손쉽게 편지를 정리해봐요</MainTitle>
                <SubTitle>
                  행성은 폴더의 역할과 같아요
                  <br />
                  원하는 행성 안에 편지를 보관할 수 있어요
                </SubTitle>
              </Text>
              <ContentImage src="/assets/gif/onboarding_final.gif" />
            </Content>
          </ContentSlider>
        </ContentWrapper>
        {currentPage === 0 && (
          <LetterImageContainer>
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <LetterImage
                key={num}
                src={`/assets/letter/background_${num}.png`}
                alt={`hex-${num}`}
              />
            ))}
          </LetterImageContainer>
        )}
      </MainContainer>
      <ButtonWrapper>
        <Button
          buttonType="primary"
          text={currentPage === 0 ? '다음' : '시작하기'}
          onClick={handleBtnClick}
        />
      </ButtonWrapper>
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
  height: 100%;
  min-height: 550px;
  justify-content: space-between;
  color: ${theme.colors.white};
  background-image: url('/assets/mypage/img_background.png');
  background-size: cover;
  background-position: center;
  overflow: hidden;
  position: relative;
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 550px;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 80px 24px;
  overflow: hidden;
  box-sizing: border-box;
  touch-action: none; /* 기본 스크롤 방지 */
  transition: transform 0.3s ease-in-out; /* 페이지 전환 애니메이션 */
`;

const ContentWrapper = styled.div`
  overflow: hidden;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border-radius: 10px;
  transition: transform 0.3s ease-in-out;
`;

const ContentSlider = styled.div`
  display: flex;
  width: 100%;
  transition: transform 0.5s ease-out;
`;

const Content = styled.div<{ active: boolean }>`
  width: 100%;
  height: 100vh;
  min-height: 550px;
  flex-shrink: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  position: relative;
`;

const Text = styled.div`
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 100px;

  @media (max-height: 850px) {
    padding-top: 80px;
  }
  @media (max-height: 800px) {
    padding-top: 60px;
  }
  @media (max-height: 700px) {
    padding-top: 30px;
  }
  @media (max-height: 628px) {
    padding-top: 10px;
  }
  @media (max-height: 580px) {
    padding-top: 0px;
  }
`;

const MainTitle = styled.div`
  color: ${theme.colors.white};
  text-align: center;
  ${theme.fonts.title01};
  box-sizing: border-box;
  padding-top: 31px;
  user-select: none;
`;

const SubTitle = styled.div`
  ${(props) => props.theme.fonts.body07};
  color: ${(props) => props.theme.colors.gray200};
  text-align: center;
  box-sizing: border-box;
  padding: 18px 0;
  user-select: none;
`;

const LetterImageContainer = styled.div`
  display: flex;
  position: absolute;
  bottom: 110px;
  justify-content: center;
  align-items: center;
  gap: 8px; // 이미지 간격 조정
`;

const LetterImage = styled.img`
  width: 50px;
  aspect-ratio: 1; // 정사각형 비율 유지
  border-radius: 5px;
  object-fit: cover;
`;

const ContentImage = styled.img`
  max-width: 346px;
  max-height: 60vh;
  height: auto;
  align-items: center;
  border-radius: 12px;
  border: 4px solid ${theme.colors.gray800};
  object-fit: contain;
  position: absolute;
  bottom: 65px;
  left: 50%;
  transform: translateX(-50%);

  //드래그방지
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -o-user-select: none;
  user-select: none;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
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

const ButtonWrapper = styled.div`
  width: 100%;
  padding: 0 24px;
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
`;
