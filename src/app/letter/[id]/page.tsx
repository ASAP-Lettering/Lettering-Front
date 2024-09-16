"use client";

import Button from "@/components/common/Button";
import Loader from "@/components/common/Loader";
import NavigatorBar from "@/components/common/NavigatorBar";
import Letter from "@/components/letter/Letter";
import { LETTER_DETAIL_DATA } from "@/constants/letter";
import { LetterDetailType, LetterType } from "@/types/letter";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import styled from "styled-components";

const LetterPage = () => {
  const router = useRouter();
  const { id } = useParams();
  //const searchParams = useSearchParams();
  const [letterData, setLetterData] = useState<LetterDetailType>();
  const [isImage, setIsImage] = useState(false);

  const handleButtonClick = () => {
    router.push("/");
  };

  useEffect(() => {
    //LetterData 받아오는 로직
    if (id) {
      const letterId = Array.isArray(id) ? id[0] : id;
      console.log(letterId);
      const letterIndex = parseInt(letterId);
      setLetterData(LETTER_DETAIL_DATA[letterIndex - 1]);
    }
  }, []);

  return letterData ? (
    <Container>
      <MainWrapper>
        <NavigatorBar cancel={false} />
        <Header>
          <HeaderTitle>
            {letterData.space_name} <br />
            행성에 있는 편지예요!
          </HeaderTitle>
          <LetterCount>행성 속 편지 | {letterData.letter_count}개</LetterCount>
        </Header>
        <Letter
          id={letterData.id}
          templateType={letterData.templateType}
          name={letterData.receiver}
          content={letterData.content}
          date={letterData.date}
          isImage={false}
        />
      </MainWrapper>
      <ButtonContainer>
        <Button
          buttonType="primary"
          size="large"
          text="답장하기"
          onClick={handleButtonClick}
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
  justify-content: space-between;
  box-sizing: border-box;
  height: 100%;
  max-height: 852px;
  color: white;
  padding: 25px;
  overflow-x: hidden;
  padding-bottom: 40px;
  background: ${(props) => props.theme.colors.bg};
  /* background-image: url('/assets/signup/verify_image.png'); 
    background-size: 550px auto; 
    background-position: bottom 80px center;
    background-repeat: no-repeat; */
`;

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px;
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
