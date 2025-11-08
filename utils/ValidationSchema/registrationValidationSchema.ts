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
});
