import type { AxiosError } from 'axios';
import { createQuery, createMutation } from 'react-query-kit';

import { NetWorkService } from '@/services/apinetworkservice';

type Variables = { person_id: number };
type ChatMessagePayload = { chat_id: any };
type ChatMessageDetails = { person_id: any, reciever_id: any };

type MarkRead = { notifications: any };

type ChatPayLoad = {
  chat_id: number;
  person_id: number;
  receiver_id: number;
  message: string;
};

export type ChatListItems = {
  id: number;
  person_id: string;
  receiver_id: string;
  created_at: string;
  updated_at: string;
  Person_Detail: any;
  Reciever_Detail: any;
  unreadMessages: number;
  lastMessage: {
    chat_id: string;
    person_id: string;
    receiver_id: string;
    message: string;
    is_read: string;
    created_at: string;
    updated_at: string;
    id: string;
  };
};

export type ChatMessage = {
  chat_id: string;
  created_at: string;
  id: number;
  is_read: string;
  message: string;
  person_id: string;
  receiver_id: string;
  updated_at: string;
};

type ChatListResponse = {
  chats: ChatListItems[];
};

type ChatMessagesResponse = {
  messages: ChatMessage[];
};

type Response = any;

export const useChatLists = createQuery<ChatListResponse, Variables, AxiosError>({
  primaryKey: 'company/chats',
  queryFn: ({ queryKey: [primaryKey, variables] }) => {
    //@ts-ignore
    return NetWorkService.Get({ url: `${primaryKey}/${variables.person_id}` }).then(
      //@ts-ignore
      (response) => response.data
    );
  },
});

export const useGetChatMessages = createQuery<
  ChatMessagesResponse,
  ChatMessagePayload,
  AxiosError
>({
  primaryKey: 'company/chats',
  queryFn: ({ queryKey: [primaryKey, variables] }) => {
    //@ts-ignore
    return NetWorkService.Get({
      url: `${primaryKey}/${variables.chat_id}/messages`,
    }).then(
      //@ts-ignore
      (response) => response.data
    );
  },
});


export const useGetChatWhenComeFromExplore = createQuery<
  ChatMessagesResponse,
  ChatMessageDetails,
  AxiosError
>({
  primaryKey: 'company/chatshistory',
  queryFn: ({ queryKey: [primaryKey, variables] }) => {
    //@ts-ignore
    return NetWorkService.Get({
      url: `${primaryKey}?person_id=${variables.person_id}&reciever_id=${variables.reciever_id}`,
    }).then(
      //@ts-ignore
      (response) => response.data
    );
  },  
});




export const useChatHistory = createMutation<Response, MarkRead, AxiosError>({
  mutationFn: async (variables) =>
    NetWorkService.Post({
      url: 'notifications/mark-all-as-read',
      body: variables,
      // @ts-ignore
    }).then((response) => response?.data),
});

export const useSendChatMessage = createMutation<Response, ChatPayLoad, AxiosError>({
  mutationFn: async (variables) =>
    NetWorkService.Post({
      url: 'company/messages',
      body: variables,
      // @ts-ignore
    }).then((response) => response?.data),
});

export const usePersonOnline = createQuery<Response, Variables, AxiosError>({
  primaryKey: 'company/online',
  queryFn: ({ queryKey: [primaryKey, variables] }) => {
    //@ts-ignore
    return NetWorkService.Get({ url: `${primaryKey}/${variables.person_id}` }).then(
      //@ts-ignore
      (response) => response.data
    );
  },
});
