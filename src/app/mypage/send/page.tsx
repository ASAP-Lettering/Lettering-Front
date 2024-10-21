"use client";

import {
  deleteSentLetter,
  deleteSentLetters,
  getSentLetter,
} from "@/api/mypage/user";
import Button from "@/components/common/Button";
import ConfirmModal from "@/components/common/ConfirmModal";
import Loader, { LoaderContainer } from "@/components/common/Loader";
import NavigatorBar from "@/components/common/NavigatorBar";
import LetterTag from "@/components/mypage/LetterTag";
import { useToast } from "@/hooks/useToast";
import { SentLetterListType } from "@/types/letter";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import styled from "styled-components";

const SendedLetter = () => {
  const [isSelecting, setIsSelecting] = useState(false); // 항목을 선택중인지
  const [selectedId, setSelectedId] = useState<string[]>([]);
  const [senderArray, setSenderArray] = useState<SentLetterListType[] | null>();
  const { showToast } = useToast();
  const [isPopup, setIsPopup] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchLetterList();
  }, []);

  const selectAllItem = () => {
    if (senderArray) {
      const allIds = senderArray.map((sender) => sender.letterId);
      setSelectedId(allIds);
    }
  };

  const cancelItems = () => {
    setSelectedId([]);
    setIsSelecting(false);
    setIsPopup(false);
  };

  const discardItems = async () => {
    setIsPopup(false);
    if (senderArray && selectedId) {
      await fetchDeleteLetter(selectedId);
      setIsSelecting(false);
      setSelectedId([]);
      console.log("Deleted IDs:", selectedId);
      fetchLetterList();
    }
  };

  const handleSelectItem = (id: string) => {
    if (isSelecting) {
      if (selectedId.includes(id)) {
        setSelectedId(selectedId.filter((selected) => selected !== id));
      } else {
        setSelectedId([...selectedId, id]);
      }
    } else {
      router.push(`/mypage/send/${id}`);
    }
  };

  const fetchLetterList = async () => {
    try {
      const response = await getSentLetter();
      setSenderArray(response.data.content);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDeleteLetter = async (letterIds: string[]) => {
    if (letterIds.length === 1) {
      try {
        const response = await deleteSentLetter(letterIds[0]);
        showToast(`1개의 편지가 삭제되었어요`, {
          icon: false,
          close: true,
          bottom: "50px",
        });
      } catch (error) {
        console.log(error);
      }
    } else if (letterIds.length > 1) {
      try {
        const response = await deleteSentLetters(letterIds);
        showToast(`${letterIds.length}개의 편지가 삭제되었어요`, {
          icon: false,
          close: true,
          bottom: "50px",
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Container $isSelecting={isSelecting}>
      {isPopup && (
        <ConfirmModal
          title={selectedId.length + "개의 편지를 정말 삭제할까요?"}
          sub="삭제된 편지는 복구되지 않아요."
          onConfirm={discardItems}
          onCancel={cancelItems}
        />
      )}
      <Wrapper>
        <NavigatorBar title="보낸 편지함" cancel={false} />
      </Wrapper>
      <MainWrapper>
        <Header>
          {!isSelecting ? (
            <>
              {" "}
              <SelectText onClick={() => setIsSelecting(!isSelecting)}>
                삭제
              </SelectText>
            </>
          ) : (
            <SelectText onClick={selectAllItem}>
              <img src="/assets/mypage/ic_check.svg" />
              전체 선택
            </SelectText>
          )}
        </Header>
        <LetterGrid>
          {senderArray?.map(({ letterId, receiverName }) => (
            <LetterTag
              key={letterId}
              id={letterId}
              name={receiverName}
              isSelecting={isSelecting}
              isSelected={selectedId.includes(letterId)}
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
              onClick={() => {
                if (selectedId.length > 0) {
                  setIsPopup(true);
                }
              }}
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
      background-image: url("/assets/mypage/img_background.png");
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      -webkit-scrollbar {
          display: none;
      }
  
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
