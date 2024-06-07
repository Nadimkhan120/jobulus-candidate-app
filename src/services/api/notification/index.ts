import type { AxiosError } from 'axios';
import { createQuery, createMutation } from 'react-query-kit';

import { NetWorkService } from '@/services/apinetworkservice';

type Variables = { unique_id: string };
type SearchQuery = { query: string };
type MarkRead = { notifications: any };

export type Notification = {
  notification_id: string;
  notification_text: string;
  notification_name: string;
  notification_type: string;
  notification_slug: string;
  notification_purpose: string;
  id: number;
  person_id: string;
  text: string;
  resume_id: string;
  company_id: string;
  is_read: string;
  created_by: string | null;
  deleted_by: string | null;
  updated_by: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  image: string;
  mobile_text: string;
  notification_buttons: any;
};

type NotificationResponse = {
  response: {
    data: {
      data: Notification[];
    };
  };

  message: string;
  status: number;
};

type Response = any;

export const useNotifications = createQuery<NotificationResponse, Variables, AxiosError>({
  primaryKey: 'notifications/all?page=1&type=internal',
  queryFn: ({ queryKey: [primaryKey, variables] }) => {
    //@ts-ignore
    return NetWorkService.Get({
      url: `${primaryKey}&unique_id=${variables?.unique_id}`,
    }).then(
      //@ts-ignore
      (response) => response.data
    );
  },
});

export const useNotificationMarkAsRead = createMutation<Response, MarkRead, AxiosError>({
  mutationFn: async (variables) =>
    NetWorkService.Post({
      url: 'notifications/mark-all-as-read',
      body: variables,
      // @ts-ignore
    }).then((response) => response?.data),
});

export const useAllSearch = createQuery<Response, SearchQuery, AxiosError>({
  primaryKey: 'search',
  queryFn: ({ queryKey: [primaryKey, variables] }) => {
    return NetWorkService.Get({
      url: `${primaryKey}?keyword=${variables?.query}`,
    }).then(
      //@ts-ignore
      (response) => response.data
    );
  },
});
