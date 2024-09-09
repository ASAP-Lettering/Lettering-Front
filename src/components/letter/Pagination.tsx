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
  justify-content: center;
  gap: 4px;
  color: ${theme.colors.gray400};
`;

const PaginationWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
`;

const Circle = styled(motion.div)<{ $isActive: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: ${({ $isActive }) => ($isActive ? "30%" : "50%")};
  background-color: ${({ $isActive }) => ($isActive ? "gray" : "white")};
  width: ${({ $isActive }) => ($isActive ? "20px" : "10px")}; 
  margin: 0 3px;
`;
