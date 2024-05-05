import { AI_SERVICE_PATH, apiPath, SEED_SERVICE_PATH } from '@/utils/api.endpoints';
import { axiosClient as axios } from '@/utils/axiosInstance';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';

import { DeleteUser, UpdateUser } from '../request.types';

//Get users List
const fetchUsers = async (query: string, params: any) => {
  const response = await axios.get(`${AI_SERVICE_PATH + apiPath.USERS}${query}`, params);
  return response.data;
};

export const useFetchUsers = (query: string, params: any) => {
  return useQuery(['users', query], () => fetchUsers(query, params), {
    refetchOnWindowFocus: false,
  });
};

//Get roles List
const fetchRoles = async () => {
  const response = await axios.get(AI_SERVICE_PATH + apiPath.ROLES);
  return response.data;
};

export const useFetchRoles = () => {
  return useQuery(['Roles'], () => fetchRoles());
};

// Invite User
const postInviteUser = async (InviteUserData: any) => {
  const response = await axios.post(AI_SERVICE_PATH + apiPath.INVITE_USER, InviteUserData);
  return response.data;
};

export const useInviteUser = () => {
  const queryClient = useQueryClient();

  return useMutation((inviteUser: any) => postInviteUser(inviteUser), {
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
  });
};

//Delete User
export const deleteUser = async (data: DeleteUser) => {
  const response = await axios.delete(AI_SERVICE_PATH + apiPath.USER + `${data.userId}/`);
  return response.data;
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation((data: DeleteUser) => deleteUser(data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
  });
};

// update user

export const updateUser = async ({ data }: UpdateUser) => {
  const response = await axios.put(AI_SERVICE_PATH + apiPath.USER + `${data.id}/`, {
    role: data.role,
  });
  return response.data;
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation((data: UpdateUser) => updateUser(data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
  });
};
