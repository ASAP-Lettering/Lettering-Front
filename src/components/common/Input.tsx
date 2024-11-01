import { theme } from "@/styles/theme";
import React, { ReactNode, useEffect } from "react";
import styled, { css } from "styled-components";

type inputType = "underline" | "boxText" | "boxTextArea" | "signup";

interface InputProps {
  inputType?: inputType;
  value: string;
  label?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readonly?: boolean;
  disabled?: boolean;
  height?: string;
  isValid?: boolean;
  isValidChange?: (vaild: boolean) => void;
  errorMessage?: string;
  icon?: ReactNode;
  onIconClick?: () => void;
}

function isValidKoreanInput(input: string): boolean {
  const completeSyllable = /[\uAC00-\uD7A3]/;
  const loneConsonants =
    /[\u1100-\u115F\uA960-\uA97F\u3131-\u314E\u3165-\u3186]/;
  const loneVowels = /[\u1160-\u11A7\uD7B0-\uD7C6\u314F-\u3163\u3187-\u318E]/;

  if (input.length === 0) {
    return true;
  }

  if (loneConsonants.test(input) || loneVowels.test(input)) {
    return false;
  }

  if (completeSyllable.test(input)) {
    return true;
  }

  return false;
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
    isValid = true,
    isValidChange = (isVaild: boolean) => {},
    errorMessage,
    icon,
    onIconClick,
  } = props;

  const regex = /[^a-zA-Z0-9\u1100-\u11FF\u3131-\u318E\uAC00-\uD7AF\s]/g; // 특수문자
  const handleChange = (event: any) => {
    const newValue = event.target.value;
    isValidChange(isValidKoreanInput(newValue));

    if (inputType === "signup") {
      onChange(newValue.replace(regex, "")); // 특수문자입력불가
    }
    onChange(newValue);
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
        <InputWrapper>
          <StyledInput
            $inputType={inputType}
            $isVaild={isValid}
            type={"text"}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            readOnly={readonly}
            disabled={disabled}
          />
          {icon && (
            <IconWrapper onClick={onIconClick} clickable={!!onIconClick}>
              {icon}
            </IconWrapper>
          )}
        </InputWrapper>
      )}
      {!isValid && <ValidationMessage>{errorMessage}</ValidationMessage>}
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
  ${(props) => props.theme.fonts.button01};
`;

const sharedStyles = `
  width: 100%;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  border-radius: 8px;
  background: ${theme.colors.gray800};
  color: ${theme.colors.white};
  ${(props: any) => props.theme.fonts.body07};
  font-family: "Pretendard";

  &::placeholder {
    color: ${theme.colors.gray500};
    ${(props: any) => props.theme.fonts.body07};
  }

  &:disabled {
    border: none;
    color: ${theme.colors.gray400};
  }
`;

const StyledInput = styled.input<{ $inputType: inputType; $isVaild: boolean }>`
  ${sharedStyles}
  height: 52px;
  padding: 12px 20px;
  ${({ $inputType }) =>
    ($inputType === "underline" || $inputType === "signup") &&
    css`
      padding: 16px 0px;
      border-radius: 0px;
      border: none;
      border-bottom: 1px solid ${theme.colors.gray600};
      background: none;
      ${(props: any) => props.theme.fonts.body01};

      &::placeholder {
        ${(props: any) => props.theme.fonts.body01};
      }
    `}
  ${({ $isVaild }) =>
    !$isVaild &&
    css`
      border-bottom: 1px solid ${theme.colors.red};
    `}
`;

const StyledTextarea = styled.textarea<{
  $inputType: inputType;
  $height: string;
}>`
  ${sharedStyles}
  height: ${({ $height }) => $height};
  ${(props: any) => props.theme.fonts.body07};

  &::placeholder {
    ${(props: any) => props.theme.fonts.body07};
    letter-spacing: 1px;
  }

  &::-webkit-scrollbar {
    width: 23px;
    height: 100px;
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    width: 6px;
    border-radius: 26px;
    background: ${theme.colors.gray500};
    background-clip: padding-box;
    border: 8px solid transparent;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

const ValidationMessage = styled.div`
  color: ${theme.colors.red};
  ${(props) => props.theme.fonts.body08};
  margin-top: -8px;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
`;

const IconWrapper = styled.div<{ clickable: boolean }>`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  cursor: ${({ clickable }) =>
    clickable
      ? "pointer"
      : "default"}; /* Only show pointer cursor if clickable */
`;
