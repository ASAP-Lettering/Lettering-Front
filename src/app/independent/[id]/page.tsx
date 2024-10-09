"use client";

import { getIndependentLetter } from "@/api/letter/letter";
import Button from "@/components/common/Button";
import Loader from "@/components/common/Loader";
import NavigatorBar from "@/components/common/NavigatorBar";
import Letter from "@/components/letter/Letter";
import { IndependentLetterType, LetterDetailType } from "@/types/letter";
import { getAccessToken } from "@/utils/storage";
import { useParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import styled from "styled-components";

const IndependentLetterPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const letterId = Array.isArray(id) ? id[0] : id;
  const [key, setKey] = useState(1);
  //const searchParams = useSearchParams();
  const [letterData, setLetterData] = useState<IndependentLetterType | null>(
    null
  );
  const [isImage, setIsImage] = useState(false);
  const accessToken = getAccessToken();

  const handleButtonClick = (id: string) => {
    router.push(`/independent/${id}`);
  };

  const changeImageorContent = () => {
    setIsImage(!isImage);
    setKey(key + 1);
  };

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
      <Wrapper>
        <NavigatorBar cancel={false} url="/planet" />
      </Wrapper>
      <MainWrapper>
        <Header>
          <HeaderTitle>
            나의 궤도
            <span>
              에 있는
              <br />
              편지예요!
            </span>
          </HeaderTitle>
          <LetterCount>궤도 속 편지 | {letterData.letterCount}개</LetterCount>
        </Header>
        {isImage ? (
          <Letter
            showType="receive"
            key={key}
            id={parseInt(letterId)}
            templateType={letterData.templateType}
            name={letterData.senderName}
            images={letterData.images}
            date={letterData.sendDate}
            isImage={true}
          />
        ) : (
          <Letter
            showType="receive"
            key={key}
            id={parseInt(letterId)}
            templateType={letterData.templateType}
            content={letterData.content}
            name={letterData.senderName}
            images={letterData.images}
            date={letterData.sendDate}
            isImage={false}
          />
        )}
        {letterData.images.length > 0 ? (
          <ChangeButtonWrapper onClick={changeImageorContent}>
            <img src="/assets/icons/ic_change_image.svg"></img>
            <div>
              클릭하면 {isImage ? "편지 내용" : "사진"}을 확인할 수 있어요!
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
        <Button buttonType="primary" size="large" text="답장하기" />
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
  height: 100%;
  color: white;
  //padding: 25px;
  overflow-x: hidden;
  background: ${(props) => props.theme.colors.bg};
  /* background-image: url('/assets/signup/verify_image.png'); 
    background-size: 550px auto; 
    background-position: bottom 80px center;
    background-repeat: no-repeat; */
`;

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 0 19px 0 24px;
  overflow-y: auto;
  overflow-x: hidden;
  &::-webkit-scrollbar {
        width: 5px; /* Width of the scrollbar */
    }

  &::-webkit-scrollbar-track {
        background: ${(props: any) => props.theme.colors.gray800};
        border-radius: 10px; /* Rounded corners */
    }

  &::-webkit-scrollbar-thumb {
        background: ${(props: any) => props.theme.colors.gray600};
        border-radius: 10px; /* Rounded corners */
    }
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  padding: 15px 0px;
  width: 100%;
  padding-top: 40px;
`;

const LetterCount = styled.div`
    display: flex;
    ${(props) => props.theme.fonts.caption03};
    color: ${(props) => props.theme.colors.gray400};
    flex:1;
    flex-direction: column;
    text-align: end;
    justify-content: end;
    padding: 5px;
`;

const HeaderTitle = styled.div`
  width: 100%;
  ${(props) => props.theme.fonts.heading01};
  margin-top: 1rem;
  flex:2;
  span {
    ${(props) => props.theme.fonts.heading02};
    white-space: nowrap;
  }
`;

// const HeaderSubTitle = styled.div`
//   width: 100%;
//   ${(props) => props.theme.fonts.regular16};
//   color: ${(props) => props.theme.colors.gray300};
//   padding-top: 10px;
// `;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 12px;
  padding: 25px;
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
    img{
        width: 20px;
        height: 20px;
        flex-shrink: 0;
    }
`;

const PaginationWrapper = styled.div`
    display: flex;
    width: 100%;
    padding: 30px 4px;
    padding-bottom: 20px;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    ${(props) => props.theme.fonts.body07};
    color: ${(props) => props.theme.colors.gray500};
    gap: 24px;
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

const Wrapper = styled.div`
    display: flex;
    width: 100%;
    padding: 24px;
`;
