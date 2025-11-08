import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Keyboard,
  Pressable,
  ScrollView,
  Animated,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import * as Yup from 'yup';
import CustomSelectInput from '~/components/CustomSelectInput';
import DatePickerModal from '~/components/DatePickerModal';
import GradientButton from '~/components/GradientButton';
import PickerModal from '~/components/PickerModal';
import { registerValidationSchema } from '~/utils/ValidationSchema/registrationValidationSchema';
import { useAuth } from '../contexts/AuthContext';
import CustomTextInput from '~/components/CustomTextInputModified';

const initialValues = {
  firstName: '',
  middleName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
  email: '',
  address: '',
  phoneNumber: '',
  username: '',
};

const Register = () => {
  const router = useRouter();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { onRegister } = useAuth();
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePresentModalPress = useCallback(() => {
    router.back();
  }, []);

  const genderOptions = ['Male', 'Female'];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#0f172a']}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            paddingVertical: 40,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Animated.View
              style={{
                opacity: fadeAnim,
                paddingHorizontal: 20,
              }}>
              {/* Logo Section */}
              <View className="mb-8 items-center">
                <View
                  style={{
                    shadowColor: '#b8860b',
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.3,
                    shadowRadius: 20,
                    elevation: 10,
                  }}>
                  <Image
                    source={require('../../assets/vbox.png')}
                    style={{ width: 120, height: 120 }}
                  />
                </View>
              </View>

              {/* Header Section */}
              <View className="mb-8">
                <Text className="mb-2 text-3xl font-bold text-white" style={{ letterSpacing: 0.5 }}>
                  Create Account
                </Text>
                <Text className="text-base text-gray-400">
                  Please fill in your details to get started
                </Text>
              </View>

              {/* Form Section */}
              <Formik
                initialValues={initialValues}
                onSubmit={async (values) => {
                  setIsLoading(true);
                  try {
                    if (onRegister) {
                      await onRegister(values);
                    } else {
                      console.warn('onRegister is not defined');
                    }
                  } catch (error: unknown) {
                    const errorMessage =
                      (error as any).response?.data?.message || 'An unknown error occurred';
                    Alert.alert('ERROR', errorMessage);
                  } finally {
                    setIsLoading(false);
                  }
                }}
                validationSchema={registerValidationSchema}>
                {({
                  errors,
                  handleBlur,
                  handleChange,
                  handleSubmit,
                  values,
                  touched,
                  setFieldValue,
                }) => {
                  return (
                    <View className="gap-5">
                      {/* Name Row */}
                      <View className="gap-4">
                        <CustomTextInput
                          label="First Name"
                          value={values.firstName}
                          onChangeText={handleChange('firstName')}
                          onBlur={handleBlur('firstName')}
                          error={touched.firstName ? errors.firstName : undefined}
                        />

                        <CustomTextInput
                          label="Middle Name (Optional)"
                          value={values.middleName}
                          onChangeText={handleChange('middleName')}
                          onBlur={handleBlur('middleName')}
                        />

                        <CustomTextInput
                          label="Last Name"
                          value={values.lastName}
                          onChangeText={handleChange('lastName')}
                          onBlur={handleBlur('lastName')}
                          error={touched.lastName ? errors.lastName : undefined}
                        />
                        <CustomTextInput
                          label="Username"
                          value={values.username}
                          onChangeText={handleChange('username')}
                          onBlur={handleBlur('username')}
                          error={touched.username ? errors.username : undefined}
                        />
                        <CustomTextInput
                          label="Email"
                          value={values.email}
                          onChangeText={handleChange('email')}
                          onBlur={handleBlur('email')}
                          error={touched.email ? errors.email : undefined}
                          keyboardType="email-address"
                        />
                        <CustomTextInput
                          label="Address"
                          value={values.address}
                          onChangeText={handleChange('address')}
                          onBlur={handleBlur('address')}
                          error={touched.address ? errors.address : undefined}
                        />
                        <CustomTextInput
                          label="Phone Number"
                          value={values.phoneNumber}
                          onChangeText={handleChange('phoneNumber')}
                          onBlur={handleBlur('phoneNumber')}
                          error={touched.phoneNumber ? errors.phoneNumber : undefined}
                          keyboardType="name-phone-pad"
                        />
                      </View>

                      {/* Date and Gender Row */}
                      <View className="gap-4">
                        <CustomSelectInput
                          label="Date of Birth"
                          value={values.dateOfBirth}
                          onPress={() => setShowDatePicker(true)}
                          error={touched.dateOfBirth ? errors.dateOfBirth : undefined}
                          placeholder={
                            values.dateOfBirth
                              ? new Date(values.dateOfBirth).toLocaleString()
                              : 'Select your date of birth'
                          }
                        />

                        <CustomSelectInput
                          label="Gender"
                          value={values.gender}
                          onPress={() => setShowGenderPicker(true)}
                          error={touched.gender ? errors.gender : undefined}
                          placeholder={values.gender ? values.gender : 'Select your gender'}
                        />
                      </View>

                      {/* Register Button */}
                      <View className="mt-6">
                        <GradientButton
                          title="Create Account"
                          onPress={() => handleSubmit()}
                          isLoading={isLoading}
                        />
                      </View>

                      {/* Divider */}
                      <View className="my-6 flex-row items-center">
                        <View className="h-px flex-1 bg-gray-700" />
                        <Text className="px-4 text-sm text-gray-500">OR</Text>
                        <View className="h-px flex-1 bg-gray-700" />
                      </View>

                      {/* Login Link */}
                      <View className="flex-row items-center justify-center gap-2">
                        <Text className="text-base text-gray-400">Already have an account?</Text>
                        <Pressable
                          onPress={handlePresentModalPress}
                          style={({ pressed }) => ({
                            opacity: pressed ? 0.7 : 1,
                          })}>
                          <Text className="text-base font-semibold" style={{ color: '#d4af37' }}>
                            Sign In
                          </Text>
                        </Pressable>
                      </View>
                      {/* Modals */}

                      <DatePickerModal
                        visible={showDatePicker}
                        onClose={() => setShowDatePicker(false)}
                        onSelect={(date) => setFieldValue('dateOfBirth', date)}
                      />

                      <PickerModal
                        visible={showGenderPicker}
                        onClose={() => setShowGenderPicker(false)}
                        options={genderOptions}
                        onSelect={(gender) => setFieldValue('gender', gender)}
                        title="Select Gender"
                      />
                    </View>
                  );
                }}
              </Formik>
            </Animated.View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default Register;
