import { acceptedFiles } from '@/utils/constants';
import * as yup from 'yup';

import { useI18n } from '@/i18n/client';

const acceptedFormats = acceptedFiles.map((file) => file.format);

export const useUpdateBotFormSchema = () => {
  const t = useI18n(); // Assuming useI18n() provides translation function

  const fileValidation = yup
    .mixed()
    .test('required', t('please_select_file'), (value: any) => {
      return value?.selectedFiles.length > 0;
    })
    .required(t('please_choose_file'));

  const updateBotFormSchema = yup.object().shape({
    name: yup
      .string()
      .required(t('name_required'))
      .max(32, t('name_max_error', { max: '32' })),
    description: yup
      .string()
      .optional()
      .trim()
      .required('Please enter a description')
      .max(150, t('description_max_error')),
    files: yup.mixed().optional(),
    text: yup.string().optional(),
  });

  const fileValidationSchema = yup.object().shape({
    files: yup
      .array()
      .of(
        yup.mixed().test('fileType', t('invalid_file_format'), (value) => {
          if (value instanceof File) {
            const { name: fileName, type: fileType } = value;
            const isValidType = acceptedFormats.includes(fileType);
            return (
              isValidType ||
              new yup.ValidationError(t('invalid_format', { name: fileName }), value, 'fileType')
            );
          }
          return true;
        }),
      )
      .required(t('please_choose_file')),
  });

  return { updateBotFormSchema, fileValidationSchema, fileValidation };
};
