import { AI_SERVICE_PATH, apiPath } from '@/utils/api.endpoints';
import { axiosClient as axios } from '@/utils/axiosInstance';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

//get WhatsApp credentials for chatbot
const fetchwhatsAppCreds = async (id: string) => {
  const response = await axios.get(`${AI_SERVICE_PATH}${apiPath.CHATBOT}${id}/get-creds/`);
  return response.data;
};

export const useGetWhatsAppCreds = (id: string) => {
  return useQuery(['whatsappCreds', id], () => fetchwhatsAppCreds(id), {
    refetchOnWindowFocus: false,
  });
};

//Create whatsapp integration
const createWhatsAppIntegration = async (params: { id: string; data: any }) => {
  const response = await axios.post(
    `${AI_SERVICE_PATH}${apiPath.CHATBOT}${params.id}/waba-info/`,
    params.data,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

export const useCreatewhatsAppIntegration = () => {
  const queryClient = useQueryClient();

  return useMutation((params: { id: string; data: any }) => createWhatsAppIntegration(params), {
    onSuccess: () => {
      queryClient.invalidateQueries(['whatsAppIntegration']);
    },
  });
};

const editWhatsAppIntegration = async (params: { id: string; data: any }) => {
  const response = await axios.patch(
    `${AI_SERVICE_PATH}${apiPath.CHATBOT}${params.id}/waba-info/`,
    params.data,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

export const useEditwhatsAppIntegration = () => {
  const queryClient = useQueryClient();

  return useMutation((params: { id: string; data: any }) => editWhatsAppIntegration(params), {
    onSuccess: () => {
      queryClient.invalidateQueries(['whatsAppIntegration']);
    },
  });
};

const deleteWhatsAppIntegration = async (id: string) => {
  const response = await axios.delete(`${AI_SERVICE_PATH}${apiPath.CHATBOT}${id}/waba-info/`);
  return response.data;
};

export const useDeletewhatsAppIntegration = () => {
  const queryClient = useQueryClient();

  return useMutation((id: string) => deleteWhatsAppIntegration(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(['whatsAppIntegration']);
    },
  });
};

//get WhatsApp integration details
const fetchWhatsAppIntegrationDetails = async (id: string) => {
  const response = await axios.get(`${AI_SERVICE_PATH}${apiPath.CHATBOT}${id}/waba-info/`);
  return response.data;
};

export const useGetWhatsAppIntegration = (id: string) => {
  return useQuery(['whatsAppIntegration', id], () => fetchWhatsAppIntegrationDetails(id), {
    refetchOnWindowFocus: false,
  });
};
