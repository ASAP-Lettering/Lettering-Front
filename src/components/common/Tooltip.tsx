import { fadeIn, fadeOut } from "@/styles/GlobalStyles";
import { theme } from "@/styles/theme";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";

interface ToolTipProps {
  message: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  padding?: string;
  close?: boolean;
  onClose?: () => void;
}

const Tooltip = (props: ToolTipProps) => {
  const { message, top, bottom, left, right, padding, close, onClose } = props;

  const [isVisible, setIsVisible] = useState(false); // 애니메이션용
  const [shouldRender, setShouldRender] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      setShouldRender(false);
      if (onClose) {
        onClose();
      }
    }, 500);
  };

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 1000);
  }, []);

  const [firstLine, secondLine] = message.split("\n");

  return (
    shouldRender && (
      <TooltipContainer
        $isVisible={isVisible}
        $top={top}
        $bottom={bottom}
        $left={left}
        $right={right}
        $padding={padding}
      >
        <Message>
          <span>{firstLine}</span>
          {secondLine && <span className="second-line">{secondLine}</span>}
        </Message>
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
    )
  );
};

export default Tooltip;

const TooltipContainer = styled.div<{
  $isVisible: boolean;
  $top?: string;
  $bottom?: string;
  $left?: string;
  $right?: string;
  $padding?: string;
}>`
  max-width: calc(100% - 50px);
  min-width: 280px;
  width: auto;
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
  transition: opacity 0.5s ease-in-out, visibility 0.5s ease-in-out;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  visibility: ${({ $isVisible }) => ($isVisible ? "visible" : "hidden")};

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
  display: inline;
  white-space: nowrap;

  span {
    display: inline;
  }

  .second-line {
    display: inline;
  }

  @media (max-width: 380px) {
    white-space: normal;

    .second-line {
      display: block; /* 공간이 부족할 때 줄바꿈 */
    }
  }
`;

const CloseButton = styled.button`
  width: 16px;
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
