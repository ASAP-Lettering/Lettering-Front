import { theme } from "@/styles/theme";
import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

interface PaginationProps {
  currentPage: number;
  totalPage: number;
}

const Pagination = ({ currentPage, totalPage }: PaginationProps) => {
  return (
    <Wrapper>
      <PaginationWrapper>
        {Array.from({ length: totalPage }, (_, index) => (
          <Circle
            key={index}
            initial={{ scale: 0.8 }}
            animate={{ scale: currentPage === index ? 1.2 : 1 }}
            $isActive={currentPage === index}
          />
        ))}
      </PaginationWrapper>
    </Wrapper>
  );
};

export default Pagination;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  justify-content: center;
  gap: 4px;
  color: ${theme.colors.gray400};
  padding-top: 10px;
`;

const PaginationWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
`;

const Circle = styled(motion.div)<{ $isActive: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: ${({ $isActive }) => ($isActive ? "174px" : "50%")};
  background-color: ${({ $isActive }) =>
    $isActive ? theme.colors.white : theme.colors.gray500};
  width: ${({ $isActive }) => ($isActive ? "16px" : "6px")}; 
  margin: 0 3px;
`;
