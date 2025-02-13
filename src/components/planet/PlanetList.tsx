import { theme } from '@/styles/theme';
import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import Check from '../common/Check';
import {
  DraggableProvidedDraggableProps,
  DraggableProvidedDragHandleProps
} from 'react-beautiful-dnd';

interface PlanetListProps {
  id: string;
  planetName: string;
  count: number;
  dragMode?: boolean;
  isMain?: boolean;
  onClick?: () => void;
  onShowBottom: () => void;
  children?: React.ReactNode;
  innerRef?: (element: HTMLElement | null) => void;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
  draggableProps?: DraggableProvidedDraggableProps | null;
}

const PlanetList = (props: PlanetListProps) => {
  const {
    id,
    planetName,
    count,
    dragMode,
    isMain,
    onClick,
    onShowBottom,
    children,
    innerRef,
    dragHandleProps,
    draggableProps
  } = props;

  const handleShowBottom = (event: React.MouseEvent) => {
    event.stopPropagation();
    onShowBottom();
  };

  return (
    <Box ref={innerRef} onClick={onClick} {...draggableProps}>
      <ContentWrapper>
        <LeftWrapper>
          <TextWrapper>
            <Top>
              {isMain && <MainLabel>홈</MainLabel>}
              {planetName}
            </Top>
            {count}개의 편지
          </TextWrapper>
        </LeftWrapper>
        {dragMode ? (
          <IconButton {...dragHandleProps}>
            <Image
              src="/assets/icons/ic_hamburger_gray.svg"
              width={24}
              height={24}
              alt="list"
            />
          </IconButton>
        ) : (
          <IconButton onClick={handleShowBottom}>
            <Image
              src="/assets/icons/ic_kebab.svg"
              width={24}
              height={24}
              alt="list"
            />
          </IconButton>
        )}
      </ContentWrapper>
      {children}
    </Box>
  );
};

export default PlanetList;

const Box = styled.div`
  width: 100%;
  height: 68px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 10px;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
`;

const ContentWrapper = styled.div`
  width: 100%;
  height: 68px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LeftWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 16px;
  color: ${theme.colors.gray400};
  ${(props) => props.theme.fonts.caption02};
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  color: ${theme.colors.gray400};
  ${(props) => props.theme.fonts.caption02};
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.body06};
`;

const MainLabel = styled.div`
  width: 39px;
  height: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  text-align: center;
  background: ${theme.colors.sub01};
  ${(props) => props.theme.fonts.caption03};
  white-space: nowrap;
`;

const IconButton = styled.button`
  width: 30px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
