import { theme } from "@/styles/theme";
import Image from "next/image";
import React from "react";
import styled from "styled-components";

interface PaginationProps {
  currentPage: number;
  totalPage: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

const Pagination = (props: PaginationProps) => {
  const { currentPage, totalPage, onPrevPage, onNextPage } = props;

  return (
    <Wrapper>
      <IconButton onClick={onPrevPage} disabled={currentPage === 1}>
        <Image
          src="/assets/icons/ic_prev.svg"
          width={16}
          height={16}
          alt="이전 페이지"
        />
      </IconButton>
      <Current>{currentPage}</Current> / {totalPage}
      <IconButton onClick={onNextPage} disabled={currentPage === totalPage}>
        <Image
          src="/assets/icons/ic_next.svg"
          width={16}
          height={16}
          alt="다음 페이지"
        />
      </IconButton>
    </Wrapper>
  );
};

export default Pagination;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${theme.colors.gray400};
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }

  &:disabled {
    opacity: 0.4;
  }
`;

const Current = styled.span`
  color: ${theme.colors.white};
`;
