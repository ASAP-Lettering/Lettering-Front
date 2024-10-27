"use client";

import Button from "@/components/common/Button";
import Check from "@/components/common/Check";
import Loader, { LoaderContainer } from "@/components/common/Loader";
import NavigatorBar from "@/components/common/NavigatorBar";
import { getCookie, setCookie } from "@/utils/storage";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import styled from "styled-components";

const LetterType = () => {
  const type = getCookie("letter-tagtype");
  const [isCheckedBox, setIsCheckedBox] = useState(false); // false라면 이름만, true라면 이름과 날짜
  const router = useRouter();
  const [isAbled, setisAbled] = useState(false);

  const handleBoxChange = (newCheckedState: boolean) => {
    if (!isCheckedBox || !newCheckedState) {
      setIsCheckedBox(newCheckedState);
    }
  };

  useEffect(() => {
    if (type === "1" && isCheckedBox) {
      setisAbled(true);
    } else if (type === "2" && !isCheckedBox) {
      setisAbled(true);
    } else {
      setisAbled(false);
    }
  }, [isCheckedBox]);

  useEffect(() => {
    if (type !== null) {
      if (type === "1") {
        setIsCheckedBox(false);
      } else if (type === "2") {
        setIsCheckedBox(true);
      }
    } else {
      setCookie("letter-tagtype", "1", 300);
    }
  }, []);

  const handleSumbit = () => {
    if (isCheckedBox) {
      setCookie("letter-tagtype", "2", 300);
      console.log("이름과날짜");
    } else {
      setCookie("letter-tagtype", "1", 300);
      console.log("이름만");
    }
    router.push("/mypage");
  };

  return (
    <Container>
      <Wrapper>
        <NavigatorBar title="편지 날짜 보기" cancel={false} />
      </Wrapper>
      <MainWrapper>
        <MainText>해당 날짜는 스페이스에 등록된 날짜예요</MainText>
        <SelectWrapper>
          <Select>
            <SelectTitle>이름만 (기본)</SelectTitle>
            <SampleImg src="/assets/mypage/img_date_sample.png" />
            <Check
              checkType="large"
              checked={!isCheckedBox}
              onChange={() => handleBoxChange(false)}
            />
          </Select>
          <Select>
            <SelectTitle>이름과 날짜</SelectTitle>
            <SampleImg src="/assets/mypage/img_date_sample2.png" />
            <Check
              checkType="large"
              checked={isCheckedBox}
              onChange={() => handleBoxChange(true)}
            />
          </Select>
        </SelectWrapper>
      </MainWrapper>
      <Wrapper>
        <Button
          buttonType="primary"
          size="large"
          text="저장하기"
          disabled={!isAbled}
          onClick={handleSumbit}
        />
      </Wrapper>
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
    align-items: center;
    padding: 24px;
    overflow-y: auto;
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
`;

const MainText = styled.div`
    ${(props: any) => props.theme.fonts.body07};
    color: ${(props: any) => props.theme.colors.gray300};
`;

const SelectWrapper = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    gap: 20px;
    margin: 42px 0;
`;

const Select = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    width: 50%;
    gap: 20px;
`;

const SelectTitle = styled.div`
    width: 100%;
    text-align: center;
    ${(props: any) => props.theme.fonts.body08};
    color: ${(props: any) => props.theme.colors.white};
`;

const SampleImg = styled.img`
    width: 100%;
    height: auto;
`;

const Wrapper = styled.div`
    display: flex;
    width: 100%;
    padding: 24px;
`;
