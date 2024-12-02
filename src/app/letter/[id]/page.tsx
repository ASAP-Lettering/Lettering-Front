"use client";

import { getLetter, getSpaceLetter } from "@/api/letter/letter";
import Button from "@/components/common/Button";
import Loader from "@/components/common/Loader";
import NavigatorBar from "@/components/common/NavigatorBar";
import Letter from "@/components/letter/Letter";
import { LETTER_DETAIL_DATA } from "@/constants/letter";
import { LetterDetailType } from "@/types/letter";
import { getAccessToken } from "@/utils/storage";
import { useParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import styled from "styled-components";

const LetterPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const letterId = Array.isArray(id) ? id[0] : id;
  const [key, setKey] = useState(1);
  // const searchParams = useSearchParams();
  const [letterData, setLetterData] = useState<LetterDetailType>();
  const [isImage, setIsImage] = useState(false);
  const accessToken = getAccessToken();

  const handleButtonClick = (id: string) => {
    router.push(`/letter/${id}`);
  };

  const changeImageorContent = () => {
    setIsImage(!isImage);
    setKey(key + 1);
  };

  useEffect(() => {
    //LetterData 받아오는 로직
    if (id) {
      const letterId = Array.isArray(id) ? id[0] : id;

      //api 요청
      getSpaceLetter(letterId)
        .then((res) => {
          console.log(res.data);
          if (res.data) {
            setLetterData({
              id: parseInt(letterId),
              space_name: res.data.spaceName,
              sender: res.data.senderName,
              letter_count: res.data.letterCount,
              content: res.data.content,
              images: res.data.images,
              date: res.data.receiveDate,
              templateType: res.data.templateType,
              prev_letter: res.data.prevLetter
                ? {
                    letter_id: res.data.prevLetter.letterId,
                    sender_name: res.data.prevLetter.senderName,
                  }
                : undefined,
              next_letter: res.data.nextLetter
                ? {
                    letter_id: res.data.nextLetter.letterId,
                    sender_name: res.data.nextLetter.senderName,
                  }
                : undefined,
            });
          }
        })
        .catch((error) => {
          console.log(error.response);
        });
    }
  }, []);

  useEffect(() => {
    if (
      letterData &&
      letterData?.content.length < 1 &&
      letterData.images.length > 0
    ) {
      setIsImage(true);
    }
  }, [letterData]);

  return letterData ? (
    <Container>
      <Wrapper>
        <NavigatorBar cancel={false} url="/planet" />
      </Wrapper>
      <MainWrapper>
        <Header>
          <HeaderTitle>
            {letterData.space_name} <br />
            <span>행성에 있는 편지예요!</span>
          </HeaderTitle>
          <LetterCount>행성 속 편지 | {letterData.letter_count}개</LetterCount>
        </Header>
        <LetterWrapper>
          <Letter
            showType="receive"
            key={key}
            pageType="space"
            id={letterId}
            templateType={letterData.templateType}
            name={letterData.sender}
            content={letterData.content}
            images={letterData.images}
            isImage={isImage}
            date={letterData.date}
            nextLetterId={letterData.next_letter?.letter_id}
          />
        </LetterWrapper>
        {letterData.images.length > 0 && letterData.content.length > 0 ? (
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
          {letterData.prev_letter ? (
            <Page
              type="left"
              onClick={() =>
                handleButtonClick(letterData.prev_letter!.letter_id)
              }
            >
              <img src="/assets/icons/ic_arrow_left.svg" />
              <Text>{letterData.prev_letter.sender_name}</Text>
            </Page>
          ) : (
            <Page type="center" />
          )}
          <CurrentPage>{letterData.sender}</CurrentPage>
          {letterData.next_letter ? (
            <Page
              type="right"
              onClick={() =>
                handleButtonClick(letterData.next_letter!.letter_id)
              }
            >
              <Text>{letterData.next_letter.sender_name}</Text>
              <img src="/assets/icons/ic_arrow_right.svg" />
            </Page>
          ) : (
            <Page type="center" />
          )}
        </PaginationWrapper>
      </MainWrapper>
      <ButtonContainer>
        <Button
          buttonType="primary"
          size="large"
          text="답장하기"
          onClick={() => router.push("/send/letter")}
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

export default function LetterPaging() {
  return (
    <Suspense
      fallback={
        <LoaderContainer>
          <Loader />
        </LoaderContainer>
      }
    >
      <LetterPage />
    </Suspense>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;
  min-height: 100%;
  max-height: 100%;
  color: white;
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
  box-sizing: border-box;
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

   //반응형
   @media (max-width: 375px) {
    justify-content: start;
    padding: 0;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  padding: 15px 0px;
  width: 100%;
  padding-top: 30px;
  //반응형
  @media (max-width: 375px) {
    padding-top: 0;
    padding: 0 20px;
  }
`;

const LetterWrapper = styled.div`
    display: flex;
    width: 100%;
    box-sizing: border-box;
    justify-content: center;
    //반응형
    @media (max-width: 375px) {
    padding: 10px 40px;
    }
`;

const LetterCount = styled.div`
  display: flex;
  ${(props) => props.theme.fonts.caption03};
  color: ${(props) => props.theme.colors.gray400};
  flex: 1;
  flex-direction: column;
  text-align: end;
  justify-content: end;
  padding: 5px;
`;

const HeaderTitle = styled.div`
  width: 100%;
  ${(props) => props.theme.fonts.heading01};
  margin-top: 1rem;
  flex: 2;
  span {
    ${(props) => props.theme.fonts.heading02};
    white-space: nowrap;
  }
  @media (max-width: 375px) {
    font-size: 16px;
    line-height: 22px;
    span {
        font-size: 16px;
        line-height: 22px;
    }
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
  padding: 24px;
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

  @media (max-width: 375px) {
   padding-top: 10px;
   flex-direction: row;
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

  @media (max-width: 375px) {
    padding: 10px 4px;
    font-size: 12px;
    gap: 16px;
    line-height: 17px;
    text-align: center;
  }
  
`;

const Page = styled.div<{ type: "left" | "center" | "right" }>`
  width: 75px;
  display: flex;
  flex-direction: row;
  cursor: pointer;
  text-align: ${(props) => props.type};
  align-items: center;
`;

const Text = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 50px;
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
  white-space: nowrap;
  @media (max-width: 375px) {
    font-size: 12px;
    padding: 2px 14px;
  }
`;

const WhiteSpace = styled.div`
  height: 44px;
`;

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 24px;
`;
