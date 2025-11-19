/* eslint-disable prettier/prettier */
/* 
login user
*/

import apiClient from './config';

type loginDataTypes = {
  email: string;
  password: string;
};
const handleLoginUser = (userLoginData: loginDataTypes) => {
  try {
    const response = apiClient.post('/auth/login', userLoginData);
    return response;
  } catch (error) {
    throw error;
  }
};

/* 
resgiter user 
*/

type registerUserType = {
  firstName: string;
  middleName: string;
  lastName: string;
  username: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  address: string;
  phoneNumber: string;
};
const handleUserRegistration = (userRegistrationData: registerUserType) => {
  try {
    const response = apiClient.post('/auth/register', userRegistrationData);
    return response;
  } catch (error) {
    throw error;
  }
};

/* 
authenticate user
*/
const authenticateUser = () => {
  try {
    const response = apiClient.post('/auth/authenticate');
    return response;
  } catch (error) {
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await apiClient.get('/auth/profile');
    return response;
  } catch (error) {
    throw error;
  }
};

export const getUserProfilePicture = async () => {
  try {
    const response = await apiClient.get('/auth/profile-picture');
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateProfilePicture = async (file: FormData) => {
  const response = await apiClient.post('/auth/profile-picture', file, {
    headers: {
      'Content-Type': 'multipart/form-data', // Set content type for file uploads
    },
  });
  return response;
};

interface ProfileValues {
  firstName: string;
  middleName: string;
  lastName: string;
  username: string;
  dateOfBirth: string;
  gender: string;
  address: string;
}
export const updateUserProfile = async (payload: ProfileValues) => {
  const response = await apiClient.put('/auth/profile', payload);
  return response;
};

interface passwordReset {
  oldPassword: string;
  newPassword: string;
}
export const updatePassword = async (payload: passwordReset) => {
  const response = await apiClient.patch('/auth/password', payload);
  return response;
};

export const handleOTPVerification = async (otp: string) => {
  const data = {
    OTP: otp,
  };
  const response = await apiClient.post('/auth/verify-OTP', data);
  return response;
};

type favoritesType = {
  name: string;
};
export type favoritesArray = {
  name: favoritesType[];
};

export const handleAddingFavorites = async (favorite: string[]) => {
  //
  const data = {
    favorites: favorite,
  };
  const response = await apiClient.post('/favorite/create', data);
  return response;
};

//FORGET PASSWORD
//EMAIL VERIFICATION
export const handleForgotPasswordEmailVerification = async (email: string) => {
  const data = {
    email: email,
  };
  const response = await apiClient.post('/auth/forget-password', data);
  return response;
};

//RESET FORGOT PASSWORD
export const handleResetForgotPassword = async ({
  newPassword,
  otp,
}: {
  newPassword: string;
  otp: string;
}) => {
  const data = {
    newPassword,
    OTP: otp,
  };
  const response = await apiClient.patch('/auth/reset-password', data);
  return response;
};
export default { handleLoginUser, handleUserRegistration, authenticateUser };
