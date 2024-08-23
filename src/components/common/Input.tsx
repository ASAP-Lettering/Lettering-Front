import { theme } from "@/styles/theme";
import React from "react";
import styled, { css } from "styled-components";

type inputType = "underline" | "boxText" | "boxTextArea";

interface InputProps {
  inputType?: inputType;
  value: string;
  label?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readonly?: boolean;
  disabled?: boolean;
  height?: string;
}

const Input = (props: InputProps) => {
  const {
    inputType = "boxText",
    value,
    label,
    onChange,
    placeholder,
    readonly = false,
    disabled = false,
    height,
  } = props;

  const handleChange = (event: any) => {
    onChange(event.target.value);
  };

  const isTextarea = inputType === "boxTextArea";

  return (
    <Container>
      {label && <Label>{label}</Label>}
      {isTextarea ? (
        <StyledTextarea
          $inputType={inputType}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          readOnly={readonly}
          disabled={disabled}
          $height={height || "auto"}
        />
      ) : (
        <StyledInput
          $inputType={inputType}
          type={"text"}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          readOnly={readonly}
          disabled={disabled}
        />
      )}
    </Container>
  );
};

export default Input;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Label = styled.label`
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.semiBold16};
`;

const sharedStyles = `
  width: 100%;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  border-radius: 8px;
  background: ${theme.colors.gray800};
  color: ${theme.colors.white};
  ${(props: any) => props.theme.fonts.medium14};

  &::placeholder {
    color: ${theme.colors.gray500};
    ${(props: any) => props.theme.fonts.regular14};
  }

  &:disabled {
    border: none;
    color: ${theme.colors.b400};
    background: ${theme.colors.gray100};
  }
`;

const StyledInput = styled.input<{ $inputType: inputType }>`
  ${sharedStyles}
  height: 52px;
  padding: 12px 20px;
  ${({ $inputType }) =>
    $inputType === "underline" &&
    css`
      padding: 16px 0px;
      border-radius: 0px;
      border: none;
      border-bottom: 1px solid ${theme.colors.gray600};
      background: none;
      ${(props: any) => props.theme.fonts.medium24};

      &::placeholder {
        ${(props: any) => props.theme.fonts.medium24};
      }
    `}
`;

const StyledTextarea = styled.textarea<{
  $inputType: inputType;
  $height: string;
}>`
  ${sharedStyles}
  height: ${({ $height }) => $height};
  font-family: "Pretendard";
  ${(props: any) => props.theme.fonts.medium14};

  &::placeholder {
    ${(props: any) => props.theme.fonts.regular14};
    letter-spacing: 1px;
  }
`;
