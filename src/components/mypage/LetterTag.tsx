import { theme } from "@/styles/theme";
import styled from "styled-components";

interface TagProps {
  name: string;
  id: number;
  isSelecting: boolean;
  isSelected: boolean;
  onSelect: (id: number) => void;
}

const LetterTag = (props: TagProps) => {
  const {
    name,
    id = 0,
    isSelecting = false,
    isSelected = false,
    onSelect,
  } = props;

  return (
    <Box>
      {isSelecting && (
        <CheckCircle isSelected={isSelected} onClick={() => onSelect(id)}>
          {isSelected && <CheckImg src="/assets/icons/ic_check_circle.svg" />}
        </CheckCircle>
      )}
      <SenderName>{name}</SenderName>
    </Box>
  );
};

export default LetterTag;

const Box = styled.button`
  width: 80px;
  display: flex;
  justify-content: center;
  padding: 10px 20px;
  box-sizing: border-box;
  position: relative;
  align-items: center;
  color: ${theme.colors.white};
  white-space: nowrap;
  border-radius: 41px;
  border: 1px solid rgba(86, 92, 129, 0.00);
  background: ${theme.colors.sub01};
`;

const CheckCircle = styled.div<{ isSelected: boolean }>`
  position: absolute;
  top: -6px;
  left: -6px;
  width: 20px;
  height: 20px;
  border: 1px solid ${(props) =>
    props.isSelected ? props.theme.colors.white : props.theme.colors.gray300};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) =>
    props.isSelected ? props.theme.colors.white : "transparent"};
  cursor: pointer;
`;

const CheckImg = styled.img`
    width: 21px;
    height: auto;
`;

const SenderName = styled.span`
  color: ${(props) => props.theme.colors.text};
`;
