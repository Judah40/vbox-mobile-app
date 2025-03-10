import * as Yup from 'yup';

const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email format') // Ensures it's a valid email
    .required('Email is required'),

  password: Yup.string()
    .min(8, 'Password must be at least 8 characters long') // Minimum length
    .required('Password is required'),
});

export default loginValidationSchema;
