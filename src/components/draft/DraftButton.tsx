import React from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';

interface DraftButtonProps {
  handleSaveLetter: () => Promise<void>;
  handleDraftBottom: () => void;
  isDraftDisabled: boolean;
  isImageUploadLoading: boolean;
  tempCount: number;
}

const DraftButton: React.FC<DraftButtonProps> = ({
  handleSaveLetter,
  handleDraftBottom,
  isDraftDisabled,
  isImageUploadLoading,
  tempCount
}) => {
  return (
    <ButtonDiv>
      <StyledDraftButton
        onClick={handleSaveLetter}
        disabled={isDraftDisabled || isImageUploadLoading}
      >
        {isImageUploadLoading ? 'Loading...' : '임시저장'}
      </StyledDraftButton>
      <ListButton onClick={handleDraftBottom}>{tempCount}</ListButton>
    </ButtonDiv>
  );
};

export default DraftButton;

const ButtonDiv = styled.div`
  display: inline-flex;
  padding: 6px 12px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 200px;
  background: ${theme.colors.sub01};
  color: ${theme.colors.gray200};
  ${theme.fonts.caption03};

  position: absolute;
  top: 26px;
  right: 20px;

  @media (max-height: 580px) {
    ${theme.fonts.body15};
  }

  @media (max-height: 550px) {
    ${theme.fonts.body12}
    top: 9px;
  }
`;

const StyledDraftButton = styled.button`
  color: ${theme.colors.gray200};
  ${theme.fonts.caption03};
  white-space: nowrap;

  &:disabled {
    opacity: 0.6;
    transition: opacity 0.5s;
  }

  @media (max-height: 628px) {
    ${theme.fonts.caption03};
  }

  @media (max-height: 580px) {
    ${theme.fonts.body15};
  }
`;

const ListButton = styled.button`
  color: ${theme.colors.gray200};
  ${theme.fonts.caption03};

  @media (max-height: 628px) {
    ${theme.fonts.caption03};
  }

  @media (max-height: 580px) {
    ${theme.fonts.body15};
  }
`;
