"use client";

import Button from "@/components/common/Button";
import Check from "@/components/common/Check";
import Loader, { LoaderContainer } from "@/components/common/Loader";
import NavigatorBar from "@/components/common/NavigatorBar";
import LetterTag from "@/components/mypage/LetterTag";
import { Suspense, useState } from "react";
import styled from "styled-components";

const SendedLetter = () => {
  const [isSelecting, setIsSelecting] = useState(false); // 항목을 선택중인지
  const [selectedId, setSelectedId] = useState<number[]>([]);
  const [senderArray, setSenderArray] = useState([
    { id: 1, name: "진주" },
    { id: 2, name: "예현" },
    { id: 3, name: "동우" },
    { id: 4, name: "민지" },
    { id: 5, name: "규리" },
    { id: 6, name: "규민" },
    { id: 7, name: "진주" },
    { id: 8, name: "예현" },
    { id: 9, name: "동우" },
    { id: 10, name: "민지" },
    { id: 11, name: "규리" },
    { id: 12, name: "규민" },
    { id: 13, name: "진주" },
    { id: 14, name: "예현" },
    { id: 15, name: "동우" },
    { id: 16, name: "민지" },
    { id: 17, name: "규리" },
    { id: 18, name: "규민" },
  ]);

  const selectAllItem = () => {
    setIsSelecting(!isSelecting);
    setSelectedId([]);
  };

  const cancelItems = () => {
    setSelectedId([]);
    setIsSelecting(false);
  };

  const discardItems = () => {
    const newSenderArray = senderArray.filter(
      (sender) => !selectedId.includes(sender.id)
    );

    setSenderArray(newSenderArray);
    setIsSelecting(false);
    setSelectedId([]);
    console.log("Deleted IDs:", selectedId);
  };

  const handleSelectItem = (id: number) => {
    if (selectedId.includes(id)) {
      setSelectedId(selectedId.filter((selected) => selected !== id));
    } else {
      setSelectedId([...selectedId, id]);
    }
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
        <LetterGrid>
          {senderArray.map(({ id, name }) => (
            <LetterTag
              key={id}
              id={id}
              name={name}
              isSelecting={isSelecting}
              isSelected={selectedId.includes(id)}
              onSelect={handleSelectItem}
            />
          ))}
        </LetterGrid>
      </MainWrapper>
      <ButtonWrapper>
        {isSelecting && (
          <>
            <Button
              buttonType="secondary"
              size="default"
              text="취소"
              onClick={cancelItems}
            />
            <Button
              buttonType="primary"
              size="large"
              text="삭제하기"
              onClick={discardItems}
            />
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

const LetterGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px 28px; 
    padding: 32px 0;
    width: 100%;
    place-items: center;
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
