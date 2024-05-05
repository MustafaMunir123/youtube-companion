import { AI_SERVICE_PATH, apiPath, SEED_SERVICE_PATH } from '@/utils/api.endpoints';
import { axiosClient as axios } from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';

const fetchUserPermissions = async (organizationId: string) => {
  const response = await axios.get(AI_SERVICE_PATH + apiPath.PERMISSIONS);
  return response.data;
};

export const useUserPermissions = (organizationId: string) => {
  return useQuery(['Permissions'], () => fetchUserPermissions(organizationId), {
    enabled: !!organizationId,
  });
};
