import { theme } from "@/styles/theme";
import Image from "next/image";
import React, { useRef, useState } from "react";
import {
  DraggableProvidedDraggableProps,
  DraggableProvidedDragHandleProps,
} from "react-beautiful-dnd";
import styled, { css } from "styled-components";

type tagType = "orbit" | "planet" | "letter";
type iconType = "chevron" | "edit" | "plus";

interface TagProps {
  tagType: tagType;
  name?: string;
  read?: boolean;
  icon?: iconType;
  onClick?: () => void;
  onEdit?: (editedName: string) => void;
  onHold?: () => void;
  innerRef?: (element: HTMLElement | null) => void;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
  draggableProps?: DraggableProvidedDraggableProps | null;
}

const Tag = (props: TagProps) => {
  const {
    tagType,
    name,
    read,
    icon,
    onClick,
    onEdit,
    onHold,
    innerRef,
    dragHandleProps,
    draggableProps,
  } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [isHoldTriggered, setIsHoldTriggered] = useState<boolean>(false);
  const holdTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleEditClick = () => {
    if (icon === "edit") {
      setIsEditing(true);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(e.target.value);
  };

  const handleBlur = () => {
    if (onEdit && editedName) {
      onEdit(editedName);
    }
    setIsEditing(false);
  };

  const handleHoldStart = () => {
    setIsHoldTriggered(true);
    if (onHold) {
      holdTimeout.current = setTimeout(() => {
        onHold();
      }, 1000);
    }
  };

  const handleHoldEnd = () => {
    if (isHoldTriggered && holdTimeout.current) {
      clearTimeout(holdTimeout.current);
      setIsHoldTriggered(false);
    }
    if (!isHoldTriggered && onClick) {
      onClick();
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

  return (
    <Box
      $tagType={tagType}
      $hasName={!!name}
      $hasEditIcon={icon === "edit"}
      onClick={onHold ? handleHoldEnd : onClick}
      onMouseDown={handleHoldStart} // 마우스를 누를 때
      onMouseUp={handleHoldEnd} // 마우스를 뗄 때
      onTouchStart={handleHoldStart} // 터치 시작
      onTouchEnd={handleHoldEnd} // 터치 종료
      ref={innerRef}
      {...draggableProps}
      {...dragHandleProps}
    >
      {isEditing ? (
        <NameInput
          type="text"
          value={editedName}
          onChange={handleNameChange}
          onBlur={handleBlur}
          autoFocus
        />
      ) : (
        name
      )}
      {tagType === "orbit" && !read && <Circle />}
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

const Box = styled.button<{
  $tagType: tagType;
  $hasName?: boolean;
  $hasEditIcon?: boolean;
}>`
  width: fit-content;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 100px;
  color: ${theme.colors.white};
  white-space: nowrap;

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
      ${$hasEditIcon &&
      css`
        height: 47px;
        padding: 9px 18px;
        border-radius: 200px;
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(2px);
        ${(props) => props.theme.fonts.title01};
        gap: 4px;
      `}
      ${$hasName === false &&
      css`
        padding: 7.5px 13px 7.5px 13px;
      `}
    `}
  
  ${({ $tagType }) =>
    $tagType === "letter" &&
    css`
      height: 39px;
      padding: 11px 26px;
      border-radius: 100px;
      background: ${theme.colors.sub01};
      ${(props) => props.theme.fonts.body07};

      &:active {
        background: #565c81;
      }
    `}
`;

const NameInput = styled.input`
  width: calc(100% + 128px);
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.title01};
  background-color: transparent;
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
