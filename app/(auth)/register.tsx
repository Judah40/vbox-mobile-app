import { LinearGradient } from 'expo-linear-gradient';
import { Formik } from 'formik';
import React, { useCallback, useRef } from 'react';
import {
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Keyboard,
  Pressable,
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import CustomTextInput from '~/components/CustomTextInput';
import * as Yup from 'yup';
import { useRouter } from 'expo-router';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';

const screenWidth = Dimensions.get('window').width;

const registerValidationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  middleName: Yup.string(),
  lastName: Yup.string().required('Last name is required'),
  dateOfBirth: Yup.string().required('Date of Birth is required'),
  gender: Yup.string().required('Gender is required'),
});

const initialValues = {
  firstName: '',
  middleName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
};

const Register = () => {
  const router = useRouter();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
      <View className="flex-1 items-center justify-center bg-gray-900">
        <Image source={require('../../assets/vbox.png')} style={{ width: 150, height: 150 }} />
        <View style={{ width: screenWidth - 30 }}>
          <Text className="text-xl font-bold text-white">Personal Information</Text>
        </View>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Formik
            initialValues={initialValues}
            onSubmit={(values) => {}}
            validationSchema={registerValidationSchema}>
            {({ errors, handleBlur, handleChange, handleSubmit, values }) => {
              return (
                <View className="w-11/12 gap-4" style={{ width: screenWidth - 30 }}>
                  <CustomTextInput
                    label="First Name"
                    value={values.firstName}
                    onChangeText={handleChange('firstName')}
                    onBlur={handleBlur('firstName')}
                    error={errors.firstName}
                  />
                  <CustomTextInput
                    label="Middle Name"
                    value={values.middleName}
                    onChangeText={handleChange('middleName')}
                    onBlur={handleBlur('middleName')}
                  />
                  <CustomTextInput
                    label="Last Name"
                    value={values.lastName}
                    onChangeText={handleChange('lastName')}
                    onBlur={handleBlur('lastName')}
                    error={errors.lastName}
                  />
                  <CustomTextInput
                    label="Date of Birth"
                    value={values.dateOfBirth}
                    onChangeText={handleChange('dateOfBirth')}
                    onBlur={handleBlur('dateOfBirth')}
                    error={errors.dateOfBirth}
                  />
                  <CustomTextInput
                    label="Gender"
                    value={values.gender}
                    onChangeText={handleChange('gender')}
                    onBlur={handleBlur('gender')}
                    error={errors.gender}
                  />
                  <View className="py-4">
                    <Pressable
                      style={{ backgroundColor: 'rgb(184, 134, 11)', borderRadius: 10 }}
                      onPress={handleSubmit}
                      className="w-11/12 items-center justify-center rounded-lg p-4">
                      <Text className="text-white">Register</Text>
                    </Pressable>
                  </View>
                  <View className="flex-row justify-center ">
                    <Text className="text-white">Already have an account?</Text>
                    <Pressable
                      onPress={() => {
                        // router.push('/(auth)/login');
                        handlePresentModalPress();
                      }}>
                      <Text style={{ color: 'rgb(184, 134, 11)' }}>Login</Text>
                    </Pressable>
                  </View>
                </View>
              );
            }}
          </Formik>
        </TouchableWithoutFeedback>
      </View>
      <BottomSheetModal
        snapPoints={['90%']}
        index={1}
        ref={bottomSheetModalRef}
        enableDismissOnClose={false} // Prevents closing the modal
        onChange={handleSheetChanges}
        >
        <View className="flex-1 bg-gray-900"></View>
        <BottomSheetView></BottomSheetView>
      </BottomSheetModal>
    </KeyboardAvoidingView>
  );
};

export default Register;
