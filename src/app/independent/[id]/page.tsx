'use client';

import { getIndependentLetter } from '@/api/letter/letter';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';
import NavigatorBar from '@/components/common/NavigatorBar';
import Letter from '@/components/letter/Letter';
import { registerLetterState } from '@/recoil/letterStore';
import { theme } from '@/styles/theme';
import { IndependentLetterType, LetterDetailType } from '@/types/letter';
import { getAccessToken } from '@/utils/storage';
import { useParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

const IndependentLetterPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const letterId = Array.isArray(id) ? id[0] : id;
  const [key, setKey] = useState(1);
  const [letterData, setLetterData] = useState<IndependentLetterType | null>(
    null
  );
  const [isImage, setIsImage] = useState(false);
  const accessToken = getAccessToken();
  const [letterState, setLetterState] = useRecoilState(registerLetterState);
  const [isPopup, setIsPopup] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  const [maxLinesPerPage, setMaxLinesPerPage] = useState(12);
  const [fontSize, setFontSize] = useState<string>('16px');

  useEffect(() => {
    const updateMaxLines = () => {
      if (window.innerHeight > 780) {
        setMaxLinesPerPage(11);
        setFontSize('16px');
      } else if (window.innerHeight > 660) {
        setMaxLinesPerPage(9);
        setFontSize('16px');
      } else if (window.innerHeight > 628) {
        setMaxLinesPerPage(8);
        setFontSize('16px');
      } else if (window.innerHeight > 580) {
        setMaxLinesPerPage(7);
        setFontSize('16px');
      } else {
        setMaxLinesPerPage(8);
        setFontSize('11px');
      }
    };

    updateMaxLines();
    window.addEventListener('resize', updateMaxLines);

    return () => {
      window.removeEventListener('resize', updateMaxLines);
    };
  }, []);

  //편지 수정 버튼 클릭
  const handleModify = () => {
    setLetterState({
      draftId: null,
      senderName: letterData?.senderName || '',
      content: letterData?.content || '',
      images: letterData?.images || [],
      previewImages: letterData?.images || [],
      templateType: letterData?.templateType || 1
    });

    router.push(`/store/sender?letterId=${id}`);
  };

  //편지 행성 변경
  const handlePlanet = () => {
    router.push(
      `/planet/move?letter=${id}&senderName=${letterData?.senderName}`
    );
  };

  const handleCancel = () => {
    setIsDelete(false);
    setIsPopup(false);
  };

  const handleButtonClick = (id: string) => {
    router.push(`/independent/${id}`);
  };

  const changeImageorContent = () => {
    setIsImage(!isImage);
    setKey(key + 1);
  };

  const replaceDashWithDot = (dateString: string) => {
    return dateString.replace(/-/g, '.');
  };

  useEffect(() => {
    if (
      letterData &&
      letterData?.content.length < 1 &&
      letterData.images.length > 0
    ) {
      setIsImage(true);
    }
  }, [letterData]);

  useEffect(() => {
    //LetterData 받아오는 로직
    if (id && accessToken) {
      const letterId = Array.isArray(id) ? id[0] : id;
      getIndependentLetter(letterId)
        .then((res) => {
          setLetterData(res.data);
        })
        .catch((error) => {
          console.log(error.response);
        });
    }
  }, []);

  return letterData ? (
    <Container>
      <NavigatorBarWrapper>
        <NavigatorBar cancel={false} url="/planet" title="새 편지함" />
      </NavigatorBarWrapper>
      <IconWrapper>
        <img
          src="/assets/icons/ic_edit_2.svg"
          alt="Edit"
          onClick={handleModify}
        />
        <img
          src="/assets/icons/ic_more.svg"
          alt="More options"
          onClick={() => {
            setIsPopup(!isPopup);
          }}
        ></img>
        {isPopup && (
          <PopupContainer>
            {letterData.sendDate && (
              <ModalDate>{replaceDashWithDot(letterData.sendDate)}</ModalDate>
            )}
            <PopupBtn onClick={handlePlanet}>이동</PopupBtn>
            <PopupBtn onClick={() => setIsDelete(true)}>삭제</PopupBtn>
          </PopupContainer>
        )}
      </IconWrapper>
      <MainWrapper>
        <LetterContainer
          $hasChangeButton={
            letterData.content.length > 0 && letterData.images.length > 0
          }
        >
          <Letter
            key={`${key}-${maxLinesPerPage}`}
            showType="receive"
            contentType="all"
            id={letterId || ''}
            templateType={letterData.templateType}
            name={letterData.senderName}
            content={letterData.content}
            images={letterData.images}
            date={letterData.sendDate}
            isImage={isImage}
            width="100%"
            height="100%"
            maxLines={maxLinesPerPage}
            fontSize={fontSize}
          />
        </LetterContainer>
        {letterData.images.length > 0 && letterData.content.length > 0 ? (
          <ChangeButtonWrapper onClick={changeImageorContent}>
            <img src="/assets/icons/ic_change_image.svg"></img>
            <div>
              클릭하면 {isImage ? '편지 내용' : '사진'}을 확인할 수 있어요!
            </div>
          </ChangeButtonWrapper>
        ) : (
          <WhiteSpace />
        )}
        <PaginationWrapper>
          {letterData.prevLetter ? (
            <Page
              onClick={() => handleButtonClick(letterData.prevLetter!.letterId)}
            >
              <img src="/assets/icons/ic_arrow_left.svg" />
              {letterData.prevLetter.senderName}
            </Page>
          ) : (
            <></>
          )}
          <CurrentPage>{letterData.senderName}</CurrentPage>
          {letterData.nextLetter ? (
            <Page
              onClick={() => handleButtonClick(letterData.nextLetter!.letterId)}
            >
              {letterData.nextLetter.senderName}
              <img src="/assets/icons/ic_arrow_right.svg" />
            </Page>
          ) : (
            <></>
          )}
        </PaginationWrapper>
      </MainWrapper>
      <ButtonContainer>
        <Button
          buttonType="primary"
          size="large"
          text="답장하기"
          onClick={() => router.push('/send/letter')}
        />
      </ButtonContainer>
    </Container>
  ) : (
    <LoaderContainer>
      <Loader />
      <Guidetext>잠시만 기다려주세요...</Guidetext>
    </LoaderContainer>
  );
};

