import React, { use, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import Pagination from "./Pagination";
import SwipeableContent from "./Content";
import { theme } from "@/styles/theme";
import { useRouter } from "next/navigation";
import ConfirmModal from "../common/ConfirmModal";
import { deleteIndependentLetter, deleteLetter } from "@/api/letter/letter";
import { useRecoilState } from "recoil";
import { registerLetterState } from "@/recoil/letterStore";
import { flipAnimation } from "@/styles/animation";
import { useToast } from "@/hooks/useToast";

type showType = "previewSend" | "previewReceive" | "receive" | "send" | "url";
export type contentType = "one" | "all";
type pageType = "independent" | "space";

interface LetterProps {
  showType: showType;
  contentType?: contentType;
  pageType?: pageType;
  id: string;
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
  nextLetterId?: string;
  maxLineWidth?: number;
}

const Letter = (props: LetterProps) => {
  const {
    showType,
    contentType = "all",
    pageType = "independent",
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
    nextLetterId,
    maxLineWidth,
  } = props;
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [paginatedContent, setPaginatedContent] = useState<string[]>([]);
  const [isPopup, setIsPopup] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [flip, setFlip] = useState(false);
  const [isChangeImage, setIsChangeImage] = useState(false);
  const { showToast } = useToast();

  /* 수정 클릭 시 등록하기 store 저장 */
  const [letterState, setLetterState] = useRecoilState(registerLetterState);

  useEffect(() => {
    setFlip(true);
    setIsChangeImage(isImage);
    const timer = setTimeout(() => {
      setCurrentPage(0);
      setFlip(false);
    }, 700);

    return () => {
      clearTimeout(timer);
    };
  }, [isImage]);

  useEffect(() => {}, [isChangeImage]);

  /* 페이지 내용 분할 처리 */
  useEffect(() => {
    if (!isImage && content) {
      const container = document.querySelector(".ContentContainer"); // content 부모 컨테이너
      if (!container) return;

      const maxLinesPerPage = 7;

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (context) {
        canvas.width = container.clientWidth; // 부모 컨테이너의 width 기준
        context.font = "16px Pretendard";
        const maxWidth = container.clientWidth;

        let currentLine = "";
        let lines: string[] = [];

        for (let i = 0; i < content.length; i++) {
          const char = content[i];
          if (char === "\n") {
            lines.push(currentLine.trim());
            currentLine = "";
            continue;
          }

          const testLine = currentLine + char;
          if (context.measureText(testLine).width < maxWidth) {
            currentLine = testLine;
          } else {
            lines.push(currentLine.trim());
            currentLine = char;
          }
        }
        if (currentLine) lines.push(currentLine.trim());

        const paginated = [];
        for (let i = 0; i < lines.length; i += maxLinesPerPage) {
          paginated.push(lines.slice(i, i + maxLinesPerPage).join("\n"));
        }

        setPaginatedContent(paginated);
      }
    }
  }, [content, isImage, contentType]);

  const totalPage =
    contentType === "one"
      ? 1
      : isImage
      ? images?.length ?? 0
      : paginatedContent.length;

  function replaceDashWithDot(dateString: string) {
    return dateString.replace(/-/g, ".");
  }

  //삭제 모달 관리
  const handleConfirm = () => {
    if (pageType === "independent") {
      deleteIndependentLetter(id.toString()).then((res) =>
        console.log(res.data)
      );
    } else {
      deleteLetter(id.toString()).then((res) => console.log(res.data));
    }
    if (nextLetterId) {
      router.push(`/letter/${nextLetterId}`);
    } else {
      router.push("/planet");
    }
    showToast(`${name} 님의 편지가 삭제되었어요`, {
      icon: false,
      close: true,
      bottom: "80px",
    });
  };

  const handleCancel = () => {
    setIsDelete(false);
    setIsPopup(false);
  };

  const handleModify = () => {
    setLetterState({
      senderName: name,
      content: content || "",
      images: images || [],
      previewImages: images || [],
      templateType: templateType,
    });
    if (pageType === "independent") {
      router.push(`/letter/register?letterId=${id}&independent=true`);
    } else {
      router.push(`/letter/register?letterId=${id}`);
    }
  };

  return (
    <Container
      $templateType={templateType}
      $width={width}
      $height={height}
      $padding={padding}
      $showType={showType}
      className={flip ? "flip" : ""}
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
          <EditBtn onClick={handleModify}>수정</EditBtn>
          <DeleteBtn onClick={() => setIsDelete(true)}>삭제</DeleteBtn>
        </PopupContainer>
      )}
      {(showType === "receive" || showType === "send") && (
        <>
          <TopContainer $contentType={contentType}>
            <Name $showType={showType} $contentType={contentType}>
              {`${showType === "send" ? `To. ` : `From. `} ${name}`}
            </Name>
            {!readOnly && (
              <button onClick={() => setIsPopup(!isPopup)}>
                <img src="/assets/icons/ic_more.svg" alt="More options" />
              </button>
            )}
          </TopContainer>
        </>
      )}
      {(showType === "send" || (showType === "previewSend" && isImage)) && (
        <Date $showType="send">{date}</Date>
      )}
      {(showType === "previewReceive" || showType === "previewSend") && (
        <>
          <TopPreviewContainer $contentType={contentType}>
            {name && (
              <Name $showType={showType} $contentType={contentType}>
                {`${showType === "previewSend" ? `To. ` : `From. `} ${name}`}
              </Name>
            )}
          </TopPreviewContainer>
        </>
      )}
      <Content
        $showType={showType}
        $contentType={contentType}
        className="ContentContainer"
      >
        <SwipeableContent
          contentType={contentType}
          content={isChangeImage ? images ?? [] : paginatedContent}
          setPage={setCurrentPage}
          totalPage={totalPage ? (totalPage >= 8 ? 8 : totalPage) : 0}
          isImage={isChangeImage}
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
          totalPage={totalPage ? (totalPage >= 8 ? 8 : totalPage) : 0}
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
  $showType: "previewSend" | "previewReceive" | "receive" | "send" | "url";
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
  max-height: ${({ $height }) => ($height ? $height : "349px")};
  min-height: ${({ $height }) => ($height ? $height : "349px")};
  background-image: ${({ $templateType }) =>
    `url('/assets/letter/background_${$templateType}.png')`};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: ${theme.colors.white};
  position: relative;
  border-radius: 12px;
  border: 1px solid ${theme.colors.gray700};

  &.flip {
    animation: ${flipAnimation} 0.8s ease-in-out;
    transform-style: preserve-3d;
    perspective: 1000px;
  }
`;

const TopContainer = styled.div<{
  $contentType: string;
}>`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  button {
    color: ${theme.colors.white};
  }
`;

const TopPreviewContainer = styled(TopContainer)`
  margin-top: ${(props) => (props.$contentType === "all" ? "20px" : "0px")};
  ${theme.fonts.subtitle}

  @media (max-height: 628px) {
    margin-top: 0;
  }
`;

const Name = styled.div<{ $showType: string; $contentType: string }>`
  display: flex;
  align-items: center;
  text-align: center;
  ${(props) => props.theme.fonts.title01};

  @media (max-height: 628px) {
    ${(props) => props.theme.fonts.body7};
  }

  @media (max-height: 580px) {
    ${(props) => props.theme.fonts.body10};
  }
`;

const Date = styled.div<{ $showType: string }>`
  color: ${theme.colors.gray400};
  ${(props) => props.theme.fonts.body09};
  ${(props) => (props.$showType === "send" ? props.theme.fonts.caption03 : "")};
`;

const Content = styled.div<{ $showType: string; $contentType: string }>`
  width: 100%;
  ${(props) =>
    props.$showType === "previewSend" || props.$showType === "previewReceive"
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
    (props.$showType === "previewSend" ||
      props.$showType === "previewReceive") &&
    props.$contentType === "one"
      ? props.theme.fonts.caption09
      : props.theme.fonts.body07};
  overflow: hidden;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  @media (max-height: 580px) {
    ${(props) => props.theme.fonts.body12};
  }
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

  @media (max-height: 628px) {
    width: 78px;
    height: 110px;
  }

  @media (max-height: 580px) {
    width: 76px;
    height: 95px;
    padding: 10px;
  }
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

  @media (max-height: 628px) {
    padding-top: 5px;
  }

  @media (max-height: 580px) {
    padding-top: 0px;
    ${theme.fonts.caption05}
  }
`;

const EditBtn = styled.button`
  ${(props: any) => props.theme.fonts.button01};
  color: ${(props: any) => props.theme.colors.white};
  padding: 10px;
  border-bottom: 1px solid #5b5f70;

  @media (max-height: 628px) {
    padding: 5px;
  }

  @media (max-height: 580px) {
    ${theme.fonts.button03};
  }
`;

const DeleteBtn = styled.button`
  ${(props: any) => props.theme.fonts.button01};
  color: ${(props: any) => props.theme.colors.white};
  padding: 10px;

  @media (max-height: 628px) {
    padding: 5px;
  }

  @media (max-height: 580px) {
    ${theme.fonts.button03};
  }
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
