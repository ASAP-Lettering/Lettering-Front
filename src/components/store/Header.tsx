import React from 'react';
import NavigatorBar from '../common/NavigatorBar';
import styled from 'styled-components';
import ProgressBar from '../common/ProgressBar';

interface HeaderProps {
  current: number | null;
  edit: boolean;
}

const Header = (props: HeaderProps) => {
  const { current, edit } = props;

  return (
    <>
      <NavigatorBar
        title={edit ? '편지 수정하기' : '받은 편지 보관하기'}
        cancel={false}
      />
      {current && (
        <ProgressBarWrapper>
          <ProgressBar current={current} total={3} />
        </ProgressBarWrapper>
      )}
    </>
  );
};

export default Header;

const ProgressBarWrapper = styled.div`
  width: 100%;
  padding: 32px 0 72px 0;

  @media (max-height: 795px) {
    padding: 24px 0 40px 0;
  }

  @media (max-height: 650px) {
    padding: 20px 0 36px 0;
  }

  @media (max-height: 580px) {
    padding: 15px 0 36px 0;
  }
`;
