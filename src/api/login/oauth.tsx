import { Provider } from '@/types/login';
import client from '../client';

export const getOauthAccessToken = async (
  provider: Provider,
  code: string,
  state: string
) => {
  const response = await client.post(`/api/v1/auth/token/${provider}`, {
    code: code,
    state: state
  });
  const { accessToken } = response.data;
  return accessToken;
};
