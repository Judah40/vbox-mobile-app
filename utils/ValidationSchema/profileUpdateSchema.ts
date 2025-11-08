import * as Yup from 'yup';
// Validation schema
export const profileValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces'),
  middleName: Yup.string()
    .max(50, 'Middle name must be less than 50 characters')
    .matches(/^[a-zA-Z\s]*$/, 'Middle name can only contain letters and spaces'),
  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces'),
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  dateOfBirth: Yup.string()
    .required('Date of birth is required')
    .test('is-valid-date', 'Please enter a valid date', (value) => {
      if (!value) return false;
      try {
        const date = new Date(value);
        const timestamp = date.getTime();
        const now = Date.now();
        return date instanceof Date && !isNaN(timestamp) && timestamp <= now;
      } catch {
        return false;
      }
    }),
  gender: Yup.string()
    .required('Gender is required')
    .oneOf(['Male', 'Female', 'Other', 'Prefer not to say'], 'Please select a valid gender'),
  address: Yup.string()
    .required('Address is required')
    .min(10, 'Address must be at least 10 characters')
    .max(200, 'Address must be less than 200 characters'),
});
