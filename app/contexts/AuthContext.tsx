/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as SecureStore from 'expo-secure-store';
import { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import auth from '../api/auth';
type userProps = {
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
type userLoginProps = {
  email: string;
  password: string;
};
interface AuthProps {
  authState: { authenticated: boolean | null };
  userDetails?: userProps | null;
  onRegister: (userProps: userProps) => Promise<void>;
  onLogin: (userLoginProps:userLoginProps) => Promise<void>;
  onLogout: () => Promise<any>;
  initialized: boolean;
}

const AuthContext = createContext<Partial<AuthProps>>({});
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    authenticated: boolean | null;
  }>({
    authenticated: null,
  });
  const [initialized, setInitialized] = useState(false);
  const [userDetails, setUserDetails] = useState<userProps | null>(null);

  /* 
  Auth Checker
  */
  useEffect(() => {
    const authenticate = async () => {
      try {
        const response = await auth.authenticateUser();
        if (response.status === 200) {
          setAuthState({ authenticated: true });
        }
      } catch (error) {
        console.error("Authentication error:", error);
      } finally {
        setInitialized(true);
      }
    };
    authenticate();
  }, []); 
  

  /* 
  FUNCTION TO HANDLE USER LOGIN
  */
  const handleUserLogin = async (userLoginCredentials: { email: string; password: string }) => {
    const response = await auth.handleLoginUser(userLoginCredentials);
    if (response.data) {
      setAuthState({
        authenticated: true,
      });
    } else {
      // Alert.alert()
    }
  };

  /* 
  HANDLE USER RESGISTRATION 
  */
  const handleUserRegistration = async (userRegistrationCredentials: userProps) => {
    const response = await auth.handleUserRegistration(userRegistrationCredentials);
    if (response.data) {
    }
  };

  /* 
HANDLE USER LOGOUT
*/
  const handleUserLogout = async () => {
    const token = await SecureStore.deleteItemAsync('token');
    setAuthState({
      authenticated: false,
    });
  };

  const value = {
    authState,
    userDetails,
    onRegister: handleUserRegistration,
    onLogin: handleUserLogin,
    onLogout: handleUserLogout,
    initialized,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
