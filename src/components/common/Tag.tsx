import { theme } from "@/styles/theme";
import Image from "next/image";
import React from "react";
import styled, { css } from "styled-components";

type tagType = "orbit" | "planet" | "letter";
type iconType = "chevron" | "edit" | "plus";

interface TagProps {
  tagType: tagType;
  name?: string;
  read?: boolean;
  icon?: iconType;
}

const Tag = (props: TagProps) => {
  const { tagType, name, read, icon } = props;

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
    <Box $tagType={tagType} $hasName={!!name} $hasEditIcon={icon === "edit"}>
      {name}
      {tagType === "orbit" && !read && <Circle />}
      {tagType === "planet" && (
        <Image src={renderIcon()} width={24} height={24} alt="planet" />
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
      ${(props) => props.theme.fonts.regular14};
    `}

  ${({ $tagType, $hasName, $hasEditIcon }) =>
    $tagType === "planet" &&
    css`
      height: 37px;
      padding: 7.5px 4px 7.5px 16px;
      border-radius: 8px;
      background: ${theme.colors.gray800};
      ${(props) => props.theme.fonts.medium14};
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
      ${(props) => props.theme.fonts.regular16};

      &:active {
        background: #565c81;
      }
    `}
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
