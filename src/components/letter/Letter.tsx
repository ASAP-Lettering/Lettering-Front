import React, { useState } from "react";
import styled from "styled-components";
import Pagination from "./Pagination";
import SwipeableContent from "./Content";
import { theme } from "@/styles/theme";
import { useRouter } from "next/navigation";
import ConfirmModal from "../common/ConfirmModal";

type showType = "preview" | "receive" | "send" | "url";
export type contentType = "one" | "all";

interface LetterProps {
  showType: showType;
  contentType?: contentType;
  id: number;
  templateType: number;
  name: string;
  content?: string;
  date?: string;
  isImage: boolean;
  images?: string[];
  width?: string;
  height?: string;
  padding?: string;
  readOnly?: boolean;
}

const Letter = (props: LetterProps) => {
  const {
    showType,
    contentType = "all",
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
    readOnly = false,
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
  const [isDelete, setIsDelete] = useState(false);

  function replaceDashWithDot(dateString: string) {
    return dateString.replace(/-/g, ".");
  }

  //삭제 모달 관리
  const handleConfirm = () => {
    alert("삭제 완료");
    setIsDelete(false);
    setIsPopup(false);
  };

  const handleCancel = () => {
    setIsDelete(false);
    setIsPopup(false);
  };

  return (
    <Container
      $templateType={templateType}
      $width={width}
      $height={height}
      $padding={padding}
    >
      {isDelete && (
        <ConfirmModal
          title="해당 편지를 정말 삭제할까요?"
          sub="삭제된 편지는 복구되지 않아요."
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
      {!readOnly && isPopup && (
        <PopupContainer>
          {date && <ModalDate>{replaceDashWithDot(date)}</ModalDate>}
          <EditBtn onClick={() => router.push(`/letter/edit/${id}`)}>
            수정
          </EditBtn>
          <DeleteBtn onClick={() => setIsDelete(true)}>삭제</DeleteBtn>
        </PopupContainer>
      )}
      {(showType === "receive" || showType === "send") && (
        <>
          <TopContainer>
            <Name $showType={showType} $contentType={contentType}>
              {showType === "send" ? `To. ${name}` : `From. ${name}`}
            </Name>
            {!readOnly && (
              <button onClick={() => setIsPopup(!isPopup)}>
                <img src="/assets/icons/ic_more.svg" alt="More options" />
              </button>
            )}
          </TopContainer>
        </>
      )}
      {showType === "send" && <Date $showType="send">{date}</Date>}
      {showType === "preview" && (
        <>
          <TopPreviewContainer>
            <Name $showType={showType} $contentType={contentType}>
              From. {name}
            </Name>
          </TopPreviewContainer>
        </>
      )}
      <Content $showType={showType} $contentType={contentType}>
        <SwipeableContent
          contentType={contentType}
          content={isImage ? images! : contentPages!}
          setPage={setCurrentPage}
          totalPage={totalPage ? totalPage : 0}
          isImage={isImage}
          page={currentPage}
        />
      </Content>
      {showType === "url" && (
        <UrlWrapper>
          <UrlName>From. {name}</UrlName>
          <UrlDate>{date}</UrlDate>
        </UrlWrapper>
      )}
      {contentType === "all" && totalPage > 1 && (
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
  gap: 10px;
  height: auto;
  padding: ${({ $padding }) => ($padding ? $padding : "34px")};
  max-width: ${({ $width }) => ($width ? $width : "345px")};
  min-width: ${({ $width }) => ($width ? $width : "345px")};
  max-height: ${({ $height }) => ($height ? $height : "349px")};
  min-height: ${({ $height }) => ($height ? $height : "349px")};
  background-image: ${({ $templateType }) =>
    `url('/assets/letter/background_${$templateType}.png')`};
  background-size: cover;
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

const TopPreviewContainer = styled(TopContainer)`
  margin-top: 20px;
  ${theme.fonts.subtitle}
`;

const Name = styled.div<{ $showType: string; $contentType: string }>`
  display: flex;
  align-items: center;
  text-align: center;
  ${(props) =>
    props.$showType === "preview" && props.$contentType === "one"
      ? props.theme.fonts.caption01
      : props.theme.fonts.title01};
`;

const Date = styled.div<{ $showType: string }>`
  color: ${theme.colors.gray400};
  ${(props) => props.theme.fonts.body09};
  ${(props) => (props.$showType === "send" ? props.theme.fonts.caption03 : "")};
`;

const Content = styled.div<{ $showType: string; $contentType: string }>`
  width: 100%;
  ${(props) =>
    props.$showType === "preview"
      ? `flex: 1; height: calc(100% - 80px);`
      : `height: 90%;`}
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-align: left;
  box-sizing: border-box;
  border-radius: 10px;
  padding: 10px 0;
  ${(props) =>
    props.$showType === "preview" && props.$contentType === "one"
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
  padding: 10px;
  border-bottom: 1px solid #5b5f70;
`;

const DeleteBtn = styled.button`
  ${(props: any) => props.theme.fonts.button01};
  color: ${(props: any) => props.theme.colors.white};
  padding: 10px;
`;

const ModalDate = styled.div`
  display: flex;
  box-sizing: border-box;
  white-space: nowrap;
  ${(props) => props.theme.fonts.caption03};
  color: ${theme.colors.gray400};
  width: 100%;
  justify-content: center;
  padding-top: 8px;
`;

const UrlWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: center;
    align-items: center;
`;

const UrlName = styled.div`
    display: flex;
    text-align: center;
    ${(props: any) => props.theme.fonts.body06};
    color: ${(props: any) => props.theme.colors.white};
`;

const UrlDate = styled.div`
    display: flex;
    text-align: center;
    ${(props: any) => props.theme.fonts.caption02};
    color: ${(props: any) => props.theme.colors.gray500};
`;
