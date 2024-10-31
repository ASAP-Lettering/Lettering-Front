import { deleteOrbitLetter } from "@/api/planet/letter/spaceLetter";
import { Orbit } from "@/constants/orbit";
import { planetRefState } from "@/recoil/RefStore";
import { theme } from "@/styles/theme";
import { motion } from "framer-motion";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import styled, { css } from "styled-components";

type tagType = "orbit" | "planet" | "letter";
type iconType = "chevron" | "edit" | "plus";

interface TagProps {
  tagType: tagType;
  tagId?: string;
  name?: string;
  isNew?: boolean;
  isDeleteMode?: boolean;
  icon?: iconType;
  orbitType?: string;
  receivedDate?: string;
  onClick?: () => void;
  onEdit?: (editedName: string) => void;
  onHold?: () => void;
  innerRef?: (element: HTMLElement | null) => void;
  onDelete?: (deleteId: string) => void;
  isDragable?: boolean;
  onDragEnd?: (item: Orbit) => void;
  onTouchEnd?: (item: Orbit) => void;
}

const Tag = (props: TagProps) => {
  const {
    tagType,
    tagId,
    name,
    isNew,
    isDeleteMode = false,
    icon,
    orbitType,
    receivedDate,
    onClick,
    onEdit,
    onHold,
    innerRef,
    onDelete,
    isDragable = false,
    onDragEnd,
    onTouchEnd,
  } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [isHoldTriggered, setIsHoldTriggered] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startPosition, setStartPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const holdTimeout = useRef<NodeJS.Timeout | null>(null);
  const tagRef = useRef<HTMLDivElement | null>(null);
  const [planetRef, setPlanetRef] = useRecoilState(planetRefState);

  const handleEditClick = () => {
    if (icon === "edit") {
      setIsEditing(true);
    }
  };

  const formatDate = (dateString: string): string => {
    const regex = /(\d{4})-(\d{2})-(\d{2})/;
    const match = dateString.match(regex);

    if (match) {
      return `${match[1]}.${match[2]}.${match[3]}`;
    }

    throw new Error("Invalid date format");
  };

  const handleDragStart = () => {
    if (onDragEnd && tagId && name && tagType === "orbit") {
      console.log("드래그 시작");
      setIsDragging(true);
      clearHoldTimeout();
      onDragEnd({
        letterId: tagId,
        senderName: name,
      });
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setStartPosition(null);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(e.target.value);
  };

  const handleDeleteOrbit = async (
    event: React.MouseEvent<HTMLImageElement>
  ) => {
    event.stopPropagation();

    if (tagId && onDelete) {
      try {
        const response = await deleteOrbitLetter(tagId);
        console.log("궤도 편지 삭제 성공", response);
        onDelete(tagId);
      } catch {
        console.log("궤도 편지 삭제 실패");
      }
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (onEdit && editedName) {
      onEdit(editedName);
    }
  };

  const handleHoldStart = () => {
    if (onHold && !isDragging) {
      setIsHoldTriggered(true);
      holdTimeout.current = setTimeout(() => {
        onHold();
        setIsHoldTriggered(false);
      }, 1000);
    }
  };

  const handleHoldEnd = () => {
    if (isHoldTriggered && holdTimeout.current) {
      clearTimeout(holdTimeout.current);
      setIsHoldTriggered(false);
    }
    if (!isHoldTriggered && !isDeleteMode && onClick) {
      onClick();
    }
  };

  const clearHoldTimeout = () => {
    if (holdTimeout.current) {
      clearTimeout(holdTimeout.current);
      setIsHoldTriggered(false);
    }
  };

  const renderIcon = () => {
    if (icon === "chevron") {
      return "/assets/icons/ic_chevron_right.svg";
    } else if (icon === "edit") {
      return "/assets/icons/ic_edit.svg";
    } else if (icon === "plus") {
      return "/assets/icons/ic_plus.svg";
    }
    return "";
  };

  //모바일 터치 드래그
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (tagType === "letter") {
      handleHoldStart();
    }
    if (isDragable && tagType === "orbit") {
      e.stopPropagation();
      console.log("터치 시작");
      const touch = e.touches[0];
      setStartPosition({ x: touch.clientX, y: touch.clientY });

      e.currentTarget.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      e.currentTarget.addEventListener("touchend", handleTouchEnd, {
        once: true,
      });
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    console.log("터치 움직임");
    if (startPosition) {
      const touch = e.touches[0];
      console.log(startPosition.x);
      const deltaX = touch.clientX - 60;
      const deltaY = touch.clientY - startPosition.y;
      setTranslate({
        x: touch.clientX - startPosition.x,
        y: touch.clientY - startPosition.y,
      });

      if (tagRef.current) {
        tagRef.current.style.zIndex = "999999";
        tagRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        tagRef.current.style.position = "absolute";
        tagRef.current.style.touchAction = "none";
      }

      if (e.cancelable) {
        e.preventDefault();
      }
    }
  };

  const handleTouchEnd = () => {
    if (tagType === "letter") {
      handleHoldEnd();
    }

    console.log("터치 끝");

    if (planetRef && tagRef.current && tagType === "orbit") {
      const parentRect = planetRef.getBoundingClientRect();
      const tagRect = tagRef.current.getBoundingClientRect();
      const isAtLeast80pxAboveBottom = tagRect.bottom <= parentRect.bottom - 80;

      const isWithinBounds =
        tagRect.left >= parentRect.left &&
        tagRect.right <= parentRect.right &&
        tagRect.top >= parentRect.top &&
        tagRect.bottom <= parentRect.bottom;

      if (
        isWithinBounds &&
        isAtLeast80pxAboveBottom &&
        onTouchEnd &&
        onDragEnd &&
        tagId &&
        name
      ) {
        // 태그가 부모 영역 내에 있고, 밑에서 100px 이상 떨어져 있을 때
        console.log("드래그한 태그가 영역 내에 있습니다.");
        onDragEnd({
          letterId: tagId,
          senderName: name,
        });
        onTouchEnd({
          letterId: tagId,
          senderName: name,
        });
      } else if (!isAtLeast80pxAboveBottom) {
        // 태그가 부모 영역 밑에서 100px 이내에 있을 때
        console.log(
          "태그가 부모 영역의 밑에서 100px 이내에 있습니다. 이벤트를 취소합니다."
        );
      } else {
        console.log("드래그한 태그가 영역 내에 없습니다.");
      }
    }

    resetTag();
  };

  const resetTag = () => {
    if (tagRef.current) {
      tagRef.current.style.transform = "";
      tagRef.current.style.zIndex = "";
      tagRef.current.style.position = "relative";
    }

    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", handleTouchEnd);
  };

  //   useEffect(() => {
  //     console.log(translate);
  //   }, [translate]);

  //   useEffect(() => {
  //     if (tagType === "letter") console.log(isHoldTriggered);
  //   }, [isHoldTriggered]);

  const handleBoxClick = () => {
    if (!isDeleteMode && onClick) {
      onClick();
    }
  };

  return (
    <Box
      $tagType={tagType}
      $hasName={!!name}
      $hasEditIcon={icon === "edit"}
      {...(orbitType ? { $orbitType: orbitType } : {})}
      onClick={onHold ? handleHoldEnd : handleBoxClick}
      ref={(el) => {
        tagRef.current = el;
        if (innerRef) innerRef(el);
      }}
      draggable={isDragable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onMouseDown={handleHoldStart}
      onMouseUp={handleHoldEnd}
      onTouchStart={handleTouchStart}
    >
      {isEditing ? (
        <NameInput
          type="text"
          value={editedName}
          onChange={handleNameChange}
          onBlur={handleBlur}
          textLength={editedName?.length || 0} // 텍스트 길이 전달
          autoFocus
        />
      ) : orbitType && receivedDate && orbitType === "2" ? (
        <OrbitContainer>
          <Name>{name}</Name>
          <Date>{formatDate(receivedDate)}</Date>
        </OrbitContainer>
      ) : (
        <Name>{name}</Name>
      )}
      {tagType === "orbit" && isNew && !isDeleteMode && <Circle />}
      {tagType === "orbit" && isDeleteMode && (
        <DeleteIcon
          src="/assets/icons/ic_delete_mode.svg"
          width={20}
          height={20}
          alt="삭제"
          onClick={handleDeleteOrbit}
        />
      )}
      {tagType === "planet" && (
        <Image
          src={renderIcon()}
          width={24}
          height={24}
          alt="planet"
          onClick={handleEditClick}
        />
      )}
    </Box>
  );
};

export default Tag;

const Box = styled.div<{
  $tagType: tagType;
  $hasName?: boolean;
  $hasEditIcon?: boolean;
  $orbitType?: string;
}>`
  width: auto;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 100px;
  color: ${theme.colors.white};
  white-space: nowrap;
  cursor: pointer;
  z-index: 10;

  ${({ $tagType }) =>
    $tagType === "orbit" &&
    css`
      height: 34px;
      padding: 6px 23px;
      border-radius: 100px;
      background: ${theme.colors.gray700};
      position: relative;
      ${(props) => props.theme.fonts.body09};
    `}

  ${({ $tagType, $hasName, $hasEditIcon }) =>
    $tagType === "planet" &&
    css`
      height: 37px;
      padding: 7.5px 4px 7.5px 16px;
      border-radius: 8px;
      background: ${theme.colors.gray800};
      ${(props) => props.theme.fonts.body08};
      display: flex;
      ${
        $hasEditIcon &&
        css`
        height: 47px;
        padding: 9px 18px;
        border-radius: 200px;
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(2px);
        ${(props) => props.theme.fonts.title01};
        gap: 4px;
      `
      }
      ${
        $hasName === false &&
        css`
        padding: 7.5px 13px 7.5px 13px;
      `
      }
    `}
  
    ${({ $tagType, $orbitType }) =>
      $tagType === "letter" &&
      css`
      display: block;
      max-width: 90px;
      padding: ${$orbitType === "2" ? "10px" : "11px 15px"};
      border-radius: 100px;
      background: ${theme.colors.sub01};
      ${(props) => props.theme.fonts.body07};
      line-height: 16px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: center;
      vertical-align: middle;
      -webkit-user-select: all;
      -moz-user-select: all;
      -ms-use-select: all;
      user-select: all;

      &:active {
        background: #565c81;
      }
    `}
`;

const NameInput = styled.input<{ textLength: number }>`
  width: ${({ textLength }) => Math.max(20, textLength * 14 + 10)}px;
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.title01};
  background-color: transparent;

  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-use-select: none;
  user-select: none;
`;

const OrbitContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Name = styled.span`
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-use-select: none;
  user-select: none;
`;

const Date = styled.span`
  color: ${theme.colors.gray300};
  ${(props) => props.theme.fonts.caption03};
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-use-select: none;
  user-select: none;
`;

const Circle = styled.div`
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: ${theme.colors.sub03};
  position: absolute;
  top: -4px;
  right: 2px;
`;

const DeleteIcon = styled(Image)`
  position: absolute;
  top: -4px;
  right: -2px;
`;
