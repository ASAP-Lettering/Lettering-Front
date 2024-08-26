import { theme } from "@/styles/theme";
import Image from "next/image";
import React from "react";
import styled, { css } from "styled-components";

type tagType = "orbit" | "planet" | "letter";
type iconType = "chevron" | "edit";

interface TagProps {
  tagType: tagType;
  name: string;
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
    }
    return "";
  };

  return (
    <Box $tagType={tagType} $hasEditIcon={icon === "edit"}>
      {name}
      {tagType === "orbit" && !read && <Circle />}
      {tagType === "planet" && (
        <Image src={renderIcon()} width={24} height={24} alt="planet" />
      )}
    </Box>
  );
};

export default Tag;

const Box = styled.button<{ $tagType: tagType; $hasEditIcon?: boolean }>`
  width: fit-content;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 100px;
  color: ${theme.colors.white};

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

  ${({ $tagType, $hasEditIcon }) =>
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
        gap: 4px;
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
