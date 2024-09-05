import { theme } from "@/styles/theme";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import styled from "styled-components";

interface NavigatorBarProps {
  title?: string;
  url?: string;
  cancel: boolean;
  nextlabel?: boolean;
  nextClick?: Function;
}

const NavigatorBar = (props: NavigatorBarProps) => {
  const { title, url, cancel = false, nextlabel = false, nextClick } = props;
  const router = useRouter();

  const handleChangePage = () => {
    url ? router.push(url) : router.back();
  };

  const handleCancelPage = () => {
    router.back();
  };

  const handleNextClick = (e: React.MouseEvent<HTMLDivElement>) => {
    nextClick?.(e);
  };

  return (
    <Container>
      <LeftIcon>
        <Image
          src="/assets/icons/ic_chevron_left.svg"
          width={24}
          height={24}
          alt="back"
          onClick={handleChangePage}
        />
      </LeftIcon>
      {title && <Title>{title}</Title>}
      {cancel && (
        <RightIcon>
          <Image
            src="/assets/icons/ic_cancel.svg"
            width={24}
            height={24}
            alt="cancel"
            onClick={handleCancelPage}
          />
        </RightIcon>
      )}
      {nextlabel && <NextLabel onClick={handleNextClick}>건너뛰기</NextLabel>}
    </Container>
  );
};

export default NavigatorBar;

const Container = styled.div`
  width: 100%;
  height: 44px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
`;

const LeftIcon = styled.div`
  flex-shrink: 0;
`;

const RightIcon = styled.div`
  flex-shrink: 0;
`;

const Title = styled.div`
  flex-grow: 1;
  text-align: center;
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.body04};
`;

const NextLabel = styled.div`
  text-align: center;
  color: ${theme.colors.gray300};
  ${(props) => props.theme.fonts.regular16};
  cursor: pointer;
`;
