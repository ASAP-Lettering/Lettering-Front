import { toastState } from "@/recoil/toastStore";
import { fadeIn, fadeOut } from "@/styles/GlobalStyles";
import { theme } from "@/styles/theme";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import styled, { css } from "styled-components";

interface ToastProps {
  message: string;
  icon: boolean;
  iconType: "info" | "message";
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  padding?: string;
  close?: boolean;
  onClose?: () => void;
  duration?: number;
}

const Toast = (props: ToastProps) => {
  const {
    message,
    icon,
    iconType,
    top,
    bottom,
    left,
    right,
    padding,
    close,
    onClose,
    duration = 3000,
  } = props;
  const setToast = useSetRecoilState(toastState);

  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setVisible(false);
    setToast((prev) => ({
      ...prev,
      show: false,
      message: "",
      icon: false,
      close: false,
      top: prev.top || "",
      bottom: prev.bottom || "",
      left: prev.left || "",
      right: prev.right || "",
      padding: prev.padding || "",
    }));
    if (onClose) onClose();
  };

  return (
    <ToastContainer
      $icon={icon}
      $visible={visible}
      $top={top}
      $bottom={bottom}
      $left={left}
      $right={right}
      $padding={padding}
    >
      {icon && (
        <Image
          src={`/assets/icons/ic_${
            iconType === "info" ? "info" : "message"
          }.svg`}
          width={28}
          height={28}
          alt={iconType === "info" ? "info" : "message"}
        />
      )}
      <Message>
        {message}
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
      </Message>
    </ToastContainer>
  );
};

export default Toast;

const ToastContainer = styled.div<{
  $icon: boolean;
  $visible: boolean;
  $top?: string;
  $bottom?: string;
  $left?: string;
  $right?: string;
  $padding?: string;
}>`
  width: calc(100% - 50px);
  max-width: 343px;
  padding: ${({ $padding }) => ($padding ? $padding : "11px 30px")};
  display: flex;
  justify-content: ${({ $icon }) => ($icon ? "flex-start" : "center")};
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
  border-radius: 16px;
  background: rgba(62, 65, 81, 0.7);
  backdrop-filter: blur(4px);
  color: ${theme.colors.white};
  z-index: 1000;
  position: absolute;
  top: ${({ $top }) => $top};
  bottom: ${({ $bottom }) => $bottom};
  left: ${({ $left }) => $left};
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
