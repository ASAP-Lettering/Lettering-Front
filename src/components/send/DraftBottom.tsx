import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { theme } from "@/styles/theme";
import { motion, AnimatePresence } from "framer-motion";
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
  handleDeleteDraft: (draftId: string) => void;
}

const DraftBottom = (props: DraftBottomProps) => {
  const { onClose, handleDeleteDraft } = props;
  const [draftLists, setDraftLists] = useState<Draft[] | null>(null);
  const [isDeleteMode, setIsDeleteMode] = useState<boolean>(false);
  const [isClosing, setIsClosing] = useState<boolean>(false);

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

  const handleDelete = (draftKey: string) => {
    if (draftLists) {
      handleDeleteDraft(draftKey);
      const updatedDrafts = draftLists.filter(
        (item) => item.draftKey !== draftKey
      );
      setDraftLists(updatedDrafts);
    }
  };

  const handleCloseModal = () => {
    setIsClosing(true);
  };

  return (
    <AnimatePresence>
      {!isClosing && (
        <Overlay
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Container
            as={motion.div}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <CloseWrapper>
              <CloseButton
                src="/assets/icons/ic_close.svg"
                width={24}
                height={24}
                alt="닫기"
                onClick={handleCloseModal}
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
                  <DraftListWrapper key={item.draftKey}>
                    <DraftList
                      id={item.draftKey}
                      name={item.receiverName}
                      content={item.content}
                      timestamp={item.lastUpdated}
                      isDeleteMode={isDeleteMode}
                      onDelete={handleDelete}
                      onClose={onClose}
                    />
                  </DraftListWrapper>
                ))}
              </DraftListContainer>
            ) : (
              <NoData>저장된 편지가 없어요</NoData>
            )}
          </Container>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default DraftBottom;

const Overlay = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  background: rgba(0, 0, 0, 0.7);
`;

const Container = styled.div`
  width: 100%;
  max-width: 393px;
  min-height: 258px;
  padding: 18px 20px;
  border-radius: 20px 20px 0px 0px;
  background: ${theme.colors.gray900};
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
  padding: 0px 4px;
  margin-bottom: 22px;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.body04};

  @media (max-height: 580px) {
    ${(props) => props.theme.fonts.caption01};
  }
`;

const Span = styled.span`
  display: flex;
  align-items: center;
  color: ${theme.colors.gray500};
  ${(props) => props.theme.fonts.caption02};

  @media (max-height: 580px) {
    ${(props) => props.theme.fonts.body13};
  }
`;

const EditButton = styled.button`
  color: ${theme.colors.gray300};
  ${(props) => props.theme.fonts.body09};

  @media (max-height: 580px) {
    ${(props) => props.theme.fonts.body13};
  }
`;

const DraftListContainer = styled.div`
  width: 100%;
  max-height: 342px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  overflow: auto;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE, Edge */
  scrollbar-width: none; /* Firefox */
`;

const DraftListWrapper = styled.div`
  width: 100%;
  height: 80px;
  padding: 0 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  flex-shrink: 0;

  @media (max-height: 580px) {
    height: 60px;
  }
`;

const NoData = styled.div`
  color: ${theme.colors.gray300};
  ${(props) => props.theme.fonts.body07};
`;
