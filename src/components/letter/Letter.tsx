import React, { useState } from "react";
import styled from "styled-components";
import Pagination from "./Pagination";
import SwipeableContent from "./Content";
import { theme } from "@/styles/theme";
import { useRouter } from "next/navigation";

interface LetterProps {
  id: number;
  templateType: number;
  name: string;
  content?: string;
  date: string;
  isImage: boolean;
  images?: string[];
  readOnly?: boolean;
}

const Letter = (props: LetterProps) => {
  const {
    id,
    templateType,
    name,
    content,
    date,
    isImage,
    images,
    readOnly = false,
  } = props;
  const [currentPage, setCurrentPage] = useState(0);
  const paginateContent = (content: string, maxCharsPerPage: number) => {
    const pages = [];
    for (let i = 0; i < content.length; i += maxCharsPerPage) {
      pages.push(
        content.substring(i, Math.min(content.length, i + maxCharsPerPage))
      );
    }
    return pages;
  };
  const contentPages = isImage ? images : paginateContent(content!, 190);
  const totalPage = isImage ? images!.length : contentPages!.length;
  const [isPopup, setIsPopup] = useState(false);
  const router = useRouter();

  function replaceDashWithDot(dateString: string) {
    return dateString.replace(/-/g, ".");
  }

  return (
    <Container $templateType={templateType}>
      {!readOnly && isPopup && (
        <PopupContainer>
          <Date>{replaceDashWithDot(date)}</Date>
          <EditBtn onClick={() => router.push(`/letter/edit/${id}`)}>
            수정
          </EditBtn>
          <DeleteBtn>삭제</DeleteBtn>
        </PopupContainer>
      )}
      <TopContainer>
        <Name>From.{name}</Name>
        {!readOnly && (
          <button onClick={() => setIsPopup(!isPopup)}>
            <img src="/assets/icons/ic_more.svg" />
          </button>
        )}
      </TopContainer>
      <Content>
        <SwipeableContent
          content={isImage ? images! : contentPages!}
          setPage={setCurrentPage}
          totalPage={totalPage ? totalPage : 0}
          isImage={isImage}
          page={currentPage}
        />
      </Content>
      {totalPage > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPage={totalPage ? totalPage : 0}
        />
      )}
    </Container>
  );
};

export default Letter;

const Container = styled.div<{ $templateType: number }>`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  height: auto;
  padding: 34px;
  max-width: 345px;
  max-height: 349px;
  min-height: 349px;
  background-image: ${({ $templateType }) =>
    `url('/assets/letter/background_${$templateType}.png')`};
  background-size: 100% auto;
  background-position: center;
  background-repeat: no-repeat;
  color: white;
  position: relative;
  border-radius: 12px;
  border: 1px solid ${theme.colors.gray700};
`;

const TopContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  button {
    color: white;
  }
`;

const Name = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  ${(props: any) => props.theme.fonts.title01};
`;

const Date = styled.div`
  display: flex;
  box-sizing: border-box;
  white-space: nowrap;
  ${(props) => props.theme.fonts.caption03};
  color: ${theme.colors.gray400};
  width: 100%;
  justify-content: center;
  //padding-top: 5px;
`;

const Content = styled.div`
  width: 100%;
  height: 90%;
  display: flex;
  box-sizing: border-box;
  padding: 10px 0;
  ${(props: any) => props.theme.fonts.body07};
  overflow: hidden;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

const PopupContainer = styled.div`
  width: 88px;
  height: 124px;
  flex-shrink: 0;
  position: absolute;
  top: 74px;
  right: 34px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 12px;
  background: rgba(62, 65, 81, 0.7);
  backdrop-filter: blur(8px);
  z-index: 1;
  padding: 12px;
  box-sizing: border-box;
`;

const EditBtn = styled.button`
  ${(props: any) => props.theme.fonts.button01};
  color: ${(props: any) => props.theme.colors.white};
  padding: 10px;
  border-bottom: 1px solid #5b5f70;
`;

const DeleteBtn = styled.button`
  ${(props: any) => props.theme.fonts.button01};
  color: ${(props: any) => props.theme.colors.white};
  padding: 10px;
`;
