import type { AxiosError } from 'axios';
import { createMutation, createQuery } from 'react-query-kit';

import { NetWorkService } from '@/services/apinetworkservice';

type Variables = { status: string; id: number };
type SuggestedJobs = { person_id: number; unique_id: string };
type CompanyJobs = { person_id: number; company_id: number };
type SavedJobs = { unique_id: string; person_id: number };
type SaveJob = { job_id: number; unique_id: string };
type JobVariables = { id: number };
type SearchVariable = { id: number; keyword: string };

type AppliedJobDetailPaylaod = { person_id: number; job_id: any };

type VariableAny = void;

type Variable2 = { id: number };

type FilterVariable = {
  id: number;
  date_posted: string;
  job_status: string;
  job_type_id: number;
  job_category_id: number;
};

export type Job = any;

type Response = {
  response: {
    data: {
      data: any;
    };
  };

  message: string;
  status: number;
};

type Response4 = {
  id: number;
  response: {
    data: Job[];
  };

  message: string;
  status: number;
};

type Setting = {
  id: number;
  name: string;
};

type Response2 = Setting[];

type Response3 = {
  response: {
    data: Job;
  };
};

type DeleteResponse = {
  response: {
    status: number;
    message: string;
  };
};

type ResponseAny = any;

export const useVacancies = createQuery<Response, Variables, AxiosError>({
  primaryKey: 'company-jobs',
  queryFn: ({ queryKey: [primaryKey, variables] }) => {
    return NetWorkService.Get({
      url: `${primaryKey}/company_id/${variables?.id}/status/${variables?.status}`,
      //@ts-ignore
    }).then((response) => response.data);
  },
});

export const useSuggestedJobs = createQuery<Response4, SuggestedJobs, AxiosError>({
  primaryKey: 'applicant/suggested-jobs',
  queryFn: ({ queryKey: [primaryKey, variables] }) => {
    return NetWorkService.Get({
      url: `${primaryKey}?person_id=${variables.person_id}&unique_id=${variables?.unique_id}`,
      //@ts-ignore
    }).then((response) => response.data);
  },
});

export const useGetJobByCompany = createQuery<Response4, CompanyJobs, AxiosError>({
  primaryKey: 'applicant/suggested-jobs',
  queryFn: ({ queryKey: [primaryKey, variables] }) => {
    return NetWorkService.Get({
      url: `${primaryKey}?person_id=${variables?.person_id}&company_id=${variables?.company_id}`,
      //@ts-ignore
    }).then((response) => response.data);
  },
});

export const useSavedJobs = createQuery<Response4, SavedJobs, AxiosError>({
  primaryKey: 'applicant/saved-jobs',
  queryFn: ({ queryKey: [primaryKey, variables] }) => {
    return NetWorkService.Get({
      url: `${primaryKey}?person_id=${variables?.person_id}&unique_id=${variables?.unique_id}`,
      //@ts-ignore
    }).then((response) => response.data);
  },
});

export const useAppliedJobs = createQuery<Response4, SuggestedJobs, AxiosError>({
  primaryKey: 'applicant/applied-jobs',
  queryFn: ({ queryKey: [primaryKey, variables] }) => {
    return NetWorkService.Get({
      url: `${primaryKey}?person_id=${variables?.person_id}&unique_id=${variables?.unique_id}`,

      //@ts-ignore
    }).then((response) => response.data);
  },
});

export const useAppliedJobDetails = createQuery<
  Response4,
  AppliedJobDetailPaylaod,
  AxiosError
>({
  primaryKey: 'applicant/applied-job-detail',
  queryFn: ({ queryKey: [primaryKey, variables] }) => {
    return NetWorkService.Get({
      url: `${primaryKey}?person_id=${variables?.person_id}&job_id=${variables.job_id}`,

      //@ts-ignore
    }).then((response) => response.data);
  },
});

export const useJobDetail = createQuery<Response3, JobVariables, AxiosError>({
  primaryKey: 'jobs/job_id',
  queryFn: ({ queryKey: [primaryKey, variables] }) => {
    return NetWorkService.Get({
      url: `${primaryKey}/${variables?.id}`,
      //@ts-ignore
    }).then((response) => response.data);
  },
});

export const useSearchVacancies = createQuery<Response3, SearchVariable, AxiosError>({
  primaryKey: 'find-jobs',
  queryFn: ({ queryKey: [primaryKey, variables] }) => {
    return NetWorkService.Get({
      url: `${primaryKey}?keyword=${variables.keyword}&company_id=${variables?.id}`,
      //@ts-ignore
    }).then((response) => response.data);
  },
});

export const useFilterVacancies = createQuery<Response3, FilterVariable, AxiosError>({
  primaryKey: 'find-jobs',
  queryFn: ({ queryKey: [primaryKey, variables] }) => {
    return NetWorkService.Get({
      url: `${primaryKey}?company_id=${variables?.id}&date_posted=${variables?.date_posted}&job_status=${variables?.job_status}&job_type_id=${variables?.job_type_id}&job_category_id=${variables?.job_category_id}`,
      //@ts-ignore
    }).then((response) => response.data);
  },
});

export const useDeleteVacancy = createMutation<DeleteResponse, TopVariables, AxiosError>({
  mutationFn: async (variables) =>
    NetWorkService.Delete({
      url: 'job/save',
      body: {},
      // @ts-ignore
    }).then((response) => response?.data),
});

export const useSaveJob = createMutation<DeleteResponse, SaveJob, AxiosError>({
  mutationFn: async (variables) => {
    return NetWorkService.Post({
      url: 'job/save',
      body: {
        job_id: variables?.job_id,
        unique_id: variables?.unique_id,
      },
      // @ts-ignore
    }).then((response) => response?.data);
  },
});

export const useUnSaveJob = createMutation<DeleteResponse, SaveJob, AxiosError>({
  mutationFn: async (variables) =>
    NetWorkService.Post({
      url: 'job/unsave',
      body: {
        job_id: variables?.job_id,
        unique_id: variables?.unique_id,
      },
      // @ts-ignore
    }).then((response) => response?.data),
});

export const useGetProfile = createQuery<ResponseAny, VariableAny, AxiosError>({
  primaryKey: 'applicant/profiles/head',
  queryFn: ({ queryKey: [primaryKey] }) => {
    return NetWorkService.Get({
      url: `${primaryKey}`,
      //@ts-ignore
    }).then((response) => response.data);
  },
});

export const useGetUserProfileDetails = createQuery<ResponseAny, Variable2, AxiosError>({
  primaryKey: 'applicant/profiles',
  queryFn: ({ queryKey: [primaryKey, variables] }) => {
    return NetWorkService.Get({
      url: `${primaryKey}/${variables.id}`,
      //@ts-ignore
    }).then((response) => response.data);
  },
});
