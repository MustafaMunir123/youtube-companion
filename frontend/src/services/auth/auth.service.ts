import { apiPath, SEED_SERVICE_PATH, AI_SERVICE_PATH } from '@/utils/api.endpoints';
import { axiosClient as axios } from '@/utils/axiosInstance';
import { INVALID_CREDENTIALS, INVALID_TOKEN } from '@/utils/constants';
import { auth, provider } from '@/utils/firebase-config';
import { sleep } from '@/utils/helpers';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
  applyActionCode,
  updatePassword,
  reauthenticateWithCredential,
  User,
  AuthCredential,
} from 'firebase/auth';

import {
  ResetUserPassword,
  UserForgotPassword,
  UserLogin,
  UserSignup,
  SignupUserDetail,
} from '../request.types';
import { UserLoginType } from './auth.types';

import { ApiResponse } from '@/types';

const postUserLogin = async (data: UserLogin) => {
  const response = await signInWithEmailAndPassword(auth, data.email, data.password);
  const idToken = await response.user.getIdToken();
  // const setTokenId = useSetAtom(tokenId);
  // setTokenId(idToken);

  if (!response.user.emailVerified) {
    return null;
  }
  // just added for dev purpose to synchronize the backend clock
  await sleep(2500);
  return await postUserManualSignin(idToken);
};

const sendForgotPasswordEmail = async (data: UserForgotPassword) => {
  return await sendPasswordResetEmail(auth, data.email);
};

const verifyUserEmail = async (code: string) => {
  try {
    await applyActionCode(auth, code);
    return {
      isSuccess: true,
      verified: true,
    };
  } catch (error) {
    return {
      isSuccess: false,
      verified: false,
    };
  }
};

const verifyResetPasswordCode = async (code: string) => {
  try {
    return await verifyPasswordResetCode(auth, code);
  } catch (error) {
    return INVALID_TOKEN;
  }
};

const resetUserPassword = async (data: ResetUserPassword) => {
  return await confirmPasswordReset(auth, data.code, data.newPassword);
};

const resendEmailVerification = async (email: string) => {
  if (auth?.currentUser) {
    await sendEmailVerification(auth?.currentUser, {
      url: `${process.env.NEXT_PUBLIC_WEB_URL}/?email=${encodeURIComponent(email)}`,
    });
    return true;
  }
  return false;
};

