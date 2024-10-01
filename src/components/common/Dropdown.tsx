import React, { useState } from "react";
import styled from "styled-components";
import { theme } from "@/styles/theme";

interface DropdownProps {
  label?: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <Container>
      {label && <Label>{label}</Label>}
      <DropdownButton
        onClick={handleToggle}
        placeholder={placeholder}
        value={value}
      >
        {value || placeholder}

        <Icon src="/assets/icons/ic_arrow_down.svg" alt="Dropdown Icon" />
      </DropdownButton>
      {isOpen && (
        <OptionsContainer>
          {options.map((option) => (
            <Option key={option} onClick={() => handleSelect(option)}>
              {option}
            </Option>
          ))}
        </OptionsContainer>
      )}
    </Container>
  );
};

export default Dropdown;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
`;

const Label = styled.label`
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.button01};
  margin-bottom: 8px;
`;

const DropdownButton = styled.button<{ placeholder?: string }>`
  width: 100%;
  padding: 15px 20px;
  border: none;
  border-radius: 8px;
  background: ${theme.colors.gray800};
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.body08};
  text-align: left;
  cursor: pointer;
  position: relative;

  &::placeholder {
    color: ${theme.colors.gray500};
  }

  &:focus {
    outline: none;
  }
`;

const Icon = styled.img`
  position: absolute;
  right: 20px; 
  top: 50%;
  transform: translateY(-50%);
`;

const OptionsContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 300px;
  overflow-y: auto;
  background: ${theme.colors.gray800};
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000; 
`;

const Option = styled.div`
  padding: 12px 20px;
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.body08};
  cursor: pointer;

  &:hover {
    background: ${theme.colors.gray700}; 
  }
`;
