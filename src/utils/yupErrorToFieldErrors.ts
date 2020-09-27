import { ValidationError } from 'yup';

import { FieldError } from '../common';

export const yupErrorToFieldErrors = (error: ValidationError): FieldError[] => {
  return error.inner.map(ve => {
    return {
      field: ve.path,
      message: ve.errors[0] || ''
    };
  });
};
