import { fadeIn, fadeOut } from "@/styles/GlobalStyles";
import { theme } from "@/styles/theme";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";

interface ToastProps {
  text: string;
  icon: boolean;
  top?: string;
  left?: string;
}

const Toast = (props: ToastProps) => {
  const { text, icon, top = "0px", left = "50%" } = props;

  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Container $icon={icon} $visible={visible} $top={top} $left={left}>
      {icon && (
        <Image
          src="/assets/icons/ic_info.svg"
          width={28}
          height={28}
          alt="info"
        />
      )}
      {text}
    </Container>
  );
};

export default Toast;

const Container = styled.div<{
  $icon: boolean;
  $visible: boolean;
  $top: string;
  $left: string;
}>`
  width: calc(100% - 50px);
  padding: 11px 30px;
  display: flex;
  justify-content: ${({ $icon }) => ($icon ? "flex-start" : "center")};
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
  border-radius: 16px;
  background: rgba(62, 65, 81, 0.7);
  backdrop-filter: blur(4px);
  color: ${theme.colors.white};
  position: absolute;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
  transform: translateX(-50%);
  ${(props) => props.theme.fonts.body08};
  animation: ${(props) =>
    props.$visible
      ? css`
          ${fadeIn} 0.5s ease-in-out
        `
      : css`
          ${fadeOut} 0.5s ease-in-out
        `};
`;
