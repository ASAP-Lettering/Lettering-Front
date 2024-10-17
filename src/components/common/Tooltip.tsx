import { fadeIn, fadeOut } from "@/styles/GlobalStyles";
import { theme } from "@/styles/theme";
import Image from "next/image";
import React, { useState } from "react";
import styled, { css } from "styled-components";

interface ToastProps {
  message: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  padding?: string;
  close?: boolean;
  onClose?: () => void;
}

const Tooltip = (props: ToastProps) => {
  const { message, top, bottom, left, right, padding, close, onClose } = props;

  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    if (onClose) {
      onClose();
      setVisible(false);
    }
  };

  return (
    <TooltipContainer
      $visible={visible}
      $top={top}
      $bottom={bottom}
      $left={left}
      $right={right}
      $padding={padding}
    >
      <Message>{message}</Message>
      {close && (
        <CloseButton onClick={handleClose}>
          <Image
            src="/assets/icons/ic_close.svg"
            width={16}
            height={16}
            alt="close"
          />
        </CloseButton>
      )}
    </TooltipContainer>
  );
};

export default Tooltip;

const TooltipContainer = styled.div<{
  $visible: boolean;
  $top?: string;
  $bottom?: string;
  $left?: string;
  $right?: string;
  $padding?: string;
}>`
  width: calc(100% - 50px);
  height: 46px;
  padding: ${({ $padding }) => ($padding ? $padding : "8px 14px")};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2px;
  border-radius: 4px;
  background: rgba(62, 65, 81, 0.7);
  backdrop-filter: blur(4px);
  color: ${theme.colors.white};
  z-index: 1000;
  position: absolute;
  top: ${({ $top }) => $top};
  bottom: ${({ $bottom }) => $bottom};
  left: ${({ $left }) => ($left ? $left : "50%")};
  right: ${({ $right }) => $right};
  transform: translateX(-50%);
  ${theme.fonts.caption01};
  animation: ${(props) =>
    props.$visible
      ? css`
          ${fadeIn} 0.5s ease-in-out
        `
      : css`
          ${fadeOut} 0.5s ease-in-out
        `};

  &:after {
    content: "";
    position: absolute;
    bottom: -11px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-width: 11px 7px 0;
    border-style: solid;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-top: 12px solid rgba(62, 65, 81, 0.7);
  }
`;

const Message = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
`;

const CloseButton = styled.button`
  width: 16px;
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
