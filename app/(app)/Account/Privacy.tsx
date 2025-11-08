import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import { router } from 'expo-router';
import * as Yup from 'yup';
import CustomTextInput from '~/components/CustomTextInputModified';
import GradientButton from '~/components/GradientButton';
import { Ionicons } from '@expo/vector-icons';
import { updatePassword } from '~/app/api/auth';
import { useAuth } from '~/app/contexts/AuthContext';

// Validation schema
const passwordValidationSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .required('Old password is required')
    .min(8, 'Old password must be at least 8 characters'),
  newPassword: Yup.string()
    .required('New password is required')
    .min(8, 'New password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .notOneOf([Yup.ref('oldPassword')], 'New password must be different from old password'),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
});

// Skeleton loader for the update password screen
const UpdatePasswordSkeleton = () => (
  <View className="flex-1 px-2">
    {/* Header Skeleton */}
    <View className="mb-8 mt-4 items-center">
      <View className="h-20 w-20 rounded-full bg-gray-800" />
      <View className="mt-3 h-4 w-32 rounded bg-gray-800" />
    </View>

    {/* Form Skeleton */}
    <View className="mb-6">
      <View className="mb-4 h-6 w-48 rounded bg-gray-800" />

      {/* Input Fields Skeleton */}
      {[1, 2, 3].map((i) => (
        <View key={i} className="mb-4">
          <View className="mb-2 h-4 w-32 rounded bg-gray-800" />
          <View className="h-12 w-full rounded-lg bg-gray-800" />
        </View>
      ))}

      {/* Button Skeleton */}
      <View className="mt-4 h-12 w-full rounded-lg bg-gray-800" />
    </View>
  </View>
);

const UpdatePassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { onLogout } = useAuth();
  interface PasswordValues {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }

  const handleUpdatePassword = async (values: PasswordValues): Promise<void> => {
    setIsLoading(true);
    try {
      console.log('Update password data:', {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });

      // Call the update password API
      await updatePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });

      Alert.alert('Success', 'Password updated successfully!');
      if (onLogout) await onLogout();
      // Clear form and navigate back after success
      //   setTimeout(() => {
      //     router.back();
      //   }, 1500);
    } catch (error: any) {
      console.error('Error updating password:', error);
      const errorMessage =
        error.response?.data?.message || 'Failed to update password. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const initialValues: PasswordValues = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  const toggleOldPasswordVisibility = () => {
    setShowOldPassword(!showOldPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-black" edges={['top', 'left', 'right']}>
        {/* Header with Back Button */}
        <View className="flex-row items-center px-5 pt-2">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="ml-4 text-2xl font-bold text-white">Update Password</Text>
        </View>

        <ScrollView
          className="flex-1 px-2"
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 20,
          }}
          showsVerticalScrollIndicator={false}>
          {/* Security Icon Section */}
          <View className="mb-8 mt-4 items-center">
            <View className="relative">
              <View className="h-20 w-20 items-center justify-center rounded-full border-2 border-gray-700 bg-gray-800">
                <Ionicons name="lock-closed" size={32} color="#6B7280" />
              </View>
            </View>
            <Text className="mt-3 text-sm text-gray-400">
              Secure your account with a new password
            </Text>
          </View>

          {/* Password Update Form with Formik */}
          <Formik
            initialValues={initialValues}
            validationSchema={passwordValidationSchema}
            onSubmit={handleUpdatePassword}>
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View className="mb-6">
                <Text className="mb-4 text-xl font-semibold text-white">Change Password</Text>

                {/* Old Password */}
                <CustomTextInput
                  label="Old Password *"
                  placeholder="Enter your current password"
                  value={values.oldPassword}
                  onChangeText={handleChange('oldPassword')}
                  onBlur={handleBlur('oldPassword')}
                  error={touched.oldPassword ? errors.oldPassword : undefined}
                  secureTextEntry
                  isPassword
                />

                {/* New Password */}
                <CustomTextInput
                  label="New Password *"
                  placeholder="Enter your new password"
                  value={values.newPassword}
                  onChangeText={handleChange('newPassword')}
                  onBlur={handleBlur('newPassword')}
                  error={touched.newPassword ? errors.newPassword : undefined}
                  secureTextEntry
                  isPassword
                />

                {/* Confirm New Password */}
                <CustomTextInput
                  label="Confirm New Password *"
                  placeholder="Confirm your new password"
                  value={values.confirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  error={touched.confirmPassword ? errors.confirmPassword : undefined}
                  secureTextEntry
                  isPassword
                />

                {/* Password Requirements */}
                <View className="my-6  rounded-lg border border-gray-800 bg-gray-900 p-4">
                  <Text className="mb-2 text-sm font-semibold text-white">
                    Password Requirements:
                  </Text>
                  <View className="space-y-1">
                    <Text className="text-xs text-gray-400">• At least 8 characters long</Text>
                    <Text className="text-xs text-gray-400">• One uppercase letter</Text>
                    <Text className="text-xs text-gray-400">• One lowercase letter</Text>
                    <Text className="text-xs text-gray-400">• One number</Text>
                    <Text className="text-xs text-gray-400">• One special character</Text>
                  </View>
                </View>

                {/* Update Button */}
                <View className="mt-4">
                  <GradientButton
                    title="Update Password"
                    onPress={handleSubmit}
                    isLoading={isLoading}
                  />
                </View>

                {/* Security Notice */}
                <View className="mt-6 flex-row gap-2 rounded-lg bg-blue-900/20 p-4">
                  <Ionicons name="shield-checkmark" size={16} color="#60A5FA" />
                  <Text className="text-sm text-white">
                    For security reasons, you will be logged out after changing your password.
                  </Text>
                </View>
              </View>
            )}
          </Formik>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default UpdatePassword;
