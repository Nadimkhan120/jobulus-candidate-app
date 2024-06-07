import type { AxiosError } from 'axios';
import { createQuery, createMutation } from 'react-query-kit';

import { NetWorkService } from '@/services/apinetworkservice';

type Variables = { statusId: number; id: number };
type Variables2 = { person_id: number };

type Variables4 = { person_id: number; unique_id: string };

type SavedCandidates = { person_id: number; unique_id: string };

type VariablesVoid = void;
type SaveCandidate = { candidate_id: number; person_id: number; unique_id: string };

type UpdateCandidatePaylaod = {
  job_title_id: any;
  expected_salary: any;
  unique_id?: string;
  location_id: string;
  resume_bio: string;
  full_name: string;
  email: string;
  city_id?: string;
  country_id?: string;
};

type AddContactCandidate = {
  emails: number;
  person_id: number;
  company_id: number;
};

type Profile = {
  unique_id: string;
};

type Search = {
  search: string;
};

type Filter = {
  skill: number;
  industries: number;
};

type Variables3 = {
  id: number;
};

export type Candidate = {
  full_name: string;
  is_block: string;
  bio: string;
  email: string;
  phone: string;
  person_resume_id: string;
  description: string;
  cover_pic: string | null;
  profile_pic: string | null;
  unique_id: string;
  expected_salary: string;
  applied_on: string;
  id: number;
  job_title: string;
  person_title: string;
};

type Response = {
  response: {
    data: {
      data: Candidate[];
    };
  };

  message: string;
  status: number;
};

type Response3 = any;

type Response4 = {
  response: {
    data: Candidate[];
  };

  message: string;
  status: number;
};

type Setting = {
  id: number;
  name: string;
};

type Response2 = Setting[];

type Skill = {
  person_skill_id: string;
  id: number | null;
  name: string;
};

type Education = {
  id: number;
  person_resume_id: string;
  person_id: string;
  from_date: string;
  to_date: string;
  description: string;
  education_level_id: string;
  education_field_id: string;
  institute_id: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  deleted_by: string | null;
  updated_by: string | null;
  deleted_at: string | null;
  education_field: string;
  education_level: string;
  institute: string | null;
};

export type Experience = {
  id: number;
  person_resume_id: string;
  person_id: string;
  from_date: string;
  to_date: string;
  description: string;
  company_id: string;
  job_category_id: string;
  created_by: string;
  deleted_by: string | null;
  updated_by: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  company_name: string;
  is_current: string;
  job_category: string;
  images?: {
    cover: string;
    pic: string;
  };
};

export type CandidateProfile = {
  id: number;
  person_id: string;
  is_default: string;
  job_title_id: string;
  location_id: string;
  resume_bio: string;
  cover_pic: string | null;
  profile_pic: string | null;
  unique_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  deleted_by: string | null;
  updated_by: string | null;
  deleted_at: string | null;
  experience_level_id: string;
  education_level_id: string;
  expected_salary: string;
  is_top: string;
  job_title: string;
  full_name: string;
  experience_level: string;
  education_level: string;
  contact: {
    id: number;
    country_id: string;
    city_id: string;
    address_1: string;
    address_2: string | null;
    map_location: string | null;
    longitude: null;
    latitude: string | null;
    created_by: string;
    deleted_by: string | null;
    updated_by: string | null;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
    person_resume_id: string;
    email: string;
    person_id: string;
    google_location: string;
    country_name: string;
    city_name: string;
  };
  skills: Skill[];
  education: Education[];
  experience: Experience[];
};

type Candidates = {
  response: {
    data: Candidate[];
    message: string;
    status: number;
  };
};

export const useCandidates = createQuery<Response, Variables, AxiosError>({
  primaryKey: 'company-candidates',
  queryFn: ({ queryKey: [primaryKey, variables] }) => {
    return NetWorkService.Get({
      url: `${primaryKey}/company_id/${variables?.id}/status/${variables?.statusId}`,
      //@ts-ignore
    }).then((response) => response.data);
  },
});

export const useAllCandidates = createQuery<Response4, Variables4, AxiosError>({
  primaryKey: 'applicants',
  queryFn: ({ queryKey: [primaryKey, variables] }) => {
    return NetWorkService.Get({
      url: `${primaryKey}?person_id=${variables?.person_id}&unique_id=${variables?.unique_id}`,
      //@ts-ignore
    }).then((response) => response.data);
  },
});

