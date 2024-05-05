import { apiPath, AI_SERVICE_PATH } from '@/utils/api.endpoints';
import { axiosClient as axios } from '@/utils/axiosInstance';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';

const fetchWorkflows = async (bot_id: string) => {
  const response = await axios.get(
    `${AI_SERVICE_PATH + apiPath.CHATBOT}${bot_id}${apiPath.WORKFLOWS}`,
  );
  return response.data;
};

export const useGetWorkflows = (bot_id: string) => {
  return useQuery(['workflows', bot_id], () => fetchWorkflows(bot_id), {
    enabled: !!bot_id,
    refetchOnWindowFocus: false,
    cacheTime: 0,
    staleTime: 0,
  });
};

const createWorkflow = async (bot_id: string, data: object) => {
  const response = await axios.post(
    `${AI_SERVICE_PATH + apiPath.CHATBOT}${bot_id}${apiPath.WORKFLOWS}`,
    data,
  );
  return response.data;
};

export const useCreateWorkflow = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (data: { bot_id: string; data: object }) => createWorkflow(data.bot_id, data.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['workflows']);
      },
    },
  );
};

const updateWorkflow = async (bot_id: string, workflow_id: string, data: object) => {
  const response = await axios.put(
    `${AI_SERVICE_PATH + apiPath.CHATBOT}${bot_id}${apiPath.WORKFLOWS}${workflow_id}`,
    data,
  );
  return response.data;
};

export const useUpdateWorkflow = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (data: { bot_id: string; workflow_id: string; data: object }) =>
      updateWorkflow(data.bot_id, data.workflow_id, data.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['workflows']);
      },
    },
  );
};
