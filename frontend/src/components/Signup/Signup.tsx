'use client';

import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { useRouter } from 'next/navigation';

import { isAuthenticatedRequest, orgInfo, userInfo } from '@/atoms/auth.atom';
import {
  useResendVerificationEmail,
  useSignInWithGoogle,
  useUserSignup,
  usePreUserSignup,
} from '@/services/auth/auth.service';
import { Button, Input, AuthHeader } from '@/ui-components';
import { SEED_SERVICE_PATH, apiPath } from '@/utils/api.endpoints';
import { EMAIL_ALREADY_IN_USE, RESEND_EMAIL_EXTENDED_TIME, ErrorMessages } from '@/utils/constants';
import { protectedRoutes, publicRoutes } from '@/utils/routes';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSetAtom } from 'jotai';

import { AuthMemberFooter, FormInput } from '@/components';

import { GoogleSigninButton } from '../GoogleSigninButton/GoogleSigninButton';
import { SignupFormValues } from './Signup.types';
import { useSignupSchema } from './useSignupSchema';

import { useI18n } from '@/i18n/client';

import { LngParam } from '@/types';

export function Signup({ lng }: LngParam) {
  const [isLoading, setIsLoading] = useState(false);
  const { signupSchema } = useSignupSchema();
  const [isResend, setIsResend] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const t = useI18n();
  const setOrgInfo = useSetAtom(orgInfo);
  const setUserInfo = useSetAtom(userInfo);
  const { replace, push } = useRouter();
  const [countdown, setCountdown] = useState(RESEND_EMAIL_EXTENDED_TIME);
  const [isSending, setIsSending] = useState(false);
  const [signupData, setSignupData] = useState<SignupFormValues>();

  const signupMutation = useUserSignup();
  const preSignupMutation = usePreUserSignup();
  const { mutateAsync: signInMutateAsync } = useSignInWithGoogle();
  const setIsAuthenticated = useSetAtom(isAuthenticatedRequest);
  const resendEmail = useResendVerificationEmail();

  const handleGoogleClick = () => {
    push(`${SEED_SERVICE_PATH}${apiPath.GOOGLE_AUTH}`);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    let timer: NodeJS.Timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown: number) => prevCountdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsSending(false);
    }
    return () => {
      clearInterval(timer);
    };
  }, [countdown]);

  const handleResend = async () => {
    if (!signupData) {
      toast.error(t('email_resend_fail'));
    } else {
      setIsResend(true);
      try {
        const resend = await resendEmail.mutateAsync(signupData.email);
        if (resend) {
          toast.success(t('email_resend_success', { email: signupData.email }));
          setIsSending(true);
        } else {
          toast.error(t('email_resend_fail'));
          setIsSending(false);
        }
      } catch (error: any) {
        setIsResend(false);
        setIsSending(false);
        toast.error(t('email_resend_fail'));
      } finally {
        setIsResend(false);
        setCountdown(RESEND_EMAIL_EXTENDED_TIME);
      }
    }
  };

  const onSubmit: SubmitHandler<SignupFormValues> = async (data) => {
    setIsLoading(true);
    try {
      const response = await preSignupMutation.mutateAsync({
        name: data.name.trim(),
        email: data.email,
      });

      try {
        const user = await signupMutation.mutateAsync({
          name: data.name.trim(),
          email: data.email,
          password: data.password,
        });
        setSignupData(data);
        toast.success(t('verify_signin'));
        setIsSending(true);
        setCountdown(RESEND_EMAIL_EXTENDED_TIME);
        setVisible(true);
      } catch (error: any) {
        setIsLoading(true);
        if (error.code.split('/')[1] === EMAIL_ALREADY_IN_USE) {
          toast.error(t('email_already_in_use'));
        } else {
          toast.error(t('not_found_error'));
        }
      }
    } catch (error: any) {
      if (
        error?.response?.data?.message ===
        'The resource you are trying to create is already available'
      ) {
        toast.error(t(ErrorMessages[error.response.data.message as keyof typeof ErrorMessages]));
      } else {
        toast.error(error?.response?.data?.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      const response = await signInMutateAsync();

      setUserInfo(response.data);
      setIsAuthenticated(true);
      // if (!response?.data?.organization) {
      //   push(protectedRoutes.YOUTUBE_COMPANION);
      // } else {
      //   setOrgInfo(response?.data?.organization);
      //   push(protectedRoutes.YOUTUBE_COMPANION);
      // }
      push(protectedRoutes.CREATE_CHAT);

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

  return (
    <>
      <AuthHeader title={t('welcome_to') + ' Chatwards!'} subtitle={t('create_organization')} />
      <div className="flex flex-col gap-y-4 w-full">
        <form className="flex flex-col gap-y-4" onSubmit={handleSubmit(onSubmit)}>
          <FormInput<string>
            control={control}
            names={['name', 'email', 'password']} // Pass an array of field names
            render={(inputPropsList) => {
              // Destructuring the inputPropsList array
              const [nameProps, emailProps, passwordProps] = inputPropsList;
              return (
                <>
                  <Input
                    variant="primary"
                    label={t('name')}
                    placeholder={t('name')}
                    type="text"
                    required
                    errorMessage={nameProps.error}
                    disabled={visible}
                    {...nameProps} // Use object spread to pass props directly
                  />

                  <Input
                    variant="primary"
                    label={t('email')}
                    placeholder={t('email')}
                    type="email"
                    required
                    errorMessage={emailProps.error}
                    disabled={visible}
                    {...emailProps}
                  />
                  <Input
                    variant="primary"
                    type="password"
                    label={t('password')}
                    placeholder={t('create_password')}
                    required
                    errorMessage={passwordProps.error}
                    disabled={visible}
                    {...passwordProps}
                  />
                </>
              );
            }}
          />
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            size="lg"
            disabled={visible}
          >
            {t('sign_up')}
          </Button>
        </form>
        <div className="flex flex-col gap-y-2 w-full">
          <GoogleSigninButton isLoading={isGoogleLoading} onClick={handleSignIn} />
        </div>
        <AuthMemberFooter
          text={t('existing_member')}
          link={t('sign_in_now')}
          redirect={publicRoutes.AUTH_SIGNIN}
          lng={lng}
        />
      </div>

      {visible && (
        <div className={`flex items-center flex-col mt-3`}>
          <p className="text-xs mb-2">{t('trouble_getting_email')}</p>
          {isSending ? (
            <span className="mb-2 text-xs text-primary-500">
              {t('resend_reset_password_email', { countdown: countdown })}
            </span>
          ) : (
            <Button
              variant="primary"
              size="lg"
              type="button"
              onClick={handleResend}
              disabled={isSending}
              isLoading={isResend}
            >
              {t('resend')}
            </Button>
          )}
        </div>
      )}
    </>
  );
}
