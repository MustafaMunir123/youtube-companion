import { apiPath, AI_SERVICE_PATH } from '@/utils/api.endpoints';
import { axiosClient as axios } from '@/utils/axiosInstance';
import { ChatbotStatus } from '@/utils/constants';
import {
  useMutation,
  useQueryClient,
  useQuery,
  useInfiniteQuery,
  QueryClient,
} from '@tanstack/react-query';


import {
  AskPrompt,
  FetchStatus,
  UpdateChatbot,
  UpdateChatbotBubble,
  MessageFeedback,
  TrainChatbot,
  DeleteChatbot,
} from '../request.types';

//Get chatbot
const fetchChatbots = async (organization_id: string) => {
  const response = await axios.get(
    `${AI_SERVICE_PATH + apiPath.MGET_CHATBOTS}?organization_id=${organization_id}`,
  );
  return response.data;
};

export const useGetChatbots = (organization_id: string) => {
  return useQuery(['chatbots'], () => fetchChatbots(organization_id));
};

const fetchInfiniteChatbot = async (url: string, organization_id: string) => {
  const response = await axios.get(
    url ?? `${AI_SERVICE_PATH}${apiPath.MGET_CHATBOTS}?organization_id=${organization_id}`,
  );
  return response.data;
};

export const useGetInfiniteChatbot = (organization_id: string) => {
  return useInfiniteQuery(
    ['Infinitechatbots', organization_id],
    ({ pageParam }) => fetchInfiniteChatbot(pageParam, organization_id),
    {
      getPreviousPageParam: (firstPage) => firstPage.data.previous ?? undefined,
      getNextPageParam: (lastPage) => lastPage.data.next ?? undefined,
      enabled: !!organization_id,
      refetchOnWindowFocus: false,
    },
  );
};

const fetchPaginateChatbots = async () => {
  const response = await axios.get(`${AI_SERVICE_PATH + apiPath.MGET_CHATBOTS}`);
  return response.data;
};

export const usePaginateChatbots = () => {
  return useQuery(['chatbots'], () => fetchPaginateChatbots(), 
  // {
  //   refetchOnWindowFocus: false,
  // }
);
};

// get chats



//Train chatbot
const postTrainChatbot = async ({ id, data }: TrainChatbot) => {
  const response = await axios.post(AI_SERVICE_PATH + apiPath.CHATBOT + id + apiPath.TRAIN, data);
  return response.data;
};

export const useTrainChatbot = () => {
  const queryClient = useQueryClient();
  return useMutation((data: TrainChatbot) => postTrainChatbot(data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['chatbots']);
      queryClient.invalidateQueries(['chatbot']);
    },
  });
};


//Train chatbot
const postTrainChat = async (data : {chat_title: string, url: string}) => {
  const response = await axios.post(AI_SERVICE_PATH + apiPath.MINITIATE_CHAT, data);
  return response.data;
};

export const useTrainChat = () => {
  const queryClient = useQueryClient();
  return useMutation((data: {chat_title: string, url: string}) => postTrainChat(data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['chatbots']);
      queryClient.invalidateQueries(['chatbot']);
    },
  });
};

//Create chatbot
const postCreateChatbot = async (data: FormData) => {
  const response = await axios.post(AI_SERVICE_PATH + apiPath.CHATBOT, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const useCreateChatbot = () => {
  const queryClient = useQueryClient();

  return useMutation((data: FormData) => postCreateChatbot(data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['chatbots']);
      queryClient.invalidateQueries(['Infinitechatbots']);
    },
  });
};

//Update chatbot
export const putUpdateBot = async ({ data, id }: UpdateChatbot) => {
  const response = await axios.put(`${AI_SERVICE_PATH}${apiPath.CHATBOT}${id}/`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const useUpdateBot = () => {
  const queryClient = useQueryClient();
  return useMutation((data: UpdateChatbot) => putUpdateBot(data), {
    onSuccess: () => {
      return (
        queryClient.invalidateQueries(['chatbots']),
        queryClient.invalidateQueries(['Infinitechatbots']),
        queryClient.invalidateQueries(['chatbot'])
      );
    },
  });
};

//Delete chatbot
export const deleteBot = async ({ id, organization_id }: DeleteChatbot) => {
  const response = await axios.delete(
    `${AI_SERVICE_PATH}${apiPath.CHATBOT}${id}/?organization_id=${organization_id}`,
  );
  return response;
};

export const useDeleteBot = () => {
  const queryClient = useQueryClient();

  return useMutation((data: DeleteChatbot) => deleteBot(data), {
    onSuccess: () => {
      return (
        queryClient.invalidateQueries(['chatbots']),
        queryClient.invalidateQueries(['Infinitechatbots'])
      );
    },
  });
};

//Get spacific chatbot details by id
const fetchChatDetails = async (chat_id: string, history?: boolean) => {
  const response = await axios.get(
    `${AI_SERVICE_PATH}${apiPath.MCHAT_SESSION}/${chat_id}?history=${history}`,
  );
  return response.data;
};

export const useGetChatDetails = (chat_id: string, history?: boolean) => {
  return useQuery(['chatbot', chat_id], () => fetchChatDetails(chat_id, history), {
    refetchOnWindowFocus: false,
  });
};

const askPrompt = async ({ chat_id, prompt }: AskPrompt) => {
  const requestBody = {
    prompt: prompt,
  };

  const response = await axios.post(
    `${AI_SERVICE_PATH}${apiPath.MCHAT_SESSION}/${chat_id}${apiPath.MASK_PROMPT}`,
    requestBody,
  );

  return response.data;
};

export const useAskPrompt = () => {
  const queryClient = useQueryClient();
  return useMutation((prompt: AskPrompt) => askPrompt(prompt), {
    onSuccess: () => {
      queryClient.invalidateQueries(['conversations']);
    },
  });
};

const startSession = async (bot_id: string, org_id: string, session_type?: string) => {
  const requestBody = {};

  const response = await axios.post(
    `${AI_SERVICE_PATH}${apiPath.CHATBOT}${bot_id}${apiPath.START_SESSION}?org_id=${org_id}&session_type=${session_type}`,
    requestBody,
  );
  return response.data;
};

export const useStartSession = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (params: { bot_id: string; org_id: string; session_type?: string }) =>
      startSession(params.bot_id, params.org_id, params?.session_type),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['infiniteAllConversations']);
      },
    },
  );
};

