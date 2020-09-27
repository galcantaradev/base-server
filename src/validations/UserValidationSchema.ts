import * as Yup from 'yup';

export const register = Yup.object().shape({
  name: Yup.string().required('Name is required').trim(),
  email: Yup.string().email('E-mail is invalid').required('E-mail is required'),
  password: Yup.string()
    .test('password', "Password can't be empty", value => !!value?.trim())
    .required('Password is required')
    .min(6, 'Password must be greater than 6'),
  passwordConfirmation: Yup.string().oneOf(
    [Yup.ref('password')],
    'Passwords must match'
  )
});

export const login = Yup.object().shape({
  email: Yup.string().email('E-mail is invalid').required('E-mail is required'),
  password: Yup.string().required('Password is required')
});