export default function IndependentLetterPaging() {
  return (
    <Suspense
      fallback={
        <LoaderContainer>
          <Loader />
        </LoaderContainer>
      }
    >
      <IndependentLetterPage />
    </Suspense>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  color: ${theme.colors.white};
  background: ${(props) => props.theme.colors.bg};
  position: relative;
`;

const NavigatorBarWrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 18px 18px 9px 18px;
`;

const IconWrapper = styled.div`
  display: flex;
  position: relative;
  flex-direction: row;
  justify-content: end;
  padding: 0 18px;
  margin-bottom: 10px;
  gap: 8px;
`;

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 18px;
  overflow-y: auto;
  overflow-x: hidden;

  @media (max-height: 680px) {
    justify-content: flex-start;
  }
`;

const PopupContainer = styled.div`
  width: 88px;
  height: 124px;
  flex-shrink: 0;
  position: absolute;
  top: 54px;
  right: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 12px;
  background: rgba(62, 65, 81, 0.7);
  backdrop-filter: blur(8px);
  z-index: 1;
  padding: 12px;
  box-sizing: border-box;

  @media (max-height: 628px) {
    width: 78px;
    height: 110px;
  }

  @media (max-height: 580px) {
    width: 76px;
    height: 95px;
    padding: 10px;
  }
`;

const ModalDate = styled.div`
  display: flex;
  box-sizing: border-box;
  white-space: nowrap;
  ${(props) => props.theme.fonts.caption03};
  color: ${theme.colors.gray400};
  width: 100%;
  justify-content: center;
  padding-top: 8px;

  @media (max-height: 628px) {
    padding-top: 5px;
  }

  @media (max-height: 580px) {
    padding-top: 0px;
    ${theme.fonts.caption05}
  }
`;

const PopupBtn = styled.button`
  ${(props: any) => props.theme.fonts.button01};
  color: ${(props: any) => props.theme.colors.white};
  padding: 10px;

  @media (max-height: 628px) {
    padding: 5px;
  }

  @media (max-height: 580px) {
    ${theme.fonts.button03};
  }
`;

const LetterContainer = styled.div<{ $hasChangeButton: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 345px;
  min-height: 398px;
  max-height: 398px;
  margin-bottom: ${({ $hasChangeButton }) => ($hasChangeButton ? '0' : '80px')};

  @media (max-height: 780px) {
    min-height: 350px;
    max-height: 350px;
  }

  @media (max-height: 660px) {
    min-height: 330px;
    max-height: 330px;
  }

  @media (max-height: 628px) {
    min-height: 310px;
    max-height: 310px;
  }

  @media (max-height: 580px) {
    min-height: 280px;
    max-height: 280px;
  }

  @media (max-height: 550px) {
    min-height: 260px;
    max-height: 260px;
    margin-bottom: ${({ $hasChangeButton }) =>
      $hasChangeButton ? '0' : '55px'};
  }
`;

const ButtonContainer = styled.div`
  width: 100%;
  position: absolute;
  padding: 0 20px;
  bottom: 40px;
  left: 0;
  z-index: 1000;
`;

const LoaderContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.theme.colors.bg};
`;

const Guidetext = styled.div`
  width: 100%;
  display: flex;
  text-align: center;
  justify-content: center;
  ${(props) => props.theme.fonts.regular16};
  color: ${(props) => props.theme.colors.gray300};
  padding-top: 10px;
`;

const ChangeButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 70%;
  justify-content: center;
  cursor: pointer;
  ${(props) => props.theme.fonts.caption03};
  color: ${(props) => props.theme.colors.gray400};
  gap: 4px;
  padding-top: 25px;
  img {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  @media (max-height: 730px) {
    flex-direction: row;
    gap: 10px;
    padding-top: 15px;
  }

  @media (max-height: 628px) {
    flex-direction: row;
    gap: 6px;
    ${theme.fonts.body12};
  }
`;

const PaginationWrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 25px 4px;
  padding-bottom: 20px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  ${(props) => props.theme.fonts.body07};
  color: ${(props) => props.theme.colors.gray500};
  gap: 24px;
  margin-bottom: 120px;

  @media (max-height: 730px) {
    padding: 20px 4px;
  }

  @media (max-height: 628px) {
    padding: 10px 4px;
  }
`;

const Page = styled.div`
  display: flex;
  flex-direction: row;
  cursor: pointer;
`;

const CurrentPage = styled.div`
  display: flex;
  height: 33px;
  padding: 3px 22px;
  justify-content: center;
  cursor: pointer;
  align-items: center;
  gap: 10px;
  border-radius: 200px;
  ${(props) => props.theme.fonts.body04};
  color: ${(props) => props.theme.colors.white};
  background-color: ${(props) => props.theme.colors.gray800};
`;

const WhiteSpace = styled.div`
  height: 44px;
`;
