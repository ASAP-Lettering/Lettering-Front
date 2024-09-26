"use client";

import Button from "@/components/common/Button";
import Check from "@/components/common/Check";
import Loader, { LoaderContainer } from "@/components/common/Loader";
import NavigatorBar from "@/components/common/NavigatorBar";
import { Suspense, useState } from "react";
import styled from "styled-components";

const LetterType = () => {
  const [isCheckedBox, setIsCheckedBox] = useState(false);

  const handleBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCheckedBox(e.target.checked);
  };

  return (
    <Container>
      <MainWrapper>
        <NavigatorBar title="편지 날짜 보기" cancel={false} />
        <MainText>해당 날짜는 스페이스에 등록된 날짜예요</MainText>
        <SelectWrapper>
          <SampleImg src="/assets/mypage/img_date_sample.png" />
          <SampleImg src="/assets/mypage/img_date_sample2.png" />
        </SelectWrapper>
        <Check
          checkType="box"
          checked={isCheckedBox}
          onChange={handleBoxChange}
        />
      </MainWrapper>
      <Button buttonType="primary" size="large" text="저장하기" />
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
      <LetterType />
    </Suspense>
  );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100%;
    justify-content: space-between;
    padding: 24px;
    color: white;
    background:${(props) => props.theme.colors.bg};
    padding-bottom: 40px;
`;

const MainWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const MainText = styled.div`
    ${(props: any) => props.theme.fonts.body07};
    color: ${(props: any) => props.theme.colors.gray300};
`;

const SelectWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    width: calc(100% - 20px);
    gap: 20px;
`;

const SampleImg = styled.img`
    width: calc(50% - 10px);
    height: auto;
`;
