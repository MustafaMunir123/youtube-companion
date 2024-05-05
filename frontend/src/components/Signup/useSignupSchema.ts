import { EMAIL_REGEX } from '@/utils/constants';
import * as yup from 'yup';

import { useI18n } from '@/i18n/client';

export const useSignupSchema = () => {
  const t = useI18n(); // Assuming useI18n() provides translation function

  const signupSchema = yup.object().shape({
    name: yup
      .string()
      .required(t('name_required'))
      .matches(/.*[a-zA-Z].*/, t('name_invalid'))
      .max(64, t('name_max_error', { max: '64' })),
    email: yup
      .string()
      .required(t('email_required'))
      .matches(EMAIL_REGEX, t('invalid_email_format')),
    password: yup
      .string()
      .required(t('no_password_provided'))
      .min(8, t('password_min_max_error'))
      .max(64, t('password_min_max_error'))
      .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_])/, t('password_validation_error')),
  });

  return { signupSchema };
};
