import { AI_SERVICE_PATH, apiPath } from '@/utils/api.endpoints';
import { axiosClient as axios } from '@/utils/axiosInstance';
import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
  Query,
} from '@tanstack/react-query';

import { ChatAnalysis, ResponseAllConversations } from './chat.types';

const fetchAllConversation = async (botId: string) => {
  const response = await axios.get<ResponseAllConversations>(
    AI_SERVICE_PATH + apiPath.CHATBOT + `${botId}` + apiPath.CONVERSATIONS,
  );
  return response.data;
};

const fetchInfiniteAllConversation = async (url: string, botId: string) => {
  const response = await axios.get<ResponseAllConversations>(
    url ?? AI_SERVICE_PATH + apiPath.CHATBOT + `${botId}` + apiPath.CONVERSATIONS + `?limit=10`,
  );
  return response.data;
};

const fetchInfiniteFilteredConversation = async (url: string, botId: string, query: string) => {
  const response = await axios.get<ResponseAllConversations>(
    url ?? AI_SERVICE_PATH + apiPath.CHAT + `${botId}` + apiPath.FILTER_CONV + `?limit=10&${query}`,
  );
  return response.data;
};

export const useGetAllConversions = (botId: string) => {
  return useQuery(['allConversations'], () => fetchAllConversation(botId), {
    refetchOnWindowFocus: false,
  });
};

export const useGetInfiniteAllConversations = (botId: string) => {
  return useInfiniteQuery(
    ['infiniteAllConversations', botId],
    ({ pageParam }) => fetchInfiniteAllConversation(pageParam, botId),
    {
      getPreviousPageParam: (firstPage) => firstPage?.data?.previous ?? undefined,
      getNextPageParam: (lastPage) => lastPage?.data?.next ?? undefined,
      enabled: !!botId,
      refetchOnWindowFocus: false,
      cacheTime: 0,
    },
  );
};

export const useGetInfiniteFilteredConversations = (botId: string, query: string) => {
  const queryClient = useQueryClient();
  return useInfiniteQuery(
    ['infiniteFilteredConversations', botId, query],
    ({ pageParam }) => fetchInfiniteFilteredConversation(pageParam, botId, query),
    {
      getPreviousPageParam: (firstPage) => firstPage?.data?.previous ?? undefined,
      getNextPageParam: (lastPage) => lastPage?.data?.next ?? undefined,
      enabled: !!botId,
      refetchOnWindowFocus: false,
      cacheTime: 0,
    },
  );
};

const fetchConversationById = async (sessionId: string) => {
  const response = await axios.get(
    AI_SERVICE_PATH + apiPath.CHAT + `${sessionId}` + apiPath.messages,
  );
  return response.data;
};

export const useGetConversationById = (sessionId: string) => {
  const queryClient = useQueryClient();
  return useQuery(['conversations', sessionId], () => fetchConversationById(sessionId), {
    enabled: !!sessionId,
    refetchOnWindowFocus: false,
    onSuccess: () => {
      queryClient.invalidateQueries(['allConversations']);
    },
  });
};

const fetchInfiniteConversationById = async (url: string, sessionId: string) => {
  const response = await axios.get(
    url ?? AI_SERVICE_PATH + apiPath.CHAT + `${sessionId}` + apiPath.messages + '?limit=16',
  );
  return response.data;
};

export const useGetInfiniteConversationById = (sessionId: string) => {
  const queryClient = useQueryClient();
  return useInfiniteQuery(
    ['infiniteConversations', sessionId],
    ({ pageParam }) => fetchInfiniteConversationById(pageParam, sessionId),
    {
      getPreviousPageParam: (firstPage) => firstPage.data.previous ?? undefined,
      getNextPageParam: (lastPage) => lastPage.data.next ?? undefined,
      enabled: !!sessionId,
      refetchOnWindowFocus: false,
      cacheTime: 0,
      onSuccess: () => {
        queryClient.invalidateQueries(['infiniteAllConversations']);
      },
    },
  );
};

const updateSessionById = async (data: { name: string; sessionId: string }) => {
  const response = await axios.patch(
    `${AI_SERVICE_PATH}${apiPath.CHATBOT}${data.sessionId}/${apiPath.EDIT_SESSION}`,
    { name: data.name },
  );
  return response.data;
};
export const useUpdateSessionName = () => {
  const queryClient = useQueryClient();
  return useMutation((data: { name: string; sessionId: string }) => updateSessionById(data), {
    onSuccess: () => {
      return queryClient.invalidateQueries(['infiniteAllConversations']);
    },
  });
};

const chatAnalysis = async (data: { botId: string; timeType: string }) => {
  const response = await axios.post(
    `${AI_SERVICE_PATH}${apiPath.CHATBOT}${apiPath.CHAT_ANALYSIS}`,
    {
      type: 'chatbot',
      id: data.botId,
      time_type: data.timeType,
    },
  );
  return response.data;
};

export const useChatAnalysis = () => {
  return useMutation((data: { botId: string; timeType: string }) => chatAnalysis(data), {});
};

const preSignedUrl = async (data: ChatAnalysis) => {
  const response = await axios.get(
    `${AI_SERVICE_PATH}${apiPath.CHATBOT}${data.botId}/${apiPath.PRE_SIGNED_URL}?filename=${data.docName}`,
  );
  return response.data;
};

export const usePreSignedUrl = () => {
  return useMutation((data: ChatAnalysis) => preSignedUrl(data), {});
};

const fetchUnExpectedFiles = async (botId: string, query: string) => {
  const response = await axios.get(
    `${AI_SERVICE_PATH}${apiPath.CHATBOT}${botId}/${apiPath.UNEXPECTED_RESPONSES_LIST}${query}`,
  );
  return response.data;
};

export const useFetchUnExpectedFiles = (botId: string, query: string) => {
  return useQuery(['un_expected_files', query], () => fetchUnExpectedFiles(botId, query), {
    refetchOnWindowFocus: false,
  });
};

const downloadChat = async (query: string) => {
  const response = await axios.get(`${AI_SERVICE_PATH}${apiPath.CHAT}${apiPath.download}${query}`);
  return response;
};

export const useDownloadChat = () => {
  return useMutation((query: string) => downloadChat(query), {});
};

const generateChatSuggestions = async (sessionId: string, data: { organizationId: string }) => {
  const response = await axios.post(
    AI_SERVICE_PATH + apiPath.CHATBOT + `${sessionId}` + apiPath.CHAT_SUGGESTIONS,
    {
      organization_id: data.organizationId,
    },
  );
  return response.data;
};

export const useGenerateChatSuggestions = (sessionId: string) => {
  return useMutation(
    [sessionId],
    (data: { organizationId: string }) => generateChatSuggestions(sessionId, data),
    {},
  );
};
