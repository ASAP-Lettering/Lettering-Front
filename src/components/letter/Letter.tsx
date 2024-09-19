import React, { useState } from "react";
import styled from "styled-components";
import Pagination from "./Pagination";
import SwipeableContent from "./Content";
import { theme } from "@/styles/theme";
import { useRouter } from "next/navigation";

type showType = "preview" | "receive";

interface LetterProps {
  showType: showType;
  id: number;
  templateType: number;
  name: string;
  content?: string;
  date: string;
  isImage: boolean;
  images?: string[];
  width?: string;
  height?: string;
  padding?: string;
}

const Letter = (props: LetterProps) => {
  const {
    showType,
    id,
    templateType,
    name,
    content,
    date,
    isImage,
    images,
    width,
    height,
    padding,
  } = props;
  const [currentPage, setCurrentPage] = useState(0);
  // const paginateContent = (content: string, maxCharsPerPage: number) => {
  //   const pages = [];
  //   for (let i = 0; i < content.length; i += maxCharsPerPage) {
  //     pages.push(
  //       content.substring(i, Math.min(content.length, i + maxCharsPerPage))
  //     );
  //   }
  //   return pages;
  // };

  /* 한 페이지에 최대 7줄의 텍스트를 표시하도록 조정 */
  const paginateContent = (content: string, maxLinesPerPage: number) => {
    const lines = content.split("\n"); // 줄바꿈 기준
    const pages = [];

    for (let i = 0; i < lines.length; i += maxLinesPerPage) {
      pages.push(lines.slice(i, i + maxLinesPerPage).join("\n")); // 최대 7줄씩 분리하여 각 페이지로 나눔
    }

    return pages;
  };

  // const contentPages = isImage ? images : paginateContent(content!, 210);
  const contentPages = isImage ? images : paginateContent(content!, 7); // 한 페이지에 최대 7줄 설정
  const totalPage = isImage ? images!.length : contentPages!.length;
  const [isPopup, setIsPopup] = useState(false);
  const router = useRouter();

  return (
    <Container
      $templateType={templateType}
      $width={width}
      $height={height}
      $padding={padding}
    >
      {isPopup && (
        <PopupContainer>
          <EditBtn onClick={() => router.push(`/letter/edit/${id}`)}>
            수정
          </EditBtn>
          <DeleteBtn>삭제</DeleteBtn>
        </PopupContainer>
      )}
      {showType === "receive" && (
        <>
          <TopContainer>
            <Name $showType={showType}>From.{name}</Name>
            <button onClick={() => setIsPopup(!isPopup)}>
              <img src="/assets/icons/ic_more.svg" />
            </button>
          </TopContainer>
          <Date $showType={showType}>{date}</Date>
        </>
      )}
      <Content $showType={showType}>
        <SwipeableContent
          content={isImage ? images! : contentPages!}
          setPage={setCurrentPage}
          totalPage={totalPage ? totalPage : 0}
          isImage={isImage}
          page={currentPage}
        />
      </Content>
      {showType === "preview" && (
        <>
          <BottomContainer>
            <Name $showType={showType}>From.{name}</Name>
            <Date $showType={showType}>{date}</Date>
          </BottomContainer>
        </>
      )}
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

const Container = styled.div<{
  $templateType: number;
  $width?: string;
  $height?: string;
  $padding?: string;
}>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
  height: auto;
  padding: ${({ $padding }) => ($padding ? $padding : "34px")};
  max-width: ${({ $width }) => ($width ? $width : "345px")};
  min-width: ${({ $width }) => ($width ? $width : "345px")};
  max-height: ${({ $height }) => ($height ? $height : "349px")};
  min-height: ${({ $height }) => ($height ? $height : "349px")};
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

const BottomContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
`;

const Name = styled.div<{ $showType: string }>`
  display: flex;
  align-items: center;
  text-align: center;
  ${(props) =>
    props.$showType === "preview"
      ? props.theme.fonts.caption01
      : props.theme.fonts.title01};
`;

const Date = styled.div<{ $showType: string }>`
  color: ${theme.colors.gray400};
  ${(props) =>
    props.$showType === "preview"
      ? props.theme.fonts.caption04
      : props.theme.fonts.body09};
`;

const Content = styled.div<{ $showType: string }>`
  width: 100%;
  ${(props) =>
    props.$showType === "preview"
      ? `flex: 1; height: calc(100% - 80px);`
      : `height: 90%;`}
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 10px 0;
  ${(props) =>
    props.$showType === "preview"
      ? props.theme.fonts.caption09
      : props.theme.fonts.body07};
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
  padding: 12px;
  border-bottom: 1px solid #5b5f70;
`;

const DeleteBtn = styled.button`
  ${(props: any) => props.theme.fonts.button01};
  color: ${(props: any) => props.theme.colors.white};
  padding: 12px;
`;
