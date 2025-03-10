import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import React from 'react';
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
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import CustomTextInput from '~/components/CustomTextInput';
import loginValidationSchema from '~/utils/ValidationSchema/userLoginValidationSchema';

const initialValues = {
  email: '',
  password: '',
};
const screenWidth = Dimensions.get('window').width;
const Login = () => {
  const router = useRouter();
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
      <ImageBackground
        source={require('../../assets/backgrounds/Arya-Star.jpg')}
        className="flex-1 bg-gray-900">
        <LinearGradient colors={['rgba(0,0,0,1)', 'transparent']} className="flex-1  items-center">
          <Image source={require('../../assets/vbox.png')} style={{ width: 80, height: 80 }} />

          <View className="w-11/12 flex-1 items-center justify-center">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <Formik
                initialValues={initialValues}
                onSubmit={(values) => {}}
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
                      />

                      <CustomTextInput
                        label="Password"
                        value={values.password}
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        error={errors.password}
                        secureTextEntry
                        isPassword
                      />

                      <View style={{ alignItems: 'flex-end' }}>
                        <Pressable onPress={handleSubmit}>
                          <Text className="text-white underline">Forgot Password?</Text>
                        </Pressable>
                      </View>
                      <View className="py-4">
                        <Pressable
                          style={{ backgroundColor: 'rgb(184, 134, 11)', borderRadius: 10 }}
                          onPress={handleSubmit}
                          className="w-11/12 items-center justify-center rounded-lg p-4">
                          <Text className="text-white">Sign In</Text>
                        </Pressable>
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
            </TouchableWithoutFeedback>
          </View>
        </LinearGradient>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default Login;
