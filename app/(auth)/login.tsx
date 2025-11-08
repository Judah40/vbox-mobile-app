import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import { useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Keyboard,
  Pressable,
} from 'react-native';
import CustomTextInput from '~/components/CustomTextInputModified';
import GradientButton from '~/components/GradientButton';
import loginValidationSchema from '~/utils/ValidationSchema/userLoginValidationSchema';
import { useAuth } from '../contexts/AuthContext';

const initialValues = {
  email: '',
  password: '',
};
const screenWidth = Dimensions.get('window').width;
const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { onLogin } = useAuth();
  const router = useRouter();
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
      <ImageBackground
        source={require('../../assets/backgrounds/Arya-Star.jpg')}
        className="flex-1 bg-gray-900">
        <LinearGradient colors={['rgba(0,0,0,1)', 'transparent']} className="flex-1  items-center">
          <View className="w-11/12 flex-1 items-center justify-center">
            <Image source={require('../../assets/vbox.png')} style={{ width: 80, height: 80 }} />
            <Pressable onPress={Keyboard.dismiss}>
              <Formik
                initialValues={initialValues}
                onSubmit={(values) => {
                  setIsLoading(true);
                  try {
                    if (onLogin) onLogin(values);
                    // console.log(values);
                  } catch (error) {
                    console.error(error);
                  } finally {
                    setIsLoading(false);
                  }
                }}
                validationSchema={loginValidationSchema}>
                {({ errors, handleBlur, handleChange, handleSubmit, values }) => {
                  return (
                    <View className="w-full gap-4 " style={{ width: screenWidth - 30 }}>
                      <CustomTextInput
                        label="Email"
                        value={values.email}
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                        error={errors.email}
                        placeholder="Enter Email"
                      />
                      <CustomTextInput
                        label="Password"
                        value={values.password}
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        error={errors.password}
                        secureTextEntry
                        isPassword
                        placeholder="Enter Password"
                      />

                      <View style={{ alignItems: 'flex-end' }}>
                        <Pressable onPress={() => {}}>
                          <Text className="text-white underline">Forgot Password?</Text>
                        </Pressable>
                      </View>
                      <View className="py-4">
                        <GradientButton
                          title="Sign In"
                          onPress={() => handleSubmit()}
                          isLoading={isLoading}
                        />
                      </View>
                      <View className="flex-row justify-center ">
                        <Text className="text-white">Don't have an account?</Text>
                        <Pressable
                          onPress={() => {
                            router.push('/(auth)/register');
                          }}>
                          <Text style={{ color: 'rgb(184, 134, 11)' }}>Sign Up</Text>
                        </Pressable>
                      </View>
                    </View>
                  );
                }}
              </Formik>
            </Pressable>
          </View>
        </LinearGradient>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default Login;
