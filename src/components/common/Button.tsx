import React from "react";
import styled, { css } from "styled-components";
import { theme } from "@/styles/theme";

type buttonType = "primary" | "secondary";
type sizeType = "small" | "medium" | "large" | "default";

interface ButtonProps {
  buttonType: buttonType;
  size?: sizeType;
  width?: string;
  height?: string;
  text?: string;
  backgroundColor?: string;
  children?: React.ReactNode;
  icon?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

const Button = (props: ButtonProps) => {
  const {
    buttonType = "primary",
    size = "large",
    width,
    height,
    text,
    backgroundColor,
    children,
    onClick,
    icon = false,
    disabled,
  } = props;

  return (
    <StyledButton
      $buttonType={buttonType}
      $size={size}
      onClick={onClick}
      disabled={disabled}
      $width={width}
      $height={height}
      $backgroundColor={backgroundColor}
    >
      {icon && <img src="/assets/icons/ic_letter.svg" />}
      {children}
      {text}
    </StyledButton>
  );
};

export default Button;

const StyledButton = styled.button<{
  $buttonType: buttonType;
  $size: sizeType;
  $width?: string;
  $height?: string;
  $backgroundColor?: string;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: ${({ $width, $size }) =>
    $width ||
    ($size === "small"
      ? "128px"
      : $size === "medium"
      ? "243px"
      : $size === "default"
      ? "90px"
      : "100%")};
  height: ${({ $height }) => $height || "auto"};
  padding: 18px;
  border-radius: 12px;
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.button01};
  transition: color 200ms, opacity 300ms;
  user-select: none;
  white-space: nowrap;

  ${({ $size }) =>
    $size === "small" &&
    css`
      height: 44px;
    `}

  &:disabled {
    opacity: 0.6;
  }

  /*buttonType*/
  background-color: ${({ $buttonType, $backgroundColor }) =>
    $backgroundColor
      ? $backgroundColor
      : $buttonType === "primary"
      ? theme.colors.main01
      : theme.colors.gray600};

  &:active {
    opacity: 0.8;
    transition: opacity 500ms;
  }

  @media (max-height: 628px) {
    ${theme.fonts.button02};
    height: 45px;
    border-radius: 9px;
  }
`;
