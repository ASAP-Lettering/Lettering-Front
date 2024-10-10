import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { theme } from "@/styles/theme";
import DraftList from "./DraftList";
import Image from "next/image";
import { getDraftList } from "@/api/send/send";

interface Draft {
  draftKey: string;
  receiverName: string;
  content: string;
  lastUpdated: string;
}

interface DraftBottomProps {
  onClose: () => void;
}

const DraftBottom = (props: DraftBottomProps) => {
  const { onClose } = props;
  const [draftLists, setDraftLists] = useState<Draft[] | null>(null);
  const [isDeleteMode, setIsDeleteMode] = useState<boolean>(false);

  useEffect(() => {
    const fetchGetDraftList = async () => {
      try {
        const response = await getDraftList();
        setDraftLists(response.data.drafts);
        console.log("임시 저장 목록 조회 성공");
      } catch {
        console.log("임시 저장 목록 조회 실패");
      }
    };

    fetchGetDraftList();
  }, []);

  const handleDeleteDraft = (draftKey: string) => {
    if (draftLists) {
      const updatedDrafts = draftLists.filter(
        (item) => item.draftKey !== draftKey
      );
      setDraftLists(updatedDrafts);
    }
  };

  return (
    <Overlay>
      <Container>
        <CloseWrapper>
          <CloseButton
            src="/assets/icons/ic_close.svg"
            width={24}
            height={24}
            alt="닫기"
            onClick={onClose}
          />
        </CloseWrapper>
        <Top>
          <Title>
            임시 저장 편지
            <Span>총 {draftLists?.length}개</Span>
          </Title>
          {draftLists && draftLists.length > 0 && (
            <EditButton onClick={() => setIsDeleteMode(!isDeleteMode)}>
              {isDeleteMode ? "완료" : "삭제"}
            </EditButton>
          )}
        </Top>
        {draftLists && draftLists?.length > 0 ? (
          <DraftListContainer>
            {draftLists.map((item) => (
              <DraftList
                key={item.draftKey}
                id={item.draftKey}
                name={item.receiverName}
                content={item.content}
                timestamp={item.lastUpdated}
                isDeleteMode={isDeleteMode}
                onDelete={handleDeleteDraft}
                onClose={onClose}
              />
            ))}
          </DraftListContainer>
        ) : (
          <NoData>저장된 편지가 없어요</NoData>
        )}
      </Container>
    </Overlay>
  );
};

export default DraftBottom;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.7);
`;

const Container = styled.div`
  max-width: 393px;
  min-width: 258px;
  padding: 18px 24px;
  border-radius: 20px 20px 0px 0px;
  background: ${theme.colors.gray900};
  position: sticky;
  bottom: 0;
  left: 0;
  z-index: 10;
`;

const CloseWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 24px;
`;

const CloseButton = styled(Image)`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.body04};
  margin-bottom: 22px;
`;

const Span = styled.span`
  color: ${theme.colors.gray500};
  ${(props) => props.theme.fonts.caption02};
`;

const EditButton = styled.button`
  color: ${theme.colors.gray300};
  ${(props) => props.theme.fonts.body09};
`;

const DraftListContainer = styled.div`
  width: 100%;
  max-height: 342px;
  display: flex;
  align-items: flex-end;
  gap: 12px;
  overflow-x: scroll;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE, Edge */
  scrollbar-width: none; /* Firefox */
`;

const NoData = styled.div`
  color: ${theme.colors.gray300};
  ${(props) => props.theme.fonts.body07};
`;
