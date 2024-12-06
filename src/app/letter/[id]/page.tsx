"use client";

import { getSpaceLetter } from "@/api/letter/letter";
import Button from "@/components/common/Button";
import Loader from "@/components/common/Loader";
import NavigatorBar from "@/components/common/NavigatorBar";
import Letter from "@/components/letter/Letter";
import { theme } from "@/styles/theme";
import { LetterDetailType } from "@/types/letter";
import { useParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import styled from "styled-components";

const LetterPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const letterId = Array.isArray(id) ? id[0] : id;
  const [key, setKey] = useState(1);
  const [letterData, setLetterData] = useState<LetterDetailType>();
  const [isImage, setIsImage] = useState(false);

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
      <NavigatorBarWrapper>
        <NavigatorBar cancel={false} url="/planet" />
      </NavigatorBarWrapper>
      <MainWrapper>
        <Header>
          <HeaderTitle>
            {letterData.space_name} <br />
            <span>행성에 있는 편지예요!</span>
          </HeaderTitle>
          <LetterCount>행성 속 편지 | {letterData.letter_count}개</LetterCount>
        </Header>
        <LetterContainer>
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
            width="100%"
            height="100%"
          />
        </LetterContainer>
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
  width: 100%;
  height: 100%;
  color: ${theme.colors.white};
  /* overflow-y: auto;
  overflow-x: hidden; */
  background: ${(props) => props.theme.colors.bg};
  position: relative;
`;

const NavigatorBarWrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 18px 18px 9px 18px;
`;

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  padding: 0 18px;
  overflow-y: auto;
  overflow-x: hidden;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  padding-bottom: 15px;
  width: 100%;
`;

const HeaderTitle = styled.div`
  width: 100%;
  ${(props) => props.theme.fonts.heading01};
  flex: 2;
  span {
    ${(props) => props.theme.fonts.heading02};
    white-space: nowrap;
  }

  @media (max-height: 780px) {
    ${theme.fonts.title01};
    span {
      ${(props) => props.theme.fonts.body03};
    }
  }

  @media (max-height: 628px) {
    ${theme.fonts.subtitle};
    span {
      ${(props) => props.theme.fonts.body07};
    }
  }

  @media (max-height: 580px) {
    ${theme.fonts.subtitle};
    span {
      ${(props) => props.theme.fonts.body07};
    }
  }
`;

const LetterContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 345px;
  min-height: 398px;
  max-height: 398px;

  @media (max-height: 824px) {
    max-width: 320px;
    min-height: 350px;
  }

  @media (max-height: 780px) {
    max-width: 280px;
    min-height: 320px;
    max-height: 320px;
  }

  @media (max-height: 700px) {
    min-height: 300px;
    max-height: 300px;
  }

  @media (max-height: 680px) {
    max-width: 250px;
    min-height: 280px;
    max-height: 280px;
  }

  @media (max-height: 580px) {
    max-width: 250px;
    min-height: 250px;
    max-height: 250px;
  }

  @media (max-height: 550px) {
    max-width: 220px;
    min-height: 220px;
    max-height: 220px;
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
  padding: 30px 4px;
  padding-bottom: 20px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  ${(props) => props.theme.fonts.body07};
  color: ${(props) => props.theme.colors.gray500};
  gap: 24px;
  margin-bottom: 100px;

  @media (max-height: 730px) {
    padding: 20px 4px;
  }

  @media (max-height: 628px) {
    padding: 10px 4px;
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
`;

const WhiteSpace = styled.div`
  height: 44px;
`;
