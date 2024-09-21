import { toastState } from "@/recoil/toastStore";
import { fadeIn, fadeOut } from "@/styles/GlobalStyles";
import { theme } from "@/styles/theme";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import styled, { css } from "styled-components";

interface ToastProps {
  text: string;
  icon: boolean;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  padding?: string;
  close?: boolean;
  onClose?: () => void;
}

const Toast = (props: ToastProps) => {
  const { text, icon, top, bottom, left, right, padding, close, onClose } =
    props;
  const setToast = useSetRecoilState(toastState);

  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Container
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
          src="/assets/icons/ic_info.svg"
          width={28}
          height={28}
          alt="info"
        />
      )}
      <Text>
        {text}
        {close && (
          <Image
            src="/assets/icons/ic_close.svg"
            width={16}
            height={16}
            alt="close"
            onClick={() => {
              onClose || setToast({ show: false, message: "", close: false });
            }}
          />
        )}
      </Text>
    </Container>
  );
};

export default Toast;

const Container = styled.div<{
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
  ${(props) => props.theme.fonts.caption01};
  animation: ${(props) =>
    props.$visible
      ? css`
          ${fadeIn} 0.5s ease-in-out
        `
      : css`
          ${fadeOut} 0.5s ease-in-out
        `};
`;

const Text = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
`;
