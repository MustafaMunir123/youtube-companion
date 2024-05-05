import * as yup from 'yup';

export const updateUserSchema = yup
  .object()
  .shape({
    role: yup.string().required('Role is required'),
  })
  .required();
