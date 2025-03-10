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
    const response = apiClient.post('auth/register', userRegistrationData);
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
    const response = apiClient.post('auth/authenticate');
    return response;
  } catch (error) {
    throw error;
  }
};

export default { handleLoginUser, handleUserRegistration, authenticateUser };
