import React from "react";
import Button from "./Button";
import styled from "styled-components";
import { theme } from "@/styles/theme";

interface ConfirmModalProps {
  title: string;
  sub?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = (props: ConfirmModalProps) => {
  const {
    title,
    sub,
    confirmText = "삭제",
    cancelText = "취소",
    onConfirm,
    onCancel,
  } = props;
  return (
    <ModalOverlay>
      <ModalContainer>
        <ContentWrapper>
          <ModalTitle>{title}</ModalTitle>
          {sub}
        </ContentWrapper>
        <ButtonWrapper>
          <Button
            buttonType="primary"
            size="small"
            text={confirmText}
            onClick={onConfirm}
            width="100%"
          />
          <CancelButton onClick={onCancel}>{cancelText}</CancelButton>
        </ButtonWrapper>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ConfirmModal;

const ModalOverlay = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  width: 274px;
  padding: 27px 16px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-radius: 12px;
  background: rgba(62, 65, 81, 0.7);
  backdrop-filter: blur(4px);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: center;
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.caption03};
`;

const ModalTitle = styled.div`
  ${(props) => props.theme.fonts.subtitle};
`;

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 11px;
`;

const CancelButton = styled.button`
  text-align: center;
  color: ${theme.colors.gray200};
  ${(props) => props.theme.fonts.caption02};
`;
