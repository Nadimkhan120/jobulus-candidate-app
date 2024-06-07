import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { NetWorkService } from '@/services/apinetworkservice';
import { t } from 'i18next';

type Variables = { email: string; password: string };

type SocialLoginPaylaod = {
  provider: string;
  user_type: '1' | '2';
  token: string;
  email: string;
  full_name: string;
};

type Response = {
  response: {
    message: string;
    status: number;
    data: {
      token: string;
    };
  };
};

export const useLogin = createMutation<Response, Variables, AxiosError>({
  mutationFn: async (variables) =>
    NetWorkService.Post({
      url: 'company/login',
      body: variables,
      // @ts-ignore
    }).then((response) => response?.data),
});

export const useSocialLogin = createMutation<Response, SocialLoginPaylaod, AxiosError>({
  mutationFn: async (variables) =>
    NetWorkService.Post({
      url: 'auth/social-login-mobile',
      body: variables,
      // @ts-ignore
    }).then((response) => response?.data),
});
