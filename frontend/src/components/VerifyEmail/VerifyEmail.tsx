'use client';

import { useEffect, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { useVerifyUserEmail } from '@/services/auth/auth.service';
import { Button, AuthHeader } from '@/ui-components';
import { LoadingSpinner } from '@/ui-components/LoadingSpinner/LoadingSpinner';
import { publicRoutes } from '@/utils/routes';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

import { useI18n } from '@/i18n/client';

export function VerifyEmail() {
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const t = useI18n();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('oobCode') ?? '';
  const email = searchParams.get('email') ?? '';

  const verifyEmail = useVerifyUserEmail();

  useEffect(() => {
    setIsLoading(true);
    const verifyCode = async () => {
      const resp = await verifyEmail.mutateAsync(code);
      if (resp?.isSuccess) {
        setIsEmailVerified(resp?.verified);
      } else {
        setIsEmailVerified(false);
      }
      setIsLoading(false);
    };

    verifyCode();
  }, [code]);

  if (isLoading && !isEmailVerified) {
    return (
      <>
        <LoadingSpinner spinnerSize="lg" />
      </>
    );
  } else if (isEmailVerified && !isLoading) {
    return (
      <>
        <AuthHeader title={t('email_verified')} />{' '}
        <CheckCircleIcon color="green" className="h-10 w-10" />
        <p>{t('email_verified_message', { email: email })}</p>
        <Button variant="tertiary" type="button" onClick={() => replace(publicRoutes.AUTH_SIGNIN)}>
          {t('back_signin')}
        </Button>
      </>
    );
  } else {
    return (
      <>
        <AuthHeader title={t('email_not_verified')} subtitle={t('verify_email_desc')} />
        <XCircleIcon color="red" className="h-10 w-10" />
        <p className="text-neutral-800 font-regular text-base">
          {t('email_not_verified_message', { email: email })}
        </p>
        <Button variant="tertiary" type="button" onClick={() => replace(publicRoutes.AUTH_SIGNIN)}>
          {t('back_signin')}
        </Button>
      </>
    );
  }
}
