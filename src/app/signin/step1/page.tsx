"use client";

import Button from "@/components/common/Button";
import Check from "@/components/common/Check";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter, useSearchParams } from "next/navigation";
import NavigatorBar from "@/components/common/NavigatorBar";
import { signinState, userInfo } from "@/recoil/signinStore";
import { useRecoilState } from "recoil";
import { links } from "@/styles/theme";
import Toast from "@/components/common/Toast";

export default function Signin() {
  const [user, setUser] = useRecoilState(userInfo);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [isSerivceChecked, setIsServiceChecked] = useState(false);
  const [isPersonalChecked, setIsPersonalChecked] = useState(false);
  const [isMarketingChecked, setIsMarketingChecked] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const url = searchParams.get("url");

  const handleButtonClick = () => {
    if (isSerivceChecked && isPersonalChecked) {
      if (url) {
        router.push(`/signin/step2?url=${url}`);
      } else {
        router.push("/signin/step2");
      }

      setUser({
        ...user,
        marketingPermission: isMarketingChecked,
        servicePermission: isSerivceChecked,
        privatePermission: isPersonalChecked,
      });
    } else {
      handleShowToast();
    }
  };

  const handleShowToast = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleCheckChange = (type: string) => {
    switch (type) {
      case "all":
        const newAllChecked = !isAllChecked;
        setIsAllChecked(newAllChecked);
        setIsServiceChecked(newAllChecked);
        setIsPersonalChecked(newAllChecked);
        setIsMarketingChecked(newAllChecked);
        break;
      case "service":
        const newServiceChecked = !isSerivceChecked;
        setIsServiceChecked(newServiceChecked);
        updateAllChecked(
          newServiceChecked,
          isPersonalChecked,
          isMarketingChecked
        );
        break;
      case "personal":
        const newPersonalChecked = !isPersonalChecked;
        setIsPersonalChecked(newPersonalChecked);
        updateAllChecked(
          isSerivceChecked,
          newPersonalChecked,
          isMarketingChecked
        );
        break;
      case "marketing":
        const newMarketingChecked = !isMarketingChecked;
        setIsMarketingChecked(newMarketingChecked);
        updateAllChecked(
          isSerivceChecked,
          isPersonalChecked,
          newMarketingChecked
        );
        break;
      default:
        break;
    }
  };

  const updateAllChecked = (
    service: boolean,
    personal: boolean,
    marketing: boolean
  ) => {
    if (service && personal && marketing) {
      setIsAllChecked(true);
    } else {
      setIsAllChecked(false);
    }
  };

  return (
    <Container>
      <div>
        <NavigatorBar cancel={false} />
        <MainWrapper>
          <HeaderTitle>
            레터링을 이용하려면
            <br /> 약관 동의가 필요해요
          </HeaderTitle>
          <Content>
            <AllContainer>
              <Check
                checkType="box"
                checked={isAllChecked}
                onChange={() => handleCheckChange("all")}
                label="약관 전체 동의"
                sublabel="(선택사항 포함)"
              />
            </AllContainer>
            <SubContainer>
              <Check
                checkType="default"
                checked={isSerivceChecked}
                onChange={() => handleCheckChange("service")}
                label="서비스 이용 약관"
                sublabel="(필수)"
              />
              <img
                src="/assets/icons/ic_next.svg"
                onClick={() => {
                  window.open(links.service);
                }}
              ></img>
            </SubContainer>
            <SubContainer>
              <Check
                checkType="default"
                checked={isPersonalChecked}
                onChange={() => handleCheckChange("personal")}
                label="개인정보 수집 및 이용 동의"
                sublabel="(필수)"
              />
              <img
                src="/assets/icons/ic_next.svg"
                onClick={() => {
                  window.open(links.personal);
                }}
              ></img>
            </SubContainer>
            <SubContainer>
              <Check
                checkType="default"
                checked={isMarketingChecked}
                onChange={() => handleCheckChange("marketing")}
                label="마케팅 수신 동의"
                sublabel="(선택)"
              />
              <img
                src="/assets/icons/ic_next.svg"
                onClick={() => {
                  window.open(links.marketing);
                }}
              ></img>
            </SubContainer>
          </Content>
        </MainWrapper>
      </div>
      {showToast && <Toast text={`필수 항목에 동의해주세요!`} icon={true} />}
      <Button
        buttonType="primary"
        text="다음"
        onClick={handleButtonClick}
      ></Button>
    </Container>
  );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 100%;
    color: white;
    background:${(props) => props.theme.colors.bg};
    padding: 25px;
    padding-bottom: 40px;
`;

const MainWrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 2.5rem;
`;

const HeaderTitle = styled.div`
    width: 100%;
    ${(props) => props.theme.fonts.heading01};
    padding: 10px;
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 6rem;
`;

const AllContainer = styled.div`
    display: flex;
    border-radius: 0.5rem;
    width: 100%;
    padding: 15px;
    margin-bottom: 15px;
    background-color: ${(props) => props.theme.colors.gray800};
    flex-direction: row;
`;

const SubContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    padding: 10px 15px;
`;