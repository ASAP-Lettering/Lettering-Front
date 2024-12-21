"use client";

import { putOnboarding } from "@/api/mypage/user";
import Bottom from "@/components/common/Bottom";
import Button from "@/components/common/Button";
import Loader from "@/components/common/Loader";
import Planet from "@/components/common/Planet";
import Tag from "@/components/common/Tag";
import Pagination from "@/components/letter/Pagination";
import { Orbit } from "@/constants/orbit";
import { theme } from "@/styles/theme";
import { setOnboarding } from "@/utils/storage";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import styled from "styled-components";

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [orbitMessage, setOrbitMessage] = useState<Orbit[] | null>([]);
  const [currentOrbits, setCurrentOrbits] = useState<Orbit[] | undefined>([]);
  const [number, setNumber] = useState<number>(0);

  const [windowHeight, setWindowHeight] = useState<number>(0);
  const totalSteps = 4;
  const router = useRouter();

  const handleClose = () => {
    router.push("/planet");
  };

  const handleOverlayClick = () => {
    if (step < totalSteps) {
      setStep((prevStep) => prevStep + 1);
    } else {
      handleClose();
    }
  };

  const handleResize = () => {
    setWindowHeight(window.innerHeight);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      handleResize();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  useEffect(() => {
    console.log("윈도우 높이는 : ", windowHeight);
  }, [windowHeight]);

  useEffect(() => {
    if (step > 1) {
      setOrbitMessage([
        {
          letterId: "",
          senderName: "규리",
        },
      ]);
    }
    if (step === 4) {
      putOnboarding();
      setOnboarding("true");
    }
  }, [step]);

  const overlayLineImage = `/assets/onboarding/onboardingline${step}.svg`;
  const linePosition = {
    top: step === 4 ? (windowHeight > 730 ? "380px" : "270px") : "",
    bottom:
      step === 1 ? "99px" : step === 2 ? "133px" : step === 3 ? "133px" : "",
    left:
      step === 1
        ? "136px"
        : step === 2
        ? "105px"
        : step === 3
        ? "105px"
        : "50px",
  };

  const textPosition = {
    top: step === 4 ? (windowHeight > 730 ? "425px" : "210px") : "",
    bottom:
      step === 1 ? "141px" : step === 2 ? "122px" : step === 3 ? "122px" : "",
    left:
      step === 1
        ? "71px"
        : step === 2
        ? "159px"
        : step === 3
        ? "159px"
        : "32px",
  };

  const tagPosition = {
    top: step === 4 ? "330px" : "",
    bottom: step === 4 ? "" : "119px",
    left: step === 4 ? "21px" : "23px",
  };

  const textAlign = step === 4 ? "left" : "center";

  const overlayTexts = [
    "버튼을 클릭해\n편지를 등록할 수 있어요",
    "편지 등록을 완료하면\n나의 궤도에 편지가 저장돼요",
    "궤도 메시지를\n행성으로 끌어당겨보세요.",
    "편지를 꾹 누르면\n이동시키거나 삭제할 수 있어요",
    "편지를 쓰고 마음을\n전달해보세요!",
  ];

  return (
    <Container>
      <Overlay onClick={handleOverlayClick}>
        <CloseSvg src="/assets/onboarding/ic_close.svg" onClick={handleClose} />
        <OverlayClose>
          <CurrentStep>{step}</CurrentStep>
          <TotalStep> / 4</TotalStep>
        </OverlayClose>
        {step === 1 && (
          <OverlayBtnWrapper left="24px" bottom="28px" width="65%">
            <Button
              buttonType="primary"
              size="large"
              text="받은 편지 보관하기"
              height="60px"
            />
          </OverlayBtnWrapper>
        )}
        <OverlayLine
          src={overlayLineImage}
          alt={`Overlay Line ${step}`}
          top={linePosition.top}
          bottom={linePosition.bottom}
          left={linePosition.left}
        />
        <OverlayText
          top={textPosition.top}
          bottom={textPosition.bottom}
          left={textPosition.left}
          textAlign={textAlign}
        >
          {overlayTexts[step - 1]}
        </OverlayText>
        {step > 1 && (
          <CustomOverlayImg
            src={`/assets/onboarding/img_tag${step - 1}.png`}
            top={tagPosition.top}
            bottom={tagPosition.bottom}
            left={tagPosition.left}
            width={step === 2 || step === 4 ? "71px" : "123px"}
          />
        )}
        {step === 3 && (
          <TagContainer>궤도 메시지가 행성에 소속돼요</TagContainer>
        )}
        {step === 4 && (
          <>
            <OverlayLine
              src="/assets/onboarding/onboardingline5.svg"
              alt="Overlay Line 5"
              bottom="110px"
              left="85%"
            />
            <OverlayText bottom="149px" left="263px" textAlign="center">
              {overlayTexts[4]}
            </OverlayText>
            <OverlayBtnWrapper right="24px" bottom="28px">
              <Button
                buttonType="secondary"
                size="large"
                width="100%"
                height="60px"
              >
                <img
                  src="/assets/icons/ic_rocket.svg"
                  width={40}
                  height={40}
                  alt="rocket"
                />
              </Button>
            </OverlayBtnWrapper>
          </>
        )}
      </Overlay>
      <BgContainer>
        <Top>
          <Title>
            <>
              민지님의 스페이스를
              <br />
              편지로 수놓아 보세요
            </>
          </Title>
          <img
            src="/assets/icons/ic_mypage.svg"
            width={24}
            height={24}
            alt="mypage"
          />
        </Top>
        <TagList>
          <Tag
            tagType="planet"
            name="민지님의 첫 행성"
            icon="chevron"
            onClick={() => {
              router.push("/planet/manage");
            }}
          />
          <Tag
            tagType="planet"
            name=""
            icon="plus"
            onClick={() => router.push("/planet/add")}
          />
        </TagList>
        <MainWrapper>
          <Planet
            planetType={0}
            planet={"민지"}
            orbits={[]}
            onEditPlanetName={() => {}}
            setCurrentOrbits={setCurrentOrbits}
            setCountLetter={setNumber}
          />
          <PageWrapper>
            <Pagination currentPage={1} totalPage={1} />
          </PageWrapper>
        </MainWrapper>
      </BgContainer>
      <Bottom
        orbitMessages={orbitMessage}
        onDelete={() => {}}
        onOrbitDrag={() => {}}
        onOrbitTouch={() => {}}
      />
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
  background: ${(props) => props.theme.colors.bg};
  background-size: cover;
  background-position: center;
  overflow: hidden;
  position: relative;
`;

//배경용
const PageWrapper = styled.div`
  width: 100%;
  height: 0px;
  z-index: 1;
  display: flex;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: absolute;
  top: 600px;
  left: 50%;
  padding: 20px;
  transform: translateX(-50%);
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

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const BgContainer = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-top: 70px;
  overflow-x: hidden;
  overflow-y: hidden;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE, Edge */
  scrollbar-width: none; /* Firefox */
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
  box-sizing: border-box;
`;

const Title = styled.div`
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.heading02};
`;

const TagList = styled.div`
  display: flex;
  box-sizing: border-box;
  gap: 8px;
  overflow-x: scroll;
  padding: 0 20px;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE, Edge */
  scrollbar-width: none; /* Firefox */
`;

//오버레이 레이아웃
const Overlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9999;
`;

const OverlayClose = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  text-align: center;
  align-items: center;
  gap: 3px;
  position: absolute;
  top: 112px;
  right: 24px;
`;

const CloseSvg = styled.img`
  position: absolute;
  top: 78px;
  right: 24px;
`;

const TotalStep = styled.div`
  display: flex;
  align-items: center;
  ${(props) => props.theme.fonts.caption02};
  color: ${(props) => props.theme.colors.gray500};
  text-align: center;
`;

const CurrentStep = styled.div`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.colors.white};
  ${(props) => props.theme.fonts.caption02};
  text-align: center;