// Get Crawling Links
const fetchCrawlingUrls = async (url: string) => {
  const response = await axios.get(
    `${AI_SERVICE_PATH}${apiPath.CHATBOT}${apiPath.fetch_links}?source_url=${url}`,
  );
  return response.data;
};

export const useGetCrawlingUrls = (url: string,) => {
  return useQuery([url], () => fetchCrawlingUrls(url), {
    enabled: false,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

const postFetchBotStatus = async (data: FetchStatus) => {
  const response = await axios.post(AI_SERVICE_PATH + apiPath.CHATBOT + apiPath.FETCH_STATUS, data);
  return response.data;
};

export const useFetchBotStatus = () => {
  const queryClient = useQueryClient();
  return useMutation((data: FetchStatus) => postFetchBotStatus(data), {
    onSuccess: (data) => {
      const trainedBot = data?.data?.filter((bot: any) => bot.status === ChatbotStatus.TRAINED);
      if (trainedBot?.length) {
        queryClient.invalidateQueries(['chatbot']);
        queryClient.invalidateQueries(['chatbots']);
      }
    },
  });
};

//Get spacific chatbot conversation sessions by id
export const fetchChatbotSessions = async (id: string) => {
  // const response = await axios.get(AI_SERVICE_PATH + apiPath.CHATBOT + id + '/');
  // return response.data;
  return [
    {
      title: 'Anonymous',
      sessionId: 'jdjsaf-32423jk-23423jk-423423',
    },
    {
      title: 'Anonymous',
      sessionId: 'jdjsaf-32423s-23423jk-423423',
    },
    {
      title: 'Anonymous',
      sessionId: 'jdjsaf-3d23jk-23423jk-423423',
    },
    {
      title: 'Anonymous',
      sessionId: 'jdjsq-32423jk-23423jk-423423',
    },
  ];
};

export const useGetChatbotSessions = (id: string) => {
  return useQuery(['chatbot', id], () => fetchChatbotSessions(id));
};
// Get Chatbot Bubble Details
const fetchChatbotBubbleDetails = async (id: string) => {
  const response = await axios.get(
    `${AI_SERVICE_PATH}${apiPath.CHATBOT}${id}${apiPath.CHAT_APPEARANCE}`,
  );
  return response.data;
};

export const useGetChatbotBubbleDetails = (id: string) => {
  return useQuery(['chatbotBubble', id], () => fetchChatbotBubbleDetails(id), {
    refetchOnWindowFocus: false,
  });
};

// Update Chatbot Bubble
const updateChatbotBubble = async ({ data, id }: UpdateChatbotBubble) => {
  const response = await axios.patch(
    `${AI_SERVICE_PATH}${apiPath.CHATBOT}${id}${apiPath.UPDATE_APPEARANCE}`,
    data,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};

export const useUpdateChatbotBubble = () => {
  const queryClient = useQueryClient();
  return useMutation((data: UpdateChatbotBubble) => updateChatbotBubble(data), {
    onSuccess: () => {
      return (
        queryClient.invalidateQueries(['chatbotBubble']),
        queryClient.invalidateQueries(['chatbots']),
        queryClient.invalidateQueries(['Infinitechatbots'])
      );
    },
  });
};

const postMessageFeedback = async (data: MessageFeedback) => {
  const requestBody = { vote: data.vote, questionId: data.questionId, messageId: data.messageId };
  const response = await axios.put(
    `${AI_SERVICE_PATH}${apiPath.CHAT}${data.sessionId}${apiPath.message}${data.messageId}/`,
    requestBody,
  );
  return response.data;
};

export const usePostMessageFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation((data: MessageFeedback) => postMessageFeedback(data), {
    onSuccess: (resp) => {
      return queryClient.invalidateQueries(['infiniteConversations', resp?.data?.session]);
    },
  });
};
