import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { NetWorkService } from '@/services/apinetworkservice';

type Variables = {
  city_id: string;
  country_id: string;
  job_title_id: string;
  google_location: string;
  experience_level_id: number;
  education_level_id: number;
  skills?: string;
  user_id: number;
};

type Response = {
  response: {
    message: string;
    status: number;
  };
};

export const useCompanyInformation = createMutation<Response, Variables, AxiosError>({
  mutationFn: async (variables) =>
    NetWorkService.Post({
      url: 'applicant/profiles/information',
      body: variables,
    })
      .then((response) => {
        // @ts-ignore
        return response?.data;
      })
      .catch((error) => {
        console.log('error1', error?.response?.data);
      }),
});
