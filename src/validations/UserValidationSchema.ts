import * as Yup from 'yup';

export const register = Yup.object().shape({
  name: Yup.string().required('name is required').trim(),
  email: Yup.string().email('email is invalid').required('email is required'),
  password: Yup.string()
    .required('password is required')
    .min(7, 'password must be greater than 6'),
  passwordConfirmation: Yup.string().oneOf(
    [Yup.ref('password')],
    'passwords must match'
  )
});

export const profile = Yup.object().shape({
  name: Yup.string().required('name is required').trim(),
  password: Yup.string()
    .nullable()
    .test('password', 'password must be greater than 6', value => {
      if (value) {
        return value.length > 6;
      }

      return true;
    })
});

export const login = Yup.object().shape({
  email: Yup.string().email('email is invalid').required('email is required'),
  password: Yup.string().required('password is required')
});

export const changePassword = Yup.object().shape({
  password: Yup.string()
    .required('password is required')
    .min(7, 'password must be greater than 6'),
  passwordConfirmation: Yup.string().oneOf(
    [Yup.ref('password')],
    'passwords must match'
  )
});
