"use client";

import Button from "@/components/common/Button";
import Check from "@/components/common/Check";
import { useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";

export default function Signin() {
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [isSerivceChecked, setIsServiceChecked] = useState(false);
  const [isPersonalChecked, setIsPersonalChecked] = useState(false);
  const [isMarketingChecked, setIsMarketingChecked] = useState(false);
  const router = useRouter();

  const handleButtonClick = () => {
    router.push("/signin/step2");
  };

  type SetCheckedFunction = React.Dispatch<React.SetStateAction<boolean>>;

  const handleCheckChange =
    (setter: SetCheckedFunction) =>
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setter(e.target.checked);
    };

  const handleAllCheckChange = handleCheckChange(setIsAllChecked);
  const handleServiceCheckChange = handleCheckChange(setIsServiceChecked);
  const handlePersonalChange = handleCheckChange(setIsPersonalChecked);
  const handleMarketingChange = handleCheckChange(setIsMarketingChecked);

  return (
    <Container>
      <MainWrapper>
        <PrevBtn>
          <img src="/assets/icons/ic_prev.svg"></img>
        </PrevBtn>
        <HeaderTitle>
          레터링을 이용하려면
          <br /> 약관 동의가 필요해요
        </HeaderTitle>
        <Content>
          <AllContainer>
            <Check
              checkType="box"
              checked={isAllChecked}
              onChange={handleAllCheckChange}
              label="약관 전체 동의"
              sublabel="(선택사항 포함)"
            />
          </AllContainer>
          <SubContainer>
            <Check
              checkType="default"
              checked={isSerivceChecked}
              onChange={handleServiceCheckChange}
              label="서비스 이용 약관"
              sublabel="(필수)"
            />
            <img src="/assets/icons/ic_next.svg"></img>
          </SubContainer>
          <SubContainer>
            <Check
              checkType="default"
              checked={isPersonalChecked}
              onChange={handlePersonalChange}
              label="개인정보 수집 및 이용 동의"
              sublabel="(필수)"
            />
            <img src="/assets/icons/ic_next.svg"></img>
          </SubContainer>
          <SubContainer>
            <Check
              checkType="default"
              checked={isMarketingChecked}
              onChange={handleMarketingChange}
              label="마케팅 수신 동의"
              sublabel="(선택)"
            />
            <img src="/assets/icons/ic_next.svg"></img>
          </SubContainer>
        </Content>
      </MainWrapper>
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
`;

const MainWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

const PrevBtn = styled.button`
    width: 10px;
    height: auto;
`;

const HeaderTitle = styled.div`
    width: 100%;
    ${(props) => props.theme.fonts.heading01};
    padding: 10px;
    margin-top: 2.5rem;
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 10rem;
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
