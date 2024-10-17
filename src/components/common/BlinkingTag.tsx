import { theme } from "@/styles/theme";
import { motion } from "framer-motion";
import styled from "styled-components";

interface TagProps {
  tagId: string;
  name: string;
  isNew?: boolean;
}

const BlinkTag = (props: TagProps) => {
  const { tagId, name, isNew } = props;
  return (
    <Container
      animate={{ opacity: [1, 0, 1] }}
      transition={{
        duration: 1,
        repeat: Infinity,
        repeatType: "loop",
      }}
    >
      {name}
    </Container>
  );
};

export default BlinkTag;

const Container = styled(motion.div)`
      width: auto;
      justify-content: center;
      align-items: center;
      border-radius: 100px;
      color: ${theme.colors.white};
      cursor: pointer;
      display: block;
      max-width: 90px;
      height: 39px;
      padding: 11px 15px;
      border-radius: 100px;
      background: ${theme.colors.sub01};
      ${(props) => props.theme.fonts.body07};
      line-height: 16px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: center;
      &:active {
        background: #565c81;
      }
`;
