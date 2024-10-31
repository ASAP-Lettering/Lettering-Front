"use client";

import {
  getVerifyedLetter,
  saveVerifyedLetter,
  verifyLetter,
} from "@/api/letter/letter";
import { getMainId } from "@/api/planet/space/space";
import Button from "@/components/common/Button";
import Loader, { LoaderContainer } from "@/components/common/Loader";
import Letter from "@/components/letter/Letter";
import { LETTER_DATA } from "@/constants/letter";
import { LetterType } from "@/types/letter";
import { getAccessToken } from "@/utils/storage";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import styled from "styled-components";

const VerifyLetter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const url = searchParams.get("url");
  const [key, setKey] = useState(1);
  const [letterId, setletterId] = useState("");
  const [letterData, setLetterData] = useState<LetterType>();
  const [isImage, setIsImage] = useState(false);
  const accessToken = getAccessToken();
  const [isLoading, setIsLoading] = useState(true);

  const handleButtonClick = () => {
    router.push("/planet");
  };

  const changeImageorContent = () => {
    setIsImage(!isImage);
    setKey(key + 1);
  };

  const fetchLetterData = async (letterId: string) => {
    try {
      console.log(letterId);
      const response = await getVerifyedLetter(letterId);
      setLetterData({
        id: parseInt(letterId),
        templateType: response.data.templateType,
        sender: response.data.senderName,
        content: response.data.content,
        date: response.data.date,
        images: response.data.images,
      });
    } catch (error) {
      //검증 완료된 사용자이지만 모종의 이유로 데이터 받아오는 것이 실패한 경우
      console.error("편지 조회 실패:", error);
      router.push(`/error/network`);
    }
  };

  const saveLetter = async (letterId: string) => {
    try {
      const response = await saveVerifyedLetter(letterId);
      console.log(response.data.message);
    } catch (error) {
      console.log("편지 저장 실패: ", error);
      router.push("/error/network");
    }
    router.push("/planet");
  };

  useEffect(() => {
    //액세스 토큰이 없을 때 미리 처리
    if (!accessToken) {
      router.push(url ? `/login?url=${url}` : `/login`);
      return;
    }
    //액세스 토큰이 있다면
    const checkMainIdAndVerify = async () => {
      try {
        // 메인 ID 조회를 통한 회원 검증 (탈퇴회원 포함)
        await getMainId();

        // letterCode가 있을 경우 추가 검증 진행
        if (url) {
          verifyLetter(url)
            .then((res) => {
              if (res.data.letterId) {
                setletterId(res.data.letterId);
                fetchLetterData(res.data.letterId);
              }
            })
            .catch((error) => {
              if (error.status === 403) {
                //해당 사용자가 열람 가능한 편지가 아님
                console.error("검증 실패:", error);
                router.push(`/error/letter`);
              } else if (error.status === 400) {
                //편지가 존재하지 않음
                router.push(`/error`);
              }
            });
        }
      } catch (error) {
        // 메인 ID 조회 실패 시 로그인 페이지로 이동
        console.error("유효한 회원이 아닌 것으로 판단:", error);
        if (url) {
          router.push(`/login?url=${url}`);
        } else {
          router.push(`/login`);
        }
      }
    };

    checkMainIdAndVerify();
    //accessToken이 없는 상황이라면 로그인으로

    //letterCode가 있다면 검증 진행
    // if (url) {
    //   verifyLetter(url)
    //     .then((res) => {
    //       if (res.data.letterId) {
    //         //검증 성공하면 letterData를 받아온다
    //         setletterId(res.data.letterId);
    //         fetchLetterData(res.data.letterId);
    //       }
    //     })
    //     .catch((error) => {
    //       //검증 실패시 조회할 수 없는 편지 에러 페이지로 이동
    //       console.log(error);
    //       router.push(url ? `/error/letter?url=${url}` : `/error/letter`);
    //     });
    // }

    // if (letterData === null) {
    //   //LetterData 받아오는 로직
    //   for (let i = 0; i < LETTER_DATA.length; i++) {
    //     if (LETTER_DATA[i].url === url) {
    //       setLetterData(LETTER_DATA[i]);
    //     }
    //   }
    // }
    setIsLoading(false);
  }, []);

  return letterData && !isLoading ? (
    <Container>
      <MainWrapper>
        <Header>
          <HeaderTitle>
            {letterData.sender}님이 보낸 편지 속 <br />
            소중한 마음을 읽어보세요
          </HeaderTitle>
          <HeaderSubTitle>
            편지는 전달 받은 링크를 통해 나중에도 등록할 수 있어요
          </HeaderSubTitle>
        </Header>
        {isImage ? (
          <Letter
            showType="url"
            key={key}
            id={letterId}
            templateType={letterData.templateType}
            name={letterData.sender}
            images={letterData.images}
            date={letterData.date}
            readOnly={true}
            isImage={true}
          />
        ) : (
          <Letter
            showType="url"
            key={key}
            id={letterId}
            templateType={letterData.templateType}
            name={letterData.sender}
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
      <ButtonContainer>
        <Button
          buttonType="secondary"
          size="default"
          text="홈으로"
          onClick={handleButtonClick}
        />
        <Button
          buttonType="primary"
          size="medium"
          text="나의 스페이스에 추가하기"
          onClick={() => (letterData ? saveLetter(letterId) : {})}
        />
      </ButtonContainer>
    </Container>
  ) : (
    <LoaderContainer>
      <Loader />
    </LoaderContainer>
  );
};

export default function VerifyLetterPaging() {
  return (
    <Suspense
      fallback={
        <LoaderContainer>
          <Loader />
        </LoaderContainer>
      }
    >
      <VerifyLetter />
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
  overflow-x: hidden;
  padding: 40px 0;
  background: ${(props) => props.theme.colors.bg};
  /* background-image: url('/assets/signup/verify_image.png'); 
    background-size: 550px auto; 
    background-position: bottom 80px center;
    background-repeat: no-repeat; */
`;

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
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
  flex-direction: column;
  padding: 10px;
`;

const HeaderTitle = styled.div`
  width: 100%;
  ${(props) => props.theme.fonts.heading01};
  margin-top: 2.5rem;
`;

const HeaderSubTitle = styled.div`
  width: 100%;
  ${(props) => props.theme.fonts.body09};
  color: ${(props) => props.theme.colors.gray300};
  padding: 10px 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 12px;
  justify-content: center;
`;

const ChangeButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  justify-content: center;
  cursor: pointer;
  ${(props) => props.theme.fonts.caption03};
  color: ${(props) => props.theme.colors.gray400};
  gap: 4px;
  padding: 30px 0;
  img {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
`;

const WhiteSpace = styled.div`
  height: 44px;
`;
