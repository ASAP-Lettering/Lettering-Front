"use client";

import Button from "@/components/common/Button";
import NavigatorBar from "@/components/common/NavigatorBar";
import Letter from "@/components/letter/Letter";
import { useRouter } from "next/navigation";
import styled from "styled-components";

export default function Signin() {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push("/");
  };

  const senderName = "동우";

  return (
    <Container>
      <MainWrapper>
        <Header>
          <HeaderTitle>
            {senderName}님이 보낸 편지 속 <br />
            소중한 마음을 읽어보세요
          </HeaderTitle>
          <HeaderSubTitle>
            편지는 전달 받은 링크를 통해 나중에도 등록할 수 있어요
          </HeaderSubTitle>
        </Header>
        <Letter
          templateType={1}
          name="승효"
          content="안녕하세요"
          date="2024-09-04"
        />
      </MainWrapper>
      <ButtonContainer>
        <Button
          buttonType="secondary"
          size="default"
          text="홈으로"
          onClick={handleButtonClick}
        />
        <Button
          buttonType="primary"
          size="medium"
          text="나의 스페이스에 추가하기"
          onClick={handleButtonClick}
        />
      </ButtonContainer>
    </Container>
  );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    height: 100%;
    max-height: 852px;
    color: white;
    padding: 25px;
    overflow-x: hidden;
    padding-bottom: 40px;
    background:${(props) => props.theme.colors.bg};
    /* background-image: url('/assets/signin/verify_image.png'); 
    background-size: 550px auto; 
    background-position: bottom 80px center;
    background-repeat: no-repeat; */
`;

const MainWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

const Header = styled.div`
    display: flex;
    flex-direction: column;
    padding: 10px;
`;

const HeaderTitle = styled.div`
    width: 100%;
    ${(props) => props.theme.fonts.heading01};
    margin-top: 2.5rem;
`;

const HeaderSubTitle = styled.div`
    width: 100%;
    ${(props) => props.theme.fonts.regular16};
    color: ${(props) => props.theme.colors.gray300};
    padding-top: 10px;
`;

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    gap: 12px;
`;
