import { AI_SERVICE_PATH, apiPath, SEED_SERVICE_PATH } from '@/utils/api.endpoints';
import { axiosClient as axios } from '@/utils/axiosInstance';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { AddAddOn, AddSubscription, CreateOrg, JoinOrg } from '../request.types';

const postCreateOrg = async (data: CreateOrg) => {
  const response = await axios.post(AI_SERVICE_PATH + apiPath.CREATE_ORG, data);
  return response.data;
};

const editOrgName = async (data: CreateOrg) => {
  const response = await axios.patch(AI_SERVICE_PATH + apiPath.EDIT_ORG, data);
  return response.data;
};

export const useCreateOrg = () => {
  return useMutation((data: CreateOrg) => postCreateOrg(data), {});
};

export const useEditOrg = () => {
  return useMutation((data: CreateOrg) => editOrgName(data), {});
};

const postJoinOrg = async (data: JoinOrg) => {
  const response = await axios.post(AI_SERVICE_PATH + apiPath.JOIN_ORG, data);
  return response.data;
};

export const useJoinOrg = () => {
  return useMutation((data: JoinOrg) => postJoinOrg(data), {});
};

// SUBSCRIPTIONS AND ADD-ONS APIS //

//Get all available subscriptions
const fetchAllSubscriptions = async () => {
  const response = await axios.get(`${AI_SERVICE_PATH + apiPath.SUBSCRIPTIONS}`);
  return response.data;
};

export const useFetchAllSubscriptions = () => {
  return useQuery(['AllSubscriptions'], () => fetchAllSubscriptions(), {
    refetchOnWindowFocus: false,
  });
};

//Get subscriptions of an organization
const fetchOrgSubscriptions = async (query: string) => {
  const response = await axios.get(`${AI_SERVICE_PATH + apiPath.ORG_SUBSCRIPTION}${query}`);
  return response.data;
};

export const useFetchOrgSubscriptions = (org_id: string) => {
  const query = `?org_id=${org_id}`;
  return useQuery(['OrgSubscriptions'], () => fetchOrgSubscriptions(query), {
    refetchOnWindowFocus: false,
  });
};

//add subscription for an organization
const addSubscriptionForOrg = async (data: AddSubscription) => {
  const response = await axios.post(`${AI_SERVICE_PATH}${apiPath.ORG_SUBSCRIPTION}`, data);
  return response.data;
};

export const useAddSubscriptionForOrg = () => {
  const queryClient = useQueryClient();

  return useMutation(({ data }: { data: AddSubscription }) => addSubscriptionForOrg(data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['OrgSubscriptions']);
      queryClient.invalidateQueries(['OrgAddOns']);
      queryClient.invalidateQueries(['OrgConversations']);
    },
  });
};

//Get all available add-ons
const fetchAllAddOns = async () => {
  const response = await axios.get(`${AI_SERVICE_PATH + apiPath.ADD_ONS}`);
  return response.data;
};

export const useFetchAllAddOns = () => {
  return useQuery(['AllAddOns'], () => fetchAllAddOns(), {
    refetchOnWindowFocus: false,
  });
};

//Get org  add-ons
const fetchOrgAddOns = async (query: string) => {
  const response = await axios.get(`${AI_SERVICE_PATH + apiPath.ORG_ADDONS}${query}`);
  return response.data;
};

export const useFetchOrgAddOns = (orgId: string) => {
  const query = `?org_id=${orgId}`;
  return useQuery(['OrgAddOns'], () => fetchOrgAddOns(query), {
    refetchOnWindowFocus: false,
  });
};

//add add-ons for an organization
const addAddOnsForOrg = async (data: AddAddOn) => {
  const response = await axios.post(`${AI_SERVICE_PATH}${apiPath.ORG_ADDONS}`, data);
  return response.data;
};

export const useAddAddOnsForOrg = () => {
  const queryClient = useQueryClient();

  return useMutation(({ data }: { data: AddAddOn }) => addAddOnsForOrg(data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['OrgAddOns']);
      queryClient.invalidateQueries(['OrgSubscriptions']);
      queryClient.invalidateQueries(['OrgConversations']);
    },
  });
};

//Get org  conversations
const fetchOrgConversations = async (orgId: string) => {
  const response = await axios.get(
    `${AI_SERVICE_PATH + apiPath.ORG_CONVERSATIONS}?organization_id=${orgId}`,
  );
  return response.data;
};

export const useFetchOrgConversations = (orgId: string) => {
  return useQuery(['OrgConversations'], () => fetchOrgConversations(orgId), {
    refetchOnWindowFocus: false,
  });
};

//Get org  conversations
const fetchOrgChatbotsCharacters = async (orgId: string) => {
  const response = await axios.get(
    `${AI_SERVICE_PATH + apiPath.ORG_CHATBOTS_CHARACTERS}?organization_id=${orgId}`,
  );
  return response.data;
};

export const useFetchOrgChatbotsCharacters = (orgId: string) => {
  return useQuery(['OrgChatbotsCharacters'], () => fetchOrgChatbotsCharacters(orgId), {
    refetchOnWindowFocus: false,
  });
};