export const useUserLogin = () => {
  const queryClient = useQueryClient();
  return useMutation((data: UserLogin) => postUserLogin(data), {
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

export const useVerifyUserEmail = () => {
  return useMutation((code: string) => verifyUserEmail(code));
};

export const useUserForgotPasswordEmail = () => {
  const queryClient = useQueryClient();
  return useMutation((data: UserForgotPassword) => sendForgotPasswordEmail(data), {
    onSuccess: () => {
      queryClient.clear();
    },
    retry: false,
  });
};

export const useVerifyPasswordResetCode = () => {
  const queryClient = useQueryClient();
  return useMutation((code: string) => verifyResetPasswordCode(code), {
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

export const useConfirmPasswordReset = () => {
  const queryClient = useQueryClient();
  return useMutation((data: ResetUserPassword) => resetUserPassword(data), {
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

export const useResendVerificationEmail = () => {
  return useMutation((email: string) => resendEmailVerification(email));
};

const postUserManualSignin = async (idToken?: string) => {
  const response = await axios.post(
    AI_SERVICE_PATH + apiPath.MSIGN_IN,
    {},
    { headers: { Authorization: `Bearer ${idToken}` } },
  );
  return response.data;
};

const postUserSignup = async (data: UserSignup) => {
  const response = await createUserWithEmailAndPassword(auth, data.email, data.password);
  const signupResponse = await updateProfile(response.user, { displayName: data.name });
  await sendEmailVerification(response.user, {
    url: `${process.env.NEXT_PUBLIC_WEB_URL}/?email=${encodeURIComponent(
      response.user.email ?? '',
    )}`,
  });
  return response.user;
};

export const useUserSignup = () => {
  return useMutation((data: UserSignup) => postUserSignup(data), {});
};

const postUserSignout = async () => {
  const response = await axios.post(AI_SERVICE_PATH + apiPath.SIGN_OUT);
  return response.data;
};

export const useUserSignout = () => {
  return useMutation(() => postUserSignout(), {});
};

const getIsUserAuthenticated = async () => {
  // const response = await axios.get(SEED_SERVICE_PATH + apiPath.IS_AUTHENTICATED);
  // TODO MAKE THIS RIGHT AND KEEP IT ASYNC AWAIT AFTER MUSTAFA INTEGRATION
  return await postUserManualSignin();
};

export const useIsUserAuthenticated = () => {
  return useQuery([], () => getIsUserAuthenticated());
};


const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider);
  console.log("result", result)

  // just added for dev purpose to synchronize the backend clock
  await sleep(2500);

  return await postUserSignin(result);
};

export const useSignInWithGoogle = () => {
  const queryClient = useQueryClient();
  return useMutation(signInWithGoogle, {
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

const postUserSignin = async (result: any): Promise<ApiResponse<UserLoginType>> => {
  localStorage.setItem(
    "token",
    result._tokenResponse.idToken
  );
  const response = await axios.post(
    AI_SERVICE_PATH + apiPath.MSIGN_IN,
    result._tokenResponse,
    { headers: { Authorization: `Bearer ${result._tokenResponse.idToken}` } },
  );

  return response.data;
};

const preUserSignup = async (data: SignupUserDetail) => {
  const response = await axios.post(AI_SERVICE_PATH + apiPath.USER_SIGN_UP, data);
  return response.data;
};

export const usePreUserSignup = () => {
  const queryClient = useQueryClient();
  return useMutation((data: SignupUserDetail) => preUserSignup(data), {
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

export const useGetUserConfigs = () => {
  return useMutation((id: string) => fetchUserConfigs(id));
};

const fetchUserConfigs = async (id: string) => {
  const response = await axios.get(
    `${AI_SERVICE_PATH + apiPath.USER_CONFIGS}?organization_id=${id}`,
  );
  return response.data;
};

export const changePassword = async (newPassword: string) => {
  if (auth?.currentUser) {
    const result = await updatePassword(auth.currentUser, newPassword);
    return result;
  }
};
export const reAuthWithCred = async (credential: AuthCredential) => {
  if (auth?.currentUser) {
    // try {
    const response = await reauthenticateWithCredential(auth?.currentUser, credential);
    return response;
    // } catch (error) {
    //   throw INVALID_CREDENTIALS;
    // }
  }
};

const fetchUserUpdateConfigs = async () => {
  const response = await axios.get(`${AI_SERVICE_PATH}${apiPath.USER_UPDATE_CONFIGS}`);
  return response.data;
};

export const useFetchUserUpdateConfigs = () => {
  return useQuery(['UserUpdateConfigs'], () => fetchUserUpdateConfigs(), {
    refetchOnWindowFocus: false,
  });
};

const fetchUserAccountDetails = async (userId: string) => {
  const response = await axios.get(`${AI_SERVICE_PATH}${apiPath.USER}${userId}/`);
  return response.data;
};

// export const useFetchUserAccountDetails = (userId: string) => {
//   return useQuery(['UserAccountDetails', userId], () => fetchUserAccountDetails(userId), {
//     refetchOnWindowFocus: false,
//     enabled: !!userId,
//   });
// };

const updateAccount = async (data: { userId: string; body: FormData }) => {
  const response = await axios.patch(
    `${AI_SERVICE_PATH}${apiPath.USER}${data.userId}/`,
    data.body,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation((data: { userId: string; body: FormData }) => updateAccount(data), {
    onSuccess: () => {
      return queryClient.invalidateQueries(['UserAccountDetails']);
    },
  });
};
export const useValidateTenant = () => {
  return useMutation((email: string) => validateTenant(email));
};

const validateTenant = async (email: string) => {
  const response = await axios.get(`${AI_SERVICE_PATH}${apiPath.VALIDATE_TENANT}?email=${email}`);
  return response.data;
};
