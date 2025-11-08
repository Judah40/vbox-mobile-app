import * as Yup from 'yup';

export const registerValidationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  middleName: Yup.string(),
  lastName: Yup.string().required('Last name is required'),
  dateOfBirth: Yup.string().required('Date of Birth is required'),
  gender: Yup.string().required('Gender is required'),
  email: Yup.string().email().required(),
  phoneNumber: Yup.string()
    .matches(
      /^(?:(?:\+232)|0)?[\s\-]?(?:[2-8]\d)[\s\-]?(\d{3})[\s\-]?(\d{3})$/,
      'Please enter a valid Sierra Leone phone number (format: +232XXXXXXXXX, 232XXXXXXXXX, or 0XXXXXXXXX)'
    )
    .required('Phone number is required'),
  address: Yup.string().required(),
  username: Yup.string()
    .min(4, 'Minimum length should be 4')
    .max(12, 'maximum length should be 12')
    .required(),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[^\w]/, 'Password must contain at least one special character')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
    .required('Confirm Password is required'),
});
