'use client';

import { getOauthAccessToken } from '@/api/login/oauth';
import { login } from '@/api/login/user';
import Loader from '@/components/common/Loader';
import { signupState } from '@/recoil/signupStore';
import { Provider } from '@/types/login';
import {
  clearLetterUrl,
  setOnboarding,
  setRecentLogin,
  setTokens
} from '@/utils/storage';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

const Auth = () => {
  const [registerToken, setRegisterToken] = useRecoilState(signupState);
  const router = useRouter();
  const [absoluteUrl, setAbsoluteUrl] = useState('');
  const [storeUrl, setstoreUrl] = useState('');
  const [type, setType] = useState('');
  const [oauthAccessToken, setOauthAccessToken] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      //oauth 타입을 state에 저장
      const params = new URL(window.location.href).searchParams;
      const typeParam = params.get('type');
      setType(typeParam);
      const url = `${window.location.protocol}//${window.location.host}/login/auth?type=${typeParam}`;
      const letterId = localStorage.getItem('letter_url');
      setAbsoluteUrl(url);
      if (letterId) setstoreUrl(letterId);
    }
  }, []);

  useEffect(() => {
    if (!absoluteUrl || !type) return;
    const getToken = async () => {
      const AUTHORIZATION_CODE = new URL(window.location.href).searchParams.get(
        'code'
      );
      const STATE = new URL(window.location.href).searchParams.get('state');

      const TYPE = new URL(window.location.href).searchParams.get('type');

      if (!AUTHORIZATION_CODE || !TYPE) {
        console.error('Authorization Code or Type is missing');
        return;
      }

      //type에 따라 다른 토큰 url 지정
      switch (TYPE) {
        case 'kakao':
          try {
            const response = await axios.post(
              'https://kauth.kakao.com/oauth/token',
              new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY,
                redirect_uri: absoluteUrl,
                code: AUTHORIZATION_CODE
              }),
              {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
              }
            );
            setOauthAccessToken(response.data.access_token);
          } catch (error) {
            console.error(error);
            clearLetterUrl();
            return;
          }

          break;
        case 'google':
          try {
            const body = new URLSearchParams({
              grant_type: 'authorization_code',
              client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
              client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
              redirect_uri: absoluteUrl,
              code: AUTHORIZATION_CODE
            });

            const response = await axios.post(
              'https://oauth2.googleapis.com/token',
              body.toString(),
              {
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
              }
            );
            setOauthAccessToken(response.data.access_token);
          } catch (error) {
            console.error('Unsupported OAuth type:', type);
            clearLetterUrl();
            return;
          }
          break;
        case 'naver':
          try {
            const response = await getOauthAccessToken(
              'NAVER' as Provider,
              AUTHORIZATION_CODE,
              STATE
            );
            setOauthAccessToken(response);
          } catch (error) {
            console.error('Unsupported OAuth type:', type);
            clearLetterUrl();
            return;
          }
          break;
        default:
          console.error('Unknown OAuth type:', TYPE);
          return;
      }
    };
    getToken();
  }, [absoluteUrl, type]);

  useEffect(() => {
    try {
      if (oauthAccessToken) {
        login(type?.toUpperCase() as Provider, oauthAccessToken)
          .then((res) => {
            console.log('accessToken', res.data.accessToken);
            setTokens(res.data.accessToken, res.data.refreshToken);
            /* 온보딩 여부 저장 */
            setOnboarding(res.data.isProcessedOnboarding);
            /* 최근 로그인 정보 저장 */
            setRecentLogin(type);
            if (storeUrl) {
              router.push(`/verify/letter?url=${storeUrl}`);
              clearLetterUrl();
            } else {
              router.push('/planet');
            }
          })
          .catch((error) => {
            if (error.response && error.response.status === 401) {
              console.log('registerToken', error.response.data.registerToken);
              setRegisterToken(error.response.data.registerToken);
              if (storeUrl) {
                router.push(`/signup/step1?url=${storeUrl}`);
                clearLetterUrl();
              } else {
                router.push('/signup/step1');
              }
            }
          });
      }
    } catch (error) {
      console.log('oauth token 에러');
      console.error(error);
      clearLetterUrl();
      return;
    }
  }, [oauthAccessToken]);

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
