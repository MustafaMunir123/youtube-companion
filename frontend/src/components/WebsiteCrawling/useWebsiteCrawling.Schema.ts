import * as yup from 'yup';

import { useI18n } from '@/i18n/client';

export const useWebsiteCrawlingSchema = () => {
  const t = useI18n();

  const websiteCrawlingSchema = yup.object().shape({
    url: yup.string().url(t('invaliad_url_format')).required(t('URL_is_required')),
  });

  return { websiteCrawlingSchema };
};
