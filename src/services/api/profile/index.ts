import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { NetWorkService } from '@/services/apinetworkservice';
import { getAuthToken } from '@/store/auth';

type UpdateSkills = { unique_id: number; skills: number[] };

type UpdateExperience = {
  unique_id: number;
  from_date: string;
  to_date: string;
  company_name: string;
  job_category_id: string;
  description: string;
  employee_type: string;
  location: string;
  job_title: string;
  is_current: string;
  company_description: string;
};

type UpdateEducation = {
  unique_id: number;
  created_by: number;
  from_date: string;
  to_date: string;
  description: string;
  institute_id: number;
  education_level_id: number;
  education_field_id: number;
  grade: string;
};

type DetailPayload = {
  unique_id: any;
  person_id: any;
};

type UpdateProfile = any;

type DeleteAccount = {
  person_id: any;
};

type Response = any;

export const useUpdateSkills = createMutation<Response, UpdateSkills, AxiosError>({
  mutationFn: async (variables) =>
    NetWorkService.Post({
      url: 'person/update-skills',
      body: {
        unique_id: variables?.unique_id,
        skills: variables?.skills,
      },
      // @ts-ignore
    }).then((response) => response?.data),
});

export const useUpdateExperience = createMutation<Response, UpdateExperience, AxiosError>(
  {
    mutationFn: async (variables) => {
      return NetWorkService.Post({
        url: 'person/update-work-experience',
        body: variables,
        // @ts-ignore
      }).then((response) => response?.data);
    },
  }
);

export const useUpdateEducation = createMutation<Response, UpdateEducation, AxiosError>({
  mutationFn: async (variables) => {
    return NetWorkService.Post({
      url: 'person/update-education',
      body: variables,
      // @ts-ignore
    }).then((response) => response?.data);
  },
});

export const useProfileDetails = createMutation<Response, DetailPayload, AxiosError>({
  mutationFn: async (variables) => {
    return NetWorkService.Post({
      url: 'candidate/detail',
      body: variables,
      // @ts-ignore
    }).then((response) => response?.data);
  },
});

export const useUpdatePicture = createMutation<Response, UpdateProfile, AxiosError>({
  mutationFn: async (variables) => {
    const token = getAuthToken();

    let headers = {
      'Content-Type': 'multipart/form-data',
      authorization: 'Bearer ' + token ?? '',
    };

    return NetWorkService.Post({
      url: 'applicant/profiles/update/file',
      body: variables,
      headers: headers,
      transformRequest: (data) => {
        return data;
      },
      // @ts-ignore
    }).then((response) => response?.data);
  },
});

export const useDeleteAccount = createMutation<Response, DeleteAccount, AxiosError>({
  mutationFn: async (variables) => {
    return NetWorkService.Delete({
      url: `person/delete/${variables?.person_id}`,
      body: {},

      // @ts-ignore
    }).then((response) => response?.data);
  },
});
