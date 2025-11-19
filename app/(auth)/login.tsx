import { LinearGradient } from 'expo-linear-gradient';
import { router, useRouter } from 'expo-router';
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
  Modal,
} from 'react-native';
import CustomTextInput from '~/components/CustomTextInputModified';
import GradientButton from '~/components/GradientButton';
import loginValidationSchema from '~/utils/ValidationSchema/userLoginValidationSchema';
import { useAuth } from '../contexts/AuthContext';
import { handleForgotPasswordEmailVerification } from '../api/auth';

const initialValues = {
  email: '',
  password: '',
};
const screenWidth = Dimensions.get('window').width;

const passwordSetupRender = () => {
  return (
    <Formik
      initialValues={{ email: '' }}
      validationSchema={require('yup')
        .object()
        .shape({
          email: require('yup')
            .string()
            .email('Invalid email address')
            .required('Email is required'),
        })}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        try {
          const response = await handleForgotPasswordEmailVerification(values.email);
          console.log(response.data.otp);
          // You can show a success message or navigate to another screen here
          if (response.status === 200) {
            router.push({
              pathname: '/(auth)/Forgetpassword',
              params: { email: values.email, otp: response.data.otp },
            });
          }
          resetForm();
        } finally {
          setSubmitting(false);
        }
      }}>
      {({ errors, handleBlur, handleChange, handleSubmit, values, isSubmitting }) => {
        return (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}>
            <Pressable onPress={Keyboard.dismiss} style={{ flex: 1 }}>
              <View className="w-full flex-1  justify-center gap-4 bg-black p-4">
                <View className="w-full items-center">
                  <Image
                    source={require('../../assets/vbox.png')}
                    style={{ width: 80, height: 80 }}
                  />
                  <Text className="mb-4 text-lg text-white">Password Recovery</Text>
                </View>

                <CustomTextInput
                  label="Email"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  error={errors.email}
                  placeholder="Enter Email"
                  keyboardType="email-address"
                />

                <GradientButton
                  title="Send Recovery"
                  onPress={() => handleSubmit()}
                  isLoading={isSubmitting}
                />
              </View>
            </Pressable>
          </KeyboardAvoidingView>
        );
      }}
    </Formik>
  );
};
const Login = () => {
  const { onLogin, isLoading } = useAuth();
  const router = useRouter();
  const [isPasswordSetupVisible, setIsPasswordSetupVisible] = useState(false);
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
                  if (onLogin) onLogin(values);
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
                        <Pressable
                          onPress={() => {
                            setIsPasswordSetupVisible(true);
                          }}>
                          <Text className="text-white underline">Forgot Password?</Text>
                        </Pressable>
                      </View>
                      <View className="py-4">
                        <GradientButton
                          title="Sign In"
                          onPress={() => handleSubmit()}
                          isLoading={isLoading!}
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

              <Modal
                animationType="slide"
                visible={isPasswordSetupVisible}
                onDismiss={() => setIsPasswordSetupVisible(false)}>
                {passwordSetupRender()}
              </Modal>
            </Pressable>
          </View>
        </LinearGradient>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default Login;
