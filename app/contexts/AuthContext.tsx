/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useContext, useEffect, useState } from 'react';

import auth, { getUserProfile, getUserProfilePicture } from '../api/auth';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
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
  id?: string;
};
type userLoginProps = {
  email: string;
  password: string;
};
interface AuthProps {
  authState: { authenticated: boolean | null };
  userDetails?: userProps | null;
  onRegister: (userProps: userProps) => Promise<void>;
  onLogin: (userLoginProps: userLoginProps) => Promise<void>;
  onLogout: () => Promise<any>;
  initialized: boolean;
  userProfilePicture: string;
  isLoading: boolean;
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
  const [userProfilePicture, setUserProfilePicture] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  /* 
  Auth Checker
  */
  useEffect(() => {
    const authenticate = async () => {
      const onboardingCompleted = await AsyncStorage.getItem('onboarding');
      if (!onboardingCompleted) {
        router.replace('/Onboarding');
        return;
      }
      try {
        const response = await auth.authenticateUser();
        if (response.status === 200) {
          router.replace('/(app)/Home');
          setAuthState({ authenticated: true });
        }
      } catch (error) {
        console.error('Authentication error:', error);
        router.replace('/(auth)/login');
      } finally {
        setInitialized(true);
      }
    };
    authenticate();
  }, []);

  /* 
HANDLE GET USER DETAILS
*/

  useEffect(() => {
    getUserProfile()
      .then((response) => {
        setUserDetails(response.data.user);
      })
      .catch((err) => {
        console.error(err);
      });

    getUserProfilePicture()
      .then((response) => {
        setUserProfilePicture(response.data.profilePictureUrl);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  /* 
  FUNCTION TO HANDLE USER LOGIN
  */
  const handleUserLogin = async (userLoginCredentials: { email: string; password: string }) => {
    setIsLoading(true);

    try {
      const response = await auth.handleLoginUser(userLoginCredentials);
      if (response.data) {
        await AsyncStorage.setItem('token', response.data.token);
        await AsyncStorage.setItem('streamToken', response.data.streamToken);
        setAuthState({
          authenticated: true,
        });

        router.replace('/(app)/Home');
      }
    } catch (error: unknown) {
      const message =
        (error as any)?.response?.data?.message ??
        (error instanceof Error ? error.message : 'An unexpected error occurred');
      Alert.alert('Error', message);
    } finally {
      setIsLoading(false);
    }
  };

  /* 
  HANDLE USER RESGISTRATION 
  */
  const handleUserRegistration = async (userRegistrationCredentials: userProps) => {
    const response = await auth.handleUserRegistration(userRegistrationCredentials);
    if (response.data) {
      router.push({
        pathname: '/(auth)/otpInput',
        params: {
          otp: response.data.otp,
        },
      });
    }
  };

  /* 
HANDLE USER LOGOUT
*/
  const handleUserLogout = async () => {
    await AsyncStorage.multiRemove(['token', 'streamToken']);
    setAuthState({
      authenticated: false,
    });
    router.replace('/(auth)/login');
  };

  const value = {
    authState,
    userDetails,
    onRegister: handleUserRegistration,
    onLogin: handleUserLogin,
    onLogout: handleUserLogout,
    initialized,
    userProfilePicture,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