export const useSavedCandidates = createQuery<Response4, SavedCandidates, AxiosError>({
  primaryKey: 'applicant/saved-candidate',
  queryFn: ({ queryKey: [primaryKey, variables] }) => {
    console.log('variables', variables);

    return NetWorkService.Get({
      url: `${primaryKey}?person_id=${variables?.person_id}&unique_id=${variables?.unique_id}`,
      //@ts-ignore
    }).then((response) => response.data);
  },
});

export const useMyNetworks = createQuery<Response4, Variables2, AxiosError>({
  primaryKey: 'applicant/my-contacts',
  queryFn: ({ queryKey: [primaryKey, variables] }) => {
    return NetWorkService.Get({
      url: `${primaryKey}?person_id=${variables?.person_id}`,
      //@ts-ignore
    }).then((response) => response.data);
  },
});

export const useCandidateStatuses = createQuery<Response2, Variables2, AxiosError>({
  primaryKey: 'job-applied-job-statuses',
  queryFn: ({ queryKey: [primaryKey] }) => {
    return NetWorkService.Get({ url: primaryKey }).then(
      //@ts-ignore
      (response) => response.data
    );
  },
});

export const useCandidateDetail = createQuery<CandidateProfile, Profile, AxiosError>({
  primaryKey: 'person/profile-detail',
  queryFn: ({ queryKey: [primaryKey, variables] }) => {
    return NetWorkService.Post({
      url: `${primaryKey}`,
      body: variables,
      //@ts-ignore
    }).then((response) => response.data);
  },
});

export const useCandidateByJob = createQuery<Candidates, Variables3, AxiosError>({
  primaryKey: 'job-candidates/',
  queryFn: ({ queryKey: [primaryKey, variables] }) => {
    console.log('yyyy', `${primaryKey}job_id/${variables?.id}`);
    return NetWorkService.Get({
      url: `${primaryKey}job_id/${variables?.id}`,
      //@ts-ignore
    }).then((response) => response.data);
  },
});

export const useCandidateByName = createQuery<Candidates, Search, AxiosError>({
  primaryKey: 'find-candidates',
  queryFn: ({ queryKey: [primaryKey, variables] }) => {
    return NetWorkService.Get({
      url: `${primaryKey}?name=${variables?.search}`,
      //@ts-ignore
    }).then((response) => response.data);
  },
});

export const useFilterCandidates = createQuery<Candidates, Filter, AxiosError>({
  primaryKey: 'find-candidates',
  queryFn: ({ queryKey: [primaryKey, variables] }) => {
    return NetWorkService.Get({
      url: `${primaryKey}?skill=${variables?.skill}&industries=${variables?.industries}`,
      //@ts-ignore
    }).then((response) => response.data);
  },
});

export const useSaveCandidate = createMutation<Response3, SaveCandidate, AxiosError>({
  mutationFn: async (variables) =>
    NetWorkService.Post({
      url: 'company/candidate/save',
      body: {
        candidate_id: variables?.candidate_id,
        company_id: variables?.person_id,
        unique_id: variables?.unique_id,
      },
      // @ts-ignore
    }).then((response) => response?.data),
});

export const useUnsaveSaveCandidate = createMutation<
  Response3,
  SaveCandidate,
  AxiosError
>({
  mutationFn: async (variables) =>
    NetWorkService.Post({
      url: 'candidate/unsave',
      body: {
        candidate_id: variables?.candidate_id,
        company_id: variables?.person_id,
        unique_id: variables?.unique_id,
      },
      // @ts-ignore
    }).then((response) => response?.data),
});

export const useAddContactCandidate = createMutation<
  Response3,
  AddContactCandidate,
  AxiosError
>({
  mutationFn: async (variables) =>
    NetWorkService.Post({
      url: 'applicant/add-contact-candidate',
      body: {
        emails: variables?.emails,
        person_id: variables?.person_id,
        company_id: variables?.company_id,
      },
      // @ts-ignore
    }).then((response) => response?.data),
});

export const useCreateCandidateProfile = createMutation<
  Response3,
  UpdateCandidatePaylaod,
  AxiosError
>({
  mutationFn: async (variables) =>
    NetWorkService.Post({
      url: 'applicant/profiles/create',
      body: variables,
      // @ts-ignore
    }).then((response) => response?.data),
});

export const useUpdateCandidateProfile = createMutation<
  Response3,
  UpdateCandidatePaylaod,
  AxiosError
>({
  mutationFn: async (variables) =>
    NetWorkService.Post({
      url: 'person/update-basic-info',
      body: variables,
      // @ts-ignore
    }).then((response) => response?.data),
});
