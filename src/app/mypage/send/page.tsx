"use client";

import Button from "@/components/common/Button";
import Check from "@/components/common/Check";
import Loader, { LoaderContainer } from "@/components/common/Loader";
import NavigatorBar from "@/components/common/NavigatorBar";
import { Suspense, useState } from "react";
import styled from "styled-components";

const SendedLetter = () => {
  const [isSelecting, setIsSelecting] = useState(false); // 항목을 선택중인지
  const senderArray = [
    "진주",
    "예현",
    "동우",
    "민지",
    "규리",
    "규민",
    "진주",
    "예현",
    "동우",
    "민지",
    "규리",
    "규민",
    "진주",
    "예현",
    "동우",
    "민지",
    "규리",
    "규민",
  ];

  const selectAllItem = () => {
    setIsSelecting(!isSelecting);
  };

  return (
    <Container $isSelecting={isSelecting}>
      <Wrapper>
        <NavigatorBar title="보낸 편지함" cancel={false} />
      </Wrapper>
      <MainWrapper>
        <Header>
          <SelectText onClick={selectAllItem}>
            {isSelecting ? (
              <>삭제</>
            ) : (
              <>
                <img src="/assets/mypage/ic_check.svg" />
                전체 선택
              </>
            )}
          </SelectText>
        </Header>
      </MainWrapper>
      <ButtonWrapper>
        {isSelecting && (
          <>
            <Button buttonType="secondary" size="default" text="취소" />
            <Button buttonType="primary" size="large" text="삭제하기" />
          </>
        )}
      </ButtonWrapper>
    </Container>
  );
};

export default function SendedLetterPaging() {
  return (
    <Suspense
      fallback={
        <LoaderContainer>
          <Loader />
        </LoaderContainer>
      }
    >
      <SendedLetter />
    </Suspense>
  );
}

const Container = styled.div<{
  $isSelecting: boolean;
}>`
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 100%;
    max-height: 100%;
    justify-content: space-between;
   /* ${({ $isSelecting }) =>
     $isSelecting ? "justify-content: space-between" : ""}; */
    color: white;
    background:${(props) => props.theme.colors.bg};
    

`;

const MainWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5px 24px;
    height: 100%;
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

const Header = styled.div`
    width: 100%;
    display: flex;
    justify-content: end;
`;

const SelectText = styled.button`
    ${(props: any) => props.theme.fonts.body09};
    color: ${(props: any) => props.theme.colors.gray300};
    display: flex;
    cursor: pointer;
    gap: 6px;
    align-items: center;
`;

const Wrapper = styled.div`
    display: flex;
    width: 100%;
    padding: 24px;
`;

const ButtonWrapper = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    gap: 10px;
    padding: 24px;
`;
