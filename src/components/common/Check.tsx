import { theme } from "@/styles/theme";
import Image from "next/image";
import React, { ReactNode } from "react";
import styled from "styled-components";

type checkType = "box" | "default" | "round" | "large";

interface CheckProps {
  checkType: checkType;
  label?: string;
  labelFont?: string;
  sublabel?: string;
  text?: string;
  textType?: string;
  checked: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children?: ReactNode;
}
const Check = (props: CheckProps) => {
  const {
    checkType,
    label,
    checked,
    onChange,
    children,
    sublabel,
    labelFont = "body07",
  } = props;

  const renderSvg = () => {
    let filename = "";
    if (checkType === "box" || checkType === "large") {
      filename = "ic_checkbox";
    } else if (checkType === "default") {
      filename = checked ? "ic_check" : "ic_check_not";
    } else if (checkType === "round") {
      filename = checked ? "ic_check_circle" : "ic_check_circle_not";
    }

    return (
      <StyledImage
        src={`/assets/icons/${filename}.svg`}
        width={checkType === "round" ? 24 : 20}
        height={checkType === "round" ? 24 : 20}
        alt="check"
        $checkType={checkType}
      />
    );
  };

  return (
    <CheckContainer $checkType={checkType}>
      <CheckInput
        type="checkbox"
        checked={checked}
        onChange={onChange}
        $checkType={checkType}
        $label={!!label}
      />
      {renderSvg()}
      {label && (
        <LabelText $labelFont={labelFont}>
          {label}
          {children}
          {sublabel && <LabelSubText>{sublabel}</LabelSubText>}
        </LabelText>
      )}
    </CheckContainer>
  );
};

export default Check;

const CheckContainer = styled.label<{ $checkType: checkType }>`
  width: ${(props) => (props.$checkType === "large" ? "32px" : "100%")};
  display: flex;
  align-items: center;
  position: relative;
`;

const CheckInput = styled.input<{ $checkType: checkType; $label: boolean }>`
  appearance: none;
  flex-shrink: 0;
  width: ${({ $checkType }) => ($checkType !== "large" ? "24px" : "32px")};
  height: ${({ $checkType }) => ($checkType !== "large" ? "24px" : "32px")};
  margin-right: ${({ $label }) => ($label ? "17px" : "0px")};
  border-radius: 4px;
  background-color: ${(props) =>
    props.$checkType === "box" || props.$checkType === "large"
      ? props.checked
        ? theme.colors.main01
        : theme.colors.gray500
      : "transparent"};
  position: relative;
  display: flex;

  @media (max-height: 628px) {
    width: ${({ $checkType }) => ($checkType !== "large" ? "22px" : "25px")};
    height: ${({ $checkType }) => ($checkType !== "large" ? "22px" : "25px")};
  }
`;

const StyledImage = styled(Image)<{ $checkType: checkType }>`
  position: absolute;
  top: ${({ $checkType }) => ($checkType !== "large" ? "2px" : "6px")};
  left: ${({ $checkType }) => ($checkType !== "large" ? "2px" : "6px")};
  pointer-events: none;
  z-index: 10;

  @media (max-height: 628px) {
    top: ${({ $checkType }) => ($checkType !== "large" ? "1px" : "3px")};
    left: ${({ $checkType }) => ($checkType !== "large" ? "1px" : "3px")};
  }
`;

const LabelText = styled.span<{ $labelFont: string }>`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  ${(props) => props.theme.fonts[props.$labelFont]};
  color: ${(props) => props.theme.colors.white};
  white-space: nowrap;
`;

const LabelSubText = styled.span`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  ${(props) => props.theme.fonts.regular14};
  color: ${theme.colors.gray400};
  white-space: nowrap;
`;