`;

const OverlayBtnWrapper = styled.div<{
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  width?: string;
}>`
  position: absolute;
  top: ${(props) => props.top || "auto"};
  bottom: ${(props) => props.bottom || "auto"};
  left: ${(props) => props.left || "auto"};
  right: ${(props) => props.right || "auto"};
  width: ${(props) => props.width || "auto"};
`;

const OverlayLine = styled.img<{
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
}>`
  position: absolute;
  top: ${(props) => props.top || "auto"};
  bottom: ${(props) => props.bottom || "auto"};
  left: ${(props) => props.left || "auto"};
  right: ${(props) => props.right || "auto"};
  z-index: 2;
`;

const OverlayText = styled.div<{
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  textAlign: string;
}>`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: ${(props) => props.textAlign};
  top: ${(props) => props.top || "auto"};
  bottom: ${(props) => props.bottom || "auto"};
  left: ${(props) => props.left || "auto"};
  right: ${(props) => props.right || "auto"};
  color: ${(props) => props.theme.colors.white};
  ${(props) => props.theme.fonts.body06};
`;

const CustomOverlayImg = styled.img<{
  top?: string;
  bottom?: string;
  left?: string;
  width: string;
}>`
  position: absolute;
  top: ${(props) => props.top || "auto"};
  bottom: ${(props) => props.bottom || "auto"};
  left: ${(props) => props.left || "auto"};
  height: auto;
  left: ${(props) => props.left};
  z-index: 2;
`;

const TagContainer = styled.div`
  position: absolute;
  bottom: 76px;
  left: 147px;
  padding: 10px 20px;
  border-radius: 20px;
  background: rgba(62, 65, 81, 0.6);
  backdrop-filter: blur(4px);
  ${(props) => props.theme.fonts.button03};
  color: ${(props) => props.theme.colors.gray100};
`;
