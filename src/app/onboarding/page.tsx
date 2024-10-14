"use client";

import Button from "@/components/common/Button";
import Loader, { LoaderContainer } from "@/components/common/Loader";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import styled from "styled-components";

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const backgroundImage = `/assets/onboarding/bg${
    step === 1 ? 1 : step === 4 ? 3 : 2
  }.png`;
  const overlayLineImage = `/assets/onboarding/onboardingline${step}.svg`;
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

  const linePosition = {
    bottom:
      step === 1
        ? "99px"
        : step === 2
        ? "133px"
        : step === 3
        ? "133px"
        : "432px",
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
    bottom:
      step === 1
        ? "141px"
        : step === 2
        ? "122px"
        : step === 3
        ? "122px"
        : "364px",
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
    bottom: step === 4 ? "483px" : "119px",
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
    <Container backgroundImage={backgroundImage}>
      <Overlay onClick={handleOverlayClick}>
        <CloseSvg src="/assets/onboarding/ic_close.svg" onClick={handleClose} />
        <OverlayClose>
          <CurrentStep>{step}</CurrentStep>
          <TotalStep> / 4</TotalStep>
        </OverlayClose>
        {step > 1 && (
          <CustomOverlayImg
            src={`/assets/onboarding/img_tag${step - 1}.png`}
            bottom={tagPosition.bottom}
            left={tagPosition.left}
            width={step === 2 || step === 4 ? "71px" : "123px"}
          />
        )}
        <OverlayLine
          src={overlayLineImage}
          alt={`Overlay Line ${step}`}
          bottom={linePosition.bottom}
          left={linePosition.left}
        />
        {step === 1 && <OverlayBtn>편지 등록하기</OverlayBtn>}
        <OverlayText
          bottom={textPosition.bottom}
          left={textPosition.left}
          textAlign={textAlign}
        >
          {overlayTexts[step - 1]}
        </OverlayText>
        {step === 3 && (
          <TagContainer>궤도 메시지가 행성에 소속돼요</TagContainer>
        )}
        {step === 4 && (
          <>
            <OverlayLine
              src="/assets/onboarding/onboardingline5.svg"
              alt="Overlay Line 5"
              bottom="103px"
              left="313px"
            />
            <OverlayText bottom="149px" left="263px" textAlign="center">
              {overlayTexts[4]}
            </OverlayText>
            <CustomOverlay bottom="33px" left="273px">
              <Button
                buttonType="secondary"
                size="large"
                width="96px"
                height="60px"
              >
                <img
                  src="/assets/icons/ic_rocket.svg"
                  width={40}
                  height={40}
                  alt="rocket"
                />
              </Button>
            </CustomOverlay>
          </>
        )}
      </Overlay>
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

const Container = styled.div<{ backgroundImage: string }>`
    display: flex;
    flex-direction: column;
    width: 393px;
    height: 852px;
    justify-content: space-between;
    color: white;
    background:${(props) => props.theme.colors.bg};
    background-image: url(${(props) => props.backgroundImage});
    background-size: cover; 
    background-position: center; 
`;

const Overlay = styled.div`
    display: flex;
    justify-content: center;
    position: relative;
    width: 393px;
    height: 852px;
    background: rgba(0, 0, 0, 0.8); 
    z-index: 1; 
`;

const OverlayBtn = styled.button`
    position: absolute;
    bottom: 33px;
    left: 24px;
    z-index: 2;
    width: 238px;
    height: 60px;
    box-sizing: border-box;
    border-radius: 12px;
    justify-content: center;
    align-items: center;
    text-align: center;
    background:${(props) => props.theme.colors.main01};
    gap: 10px;
    flex-shrink: 0;
    color:${(props) => props.theme.colors.white};
    ${(props) => props.theme.fonts.button01};
`;

const OverlayLine = styled.img<{ bottom: string; left: string }>`
    position: absolute;
    bottom: ${(props) => props.bottom}; 
    left: ${(props) => props.left}; 
    z-index: 2; 
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

const OverlayText = styled.div<{
  bottom: string;
  left: string;
  textAlign: string;
}>`
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: ${(props) => props.textAlign};
    bottom: ${(props) => props.bottom}; 
    left: ${(props) => props.left}; 
    color:${(props) => props.theme.colors.white};
    ${(props) => props.theme.fonts.body06};
`;

const TotalStep = styled.div`
    display: flex;
    align-items: center;
    ${(props) => props.theme.fonts.caption02};
    color:${(props) => props.theme.colors.gray500}; 
    text-align: center;
`;

const CurrentStep = styled.div`
    display: flex;
    align-items: center;
    color:${(props) => props.theme.colors.white};
    ${(props) => props.theme.fonts.caption02};
    text-align: center;
`;

const CustomOverlayImg = styled.img<{
  bottom: string;
  left: string;
  width: string;
}>`
    position: absolute;
    bottom: ${(props) => props.bottom}; 
    width: ${(props) => props.width}; 
    height: auto;
    left: ${(props) => props.left}; 
    z-index: 2;
`;

const CustomOverlay = styled.div<{
  bottom: string;
  left: string;
}>`
      position: absolute;
      bottom: ${(props) => props.bottom}; 
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
    background: rgba(62, 65, 81, 0.60);
    backdrop-filter: blur(4px);
    ${(props) => props.theme.fonts.button03};
    color:${(props) => props.theme.colors.gray100}; 
`;
