import React from "react";
import styled, { css } from "styled-components";
import { theme } from "@/styles/theme";

type buttonType = "primary" | "secondary";
type sizeType = "small" | "medium" | "large" | "default";

interface ButtonProps {
  buttonType: buttonType;
  size?: sizeType;
  width?: string;
  text: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

const Button = (props: ButtonProps) => {
  const {
    buttonType = "primary",
    size = "large",
    width,
    text,
    onClick,
    disabled,
  } = props;

  return (
    <StyledButton
      $buttonType={buttonType}
      $size={size}
      onClick={onClick}
      disabled={disabled}
      $width={width}
    >
      {text}
    </StyledButton>
  );
};

export default Button;

const StyledButton = styled.button<{
  $buttonType: buttonType;
  $size: sizeType;
  $width?: string;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${({ $width, $size }) =>
    $width ||
    ($size === "small"
      ? "128px"
      : $size === "medium"
      ? "243px"
      : $size === "default"
      ? "90px"
      : "100%")};
  padding: 18px;
  border-radius: 12px;
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.button01};
  transition: color 200ms, opacity 300ms;

  ${({ $size }) =>
    $size === "small" &&
    css`
      height: 44px;
    `}

  &:disabled {
    background: ${theme.colors.gray500};
  }

  /*buttonType*/
  background-color: ${({ $buttonType }) =>
    $buttonType === "primary" ? theme.colors.main01 : theme.colors.gray500};

  &:active {
    opacity: 0.8;
    transition: opacity 500ms;
  }
`;
