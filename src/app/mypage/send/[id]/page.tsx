"use client";

import Button from "@/components/common/Button";
import Loader from "@/components/common/Loader";
import NavigatorBar from "@/components/common/NavigatorBar";
import Letter from "@/components/letter/Letter";
import { LETTER_DETAIL_DATA } from "@/constants/letter";
import { SendedLetterType } from "@/types/letter";
import { getAccessToken } from "@/utils/storage";
import { useParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import styled from "styled-components";

const SendDetailPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [key, setKey] = useState(1);
  //const searchParams = useSearchParams();
  const [letterData, setLetterData] = useState<SendedLetterType>();
  const [isImage, setIsImage] = useState(false);
  const accessToken = getAccessToken();

  const changeImageorContent = () => {
    setIsImage(!isImage);
    setKey(key + 1);
  };

  useEffect(() => {
    //LetterData 받아오는 로직
    if (id && accessToken) {
      setLetterData({
        id: 1,
        templateType: 3,
        receiver: "유진주",
        content: "안녕",
        images: [],
        date: "",
      });
      //api 요청
      //   getLetter(letterId, accessToken)
      //   .then((res) => {
      //     console.log(res.data);
      //   })
      //   .catch((error) => {
      //     console.log(error.response);
      //   });
    }
  }, []);

  return letterData ? (
    <Container>
      <Wrapper>
        <NavigatorBar title="보낸 편지함" cancel={false} />
      </Wrapper>
      <MainWrapper>
        <Header>
          {/* <LetterCount>행성 속 편지 | {letterData.letter_count}개</LetterCount> */}
        </Header>
        {isImage ? (
          <Letter
            showType="send"
            key={key}
            id={letterData.id}
            templateType={letterData.templateType}
            name={letterData.receiver}
            images={letterData.images}
            date={letterData.date}
            readOnly={true}
            isImage={true}
          />
        ) : (
          <Letter
            showType="send"
            key={key}
            id={letterData.id}
            templateType={letterData.templateType}
            name={letterData.receiver}
            content={letterData.content}
            date={letterData.date}
            readOnly={true}
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
      </MainWrapper>
    </Container>
  ) : (
    <LoaderContainer>
      <Loader />
      <Guidetext>잠시만 기다려주세요...</Guidetext>
    </LoaderContainer>
  );
};

export default function SendDetailPaging() {
  return (
    <Suspense
      fallback={
        <LoaderContainer>
          <Loader />
        </LoaderContainer>
      }
    >
      <SendDetailPage />
    </Suspense>
  );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 100%;
    max-height: 100%;
    justify-content: space-between;
    color: white;
    background:${(props) => props.theme.colors.bg};
`;

const MainWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding: 5px 24px;
    height: 100%;
    overflow-y: auto;
    box-sizing: border-box;
    align-items: center;
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
    padding: 10px;
    width: 100%;
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

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 12px;
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
    padding: 16px;
    img{
        width: 20px;
        height: 20px;
        flex-shrink: 0;
    }
`;

const PaginationWrapper = styled.div`
    display: flex;
    width: 100%;
    padding: 4px;
    padding-bottom: 30px;
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
