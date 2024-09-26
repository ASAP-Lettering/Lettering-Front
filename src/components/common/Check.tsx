import { theme } from "@/styles/theme";
import Image from "next/image";
import React, { ReactNode } from "react";
import styled from "styled-components";

type checkType = "box" | "default" | "round" | "large";

interface CheckProps {
  checkType: checkType;
  label?: string;
  sublabel?: string;
  text?: string;
  checked: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children?: ReactNode;
}
const Check = (props: CheckProps) => {
  const { checkType, label, checked, onChange, children, sublabel } = props;

  const renderSvg = () => {
    let filename = "";
    if (checkType === "box" || "large") {
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
        <LabelText>
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
  width:  ${(props) => (props.$checkType === "large" ? "32px" : "100%")};
  display: flex;
  align-items: center;
  position: relative;
`;

const CheckInput = styled.input<{ $checkType: checkType; $label: boolean }>`
  appearance: none;
  flex-shrink: 0;
  width: ${({ $checkType }) => ($checkType ? "24px" : "32px")};
  height: ${({ $checkType }) => ($checkType ? "24px" : "32px")};
  margin-right: ${({ $label }) => ($label ? "17px" : "0px")};
  border-radius: 4px;
  background-color: ${(props) =>
    props.$checkType === "box" || "large"
      ? props.checked
        ? theme.colors.main01
        : theme.colors.gray500
      : "transparent"};
  position: relative;
`;

const StyledImage = styled(Image)<{ $checkType: checkType }>`
  position: absolute;
  top: ${({ $checkType }) => ($checkType ? "2px" : "6px")};
  left: ${({ $checkType }) => ($checkType ? "2px" : "6px")};
  pointer-events: none;
  z-index: 10;
`;

const LabelText = styled.span`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  ${(props) => props.theme.fonts.body07};
  color: ${theme.colors.white};
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
