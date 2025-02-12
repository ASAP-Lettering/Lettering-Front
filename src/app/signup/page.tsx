'use client';

import { theme } from '@/styles/theme';
import styled from 'styled-components';

export default function Signup() {
  return <Container></Container>;
}

const Container = styled.div`
  display: flex;
  min-height: 100%;
  padding: 20px;
  color: ${theme.colors.white};
  background: ${theme.colors.bg};
`;
