'use client';

import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import { useRouter, useSearchParams } from 'next/navigation';

import { userInfo, orgInfo, isAuthenticatedRequest, userConfigs } from '@/atoms/auth.atom';
import {
  useSignInWithGoogle,
  useUserLogin,
  useGetUserConfigs,
  useValidateTenant,
} from '@/services/auth/auth.service';
import { Button, Input, AuthHeader } from '@/ui-components';
import { SEED_SERVICE_PATH, apiPath } from '@/utils/api.endpoints';
import {
  ErrorMessages,
  INVALID_CREDENTIALS,
  StatusCodes,
  TOO_MANY_FAILED_ATTEMPTS,
} from '@/utils/constants';
import { publicRoutes, protectedRoutes } from '@/utils/routes';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAtomValue, useSetAtom } from 'jotai';

import { AuthMemberFooter, FormInput } from '@/components';

import { GoogleSigninButton } from '../GoogleSigninButton/GoogleSigninButton';
import { SigninFormValues } from './Signin.types';
import { useSigninSchema } from './useSigninSchema';
import { useI18n } from '@/i18n/client';


export function Signin() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { signinSchema } = useSigninSchema();
  const { push, replace } = useRouter();
  const t = useI18n();

  const setUserInfo = useSetAtom(userInfo);
  const setIsAuthenticated = useSetAtom(isAuthenticatedRequest);
  const setUserConfigs = useSetAtom(userConfigs);

  const { mutateAsync: signInMutateAsync } = useSignInWithGoogle();

  const signinMutation = useUserLogin();
  const validateTenant = useValidateTenant();
  const searchParams = useSearchParams();
  const continueUrl = searchParams.get('continue');
  const userConfigsRefetch = useGetUserConfigs();

  const handleGoogleClick = () => {
    push(`${SEED_SERVICE_PATH}${apiPath.GOOGLE_AUTH}`);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormValues>({
    resolver: yupResolver(signinSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });


  // const onSubmit: SubmitHandler<SigninFormValues> = async (data) => {
  //   setIsLoading(true);
  //   try {
  //     let user;
  //     const tenantValidate = await validateTenant.mutateAsync(encodeURIComponent(data.email));

  //     if (tenantValidate?.status_code === StatusCodes.SUCCESS) {
  //       user = await signinMutation.mutateAsync({
  //         email: data.email,
  //         password: data.password,
  //       });
  //     }

  //     if (user === null) {
  //       toast.error('user_email_not_verified');
  //       return;
  //     }

  //     setUserInfo(user?.data);
  //     setIsAuthenticated(true);

  //     if (!user?.data?.organization) {
  //       setOrgInfo({});
  //       push(protectedRoutes.ORG_CREATE_ORGNIZATION);
  //     } else {
  //       setOrgInfo(user?.data?.organization);
  //       continueUrl ? push(continueUrl) : push(protectedRoutes.YOUR_BOTS);
  //       const userConfigData = await userConfigsRefetch.mutateAsync(user?.data?.organization?.id);
  //       setUserConfigs(userConfigData?.data);
  //     }
  //     toast.success('signin_successfully');
  //   } catch (error: any) {
  //     setIsLoading(false);
  //     if (error.response?.status === 404) {
  //       toast.error(ErrorMessages[error.response.data.message as keyof typeof ErrorMessages]);
  //     } else if (error?.response?.status === 403) {
  //       error.response.data.message in ErrorMessages
  //         ? ErrorMessages[error.response.data.message as keyof typeof ErrorMessages]
  //         : toast.error('invalid_credentials');
  //     } else if (error.code.split('/')[1] === INVALID_CREDENTIALS ){
  //       setErrorMessage('invalid_login_credentials');
  //     } else if (error.code.split('/')[1] === TOO_MANY_FAILED_ATTEMPTS) {
  //       setErrorMessage('too_many_failed_attempts');
  //     } else {
  //       toast.error('not_found_error');
  //     }
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const handleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      const response = await signInMutateAsync();
      console.log("google signin response::==", response);
      setUserInfo(response.data);
      setIsAuthenticated(true);
      // if (!response?.data?.organization) {
      //   push(protectedRoutes.ORG_CREATE_ORGNIZATION);
      // } else {
      //   setOrgInfo(response?.data?.organization);
      //   continueUrl ? push(continueUrl) : push(protectedRoutes.YOUR_BOTS);
      //   const userConfigData = await userConfigsRefetch.mutateAsync(
      //     response?.data?.organization?.id,
      //   );
      //   setUserConfigs(userConfigData?.data);
      // }
      // push(protectedRoutes.YOUTUBE_COMPANION)
      push(protectedRoutes.CREATE_CHAT)

      toast.success(t('signin_successfully'));
    } catch (error: any) {
      if (error?.response?.data?.status_code === 403) {
        toast.error(error?.response?.data?.message);
      } else if (error.code === 'auth/popup-closed-by-user') {
        toast.success(t('google_sign_in_cancelled')); // Display an informative message
      } else {
        toast.error(t('something_went_wrong'));
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <>
      <AuthHeader title={t('signin_to') + ' Youtube Study Companion'} />
      <div className="flex flex-col gap-y-4 w-full">
        <div className="flex flex-col gap-y-2 w-full">
          <GoogleSigninButton isLoading={isGoogleLoading} onClick={handleSignIn} />
        </div>
        {/* <AuthMemberFooter
          text={'not_a_member'}
          link={'sign_up_now'}
          redirect={publicRoutes.AUTH_SIGNUP}
        /> */}
      </div>
    </>
  );
}
