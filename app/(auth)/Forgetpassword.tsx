import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
  Alert,
} from 'react-native';
import CustomTextInput from '~/components/CustomTextInputModified';
import GradientButton from '~/components/GradientButton';
import * as Yup from 'yup';
import { handleResetForgotPassword } from '../api/auth';

const resetPasswordValidationSchema = Yup.object().shape({
  otp: Yup.string()
    .required('OTP is required')
    .min(4, 'OTP must be at least 4 characters')
    .max(8, 'OTP must not exceed 8 characters'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
});

const initialValues = {
  otp: '',
  password: '',
  confirmPassword: '',
};

const screenWidth = Dimensions.get('window').width;

const ResetPassword = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { otp, email } = useLocalSearchParams();
  const [status, setStatus] = useState<{
    message: string;
    type: 'error' | 'success';
  }>({
    message: '',
    type: 'success',
  });

  const handleResetPassword = async (values: typeof initialValues) => {
    setIsLoading(true);
    setStatus({ message: '', type: 'success' });

    try {
      const response = await handleResetForgotPassword({
        newPassword: values.password,
        otp: values.otp,
      });
      if (response.status === 200) {
        // Password reset successful
        Alert.alert('Success', 'Your password has been reset successfully.', [
          {
            text: 'OK',
            onPress: () => router.replace('/(auth)/login'),
          },
        ]);
      }
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setStatus({
        message: 'Password reset successfully! Redirecting to login...',
        type: 'success',
      });

      // Redirect to login after success
      setTimeout(() => {
        router.replace('/(auth)/login');
      }, 2000);
    } catch (error: any) {
      setStatus({
        message: error.response?.data?.error || 'Failed to reset password. Please try again.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
      <ImageBackground
        source={require('../../assets/backgrounds/Arya-Star.jpg')}
        className="flex-1 bg-gray-900">
        <LinearGradient colors={['rgba(0,0,0,1)', 'transparent']} className="flex-1 items-center">
          <View className="w-11/12 flex-1 items-center justify-center">
            <Image source={require('../../assets/vbox.png')} style={{ width: 80, height: 80 }} />

            {/* Header */}
            <View className="mb-6 w-full items-center">
              <Text className="mb-2 text-3xl font-bold text-white">Reset Password</Text>
              <Text className="text-center text-gray-400">
                Enter the OTP {otp} and your new password
              </Text>
            </View>

            <Pressable onPress={Keyboard.dismiss}>
              <Formik
                initialValues={initialValues}
                onSubmit={handleResetPassword}
                validationSchema={resetPasswordValidationSchema}>
                {({ errors, handleBlur, handleChange, handleSubmit, values }) => {
                  return (
                    <View className="w-full gap-4" style={{ width: screenWidth - 30 }}>
                      {/* Status Message */}
                      {status.message ? (
                        <View
                          className={`rounded-xl border p-4 ${
                            status.type === 'error'
                              ? 'border-red-500/50 bg-red-500/10'
                              : 'border-green-500/50 bg-green-500/10'
                          }`}>
                          <Text
                            className={`text-sm font-medium ${
                              status.type === 'error' ? 'text-red-300' : 'text-green-300'
                            }`}>
                            {status.message}
                          </Text>
                        </View>
                      ) : null}

                      {/* OTP Field */}
                      <CustomTextInput
                        label="OTP"
                        value={values.otp}
                        onChangeText={handleChange('otp')}
                        onBlur={handleBlur('otp')}
                        error={errors.otp}
                        placeholder="Enter OTP"
                        keyboardType="numeric"
                      />

                      {/* New Password Field */}
                      <CustomTextInput
                        label="New Password"
                        value={values.password}
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        error={errors.password}
                        isPassword
                        placeholder="Enter new password"
                      />

                      {/* Confirm Password Field */}
                      <CustomTextInput
                        label="Confirm Password"
                        value={values.confirmPassword}
                        onChangeText={handleChange('confirmPassword')}
                        onBlur={handleBlur('confirmPassword')}
                        error={errors.confirmPassword}
                        isPassword
                        placeholder="Confirm new password"
                      />

                      {/* Reset Password Button */}
                      <View className="py-4">
                        <GradientButton
                          title="Reset Password"
                          onPress={() => handleSubmit()}
                          isLoading={isLoading}
                        />
                      </View>

                      {/* Back to Login */}
                      <View className="flex-row justify-center">
                        <Text className="text-white">Remember your password? </Text>
                        <Pressable
                          onPress={() => {
                            router.push('/(auth)/login');
                          }}>
                          <Text style={{ color: 'rgb(184, 134, 11)' }}>Sign In</Text>
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

export default ResetPassword;
