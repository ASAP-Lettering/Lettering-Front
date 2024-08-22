import React from "react";
import styled from "styled-components";
import { theme } from "@/styles/theme";

type buttonType = "primary" | "secondary";
type sizeType = "small" | "medium" | "large";

interface ButtonProps {
  buttonType?: buttonType;
  size?: sizeType;
  width?: string;
  text: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

const Button = (props: ButtonProps) => {
  const { buttonType, size = "large", width, text, onClick, disabled } = props;

  let buttonClassName = buttonType;
  if (size) {
    buttonClassName += " ${size}";
  }

  return (
    <StyledButton
      className={buttonType}
      onClick={onClick}
      disabled={disabled}
      width={width}
    >
      {text}
    </StyledButton>
  );
};

export default Button;

const StyledButton = styled.button<{ width?: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${({ width }) => width || "100%"};
  padding: 18px;
  border-radius: 12px;
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.semiBold16};
  white-space: nowrap;
  transition: color 200ms, background-color 200ms;

  &:disabled {
    background: ${theme.colors.gray100};
  }

  /*buttonType*/
  &.primary {
    background: ${theme.colors.main01};
    &:disabled {
      background: ${theme.colors.gray100};
    }
    &:hover {
      background: ${theme.colors.sub01};
    }
    &:active {
      background: ${theme.colors.sub01};
    }
  }

  &.secondary {
    background: ${theme.colors.gray500};
    &:disabled {
      background: ${theme.colors.gray100};
    }
    &:hover {
      background: ${theme.colors.gray700};
    }
    &:active {
      background: ${theme.colors.gray700};
    }
  }

  /*size*/
  &.medium {
    width: ${({ width }) => width || "243px"};
  }

  &.small {
    width: ${({ width }) => width || "243px"};
  }
`;
