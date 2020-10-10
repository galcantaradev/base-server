import { FieldError } from '../common';
import { ValidationError } from 'yup';

export const yupErrorToFieldErrors = (error: ValidationError): FieldError[] => {
  return error.inner.map(ve => {
    return {
      field: ve.path,
      message: ve.errors[0] || ''
    };
  });
};
