'use client';

import Loader from '@/components/common/Loader';
import styled from 'styled-components';

const Auth = () => {
  return (
    <Container>
      <LoaderContainer>
        <Loader />
        <Guidetext>
          로그인 중입니다
          <br />
          잠시만 기다려주세요...
        </Guidetext>
      </LoaderContainer>
    </Container>
  );
};

export default Auth;

const Container = styled.div`
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  height: 100%;
  padding: 25px;
  background: ${(props) => props.theme.colors.bg};
`;

const LoaderContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Guidetext = styled.div`
  width: 100%;
  display: flex;
  text-align: center;
  justify-content: center;
  ${(props) => props.theme.fonts.regular16};
  color: ${(props) => props.theme.colors.gray300};
  padding-top: 10px;
`;
