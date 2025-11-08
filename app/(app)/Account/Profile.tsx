import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import CustomTextInput from '~/components/CustomTextInputModified';
import CustomSelectInput from '~/components/CustomSelectInput';
import DatePickerModal from '~/components/DatePickerModal';
import PickerModal from '~/components/PickerModal';
import GradientButton from '~/components/GradientButton';
import {
  getUserProfile,
  getUserProfilePicture,
  updateProfilePicture,
  updateUserProfile,
} from '~/app/api/auth';
import { Ionicons } from '@expo/vector-icons';
import { profileValidationSchema } from '~/utils/ValidationSchema/profileUpdateSchema';

const ProfileSkeleton = () => (
  <View className="flex-1 px-2">
    {/* Profile Picture Skeleton */}
    <View className="mb-8 mt-4 items-center">
      <View className="h-32 w-32 rounded-full bg-gray-800" />
      <View className="mt-3 h-4 w-24 rounded bg-gray-800" />
    </View>

    {/* Form Skeleton */}
    <View className="mb-6">
      <View className="mb-4 h-6 w-40 rounded bg-gray-800" />

      {/* Input Fields Skeleton */}
      {[1, 2, 3, 4].map((i) => (
        <View key={i} className="mb-4">
          <View className="mb-2 h-4 w-24 rounded bg-gray-800" />
          <View className="h-12 w-full rounded-lg bg-gray-800" />
        </View>
      ))}

      {/* Date and Gender Row Skeleton */}
      <View className="mb-4 flex-row gap-3">
        <View className="flex-1">
          <View className="mb-2 h-4 w-24 rounded bg-gray-800" />
          <View className="h-12 w-full rounded-lg bg-gray-800" />
        </View>
        <View className="flex-1">
          <View className="mb-2 h-4 w-24 rounded bg-gray-800" />
          <View className="h-12 w-full rounded-lg bg-gray-800" />
        </View>
      </View>

      {/* Address Skeleton */}
      <View className="mb-4">
        <View className="mb-2 h-4 w-24 rounded bg-gray-800" />
        <View className="h-12 w-full rounded-lg bg-gray-800" />
      </View>

      {/* Button Skeleton */}
      <View className="mt-4 h-12 w-full rounded-lg bg-gray-800" />
    </View>
  </View>
);

const Profile = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [profilePicture, setProfilePicture] = useState('');
  const [userProfile, setUserProfile] = useState<ProfileValues | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  interface ProfileValues {
    firstName: string;
    middleName: string;
    lastName: string;
    username: string;
    dateOfBirth: string;
    gender: string;
    address: string;
  }

  // Request permissions on component mount
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Sorry, we need camera roll permissions to change your profile picture!'
        );
      }
    })();
  }, []);

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const selectedImage = result.assets[0];
        setProfileImage(selectedImage.uri);

        // Auto-upload the image after selection
        await handleImageUpload(selectedImage.uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleImageUpload = async (imageUri: string) => {
    if (!imageUri) return;

    setIsUploading(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('profile_picture', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile-picture.jpg',
      } as any);

      // Upload the image
      const response = await updateProfilePicture(formData);

      if (response.data.success) {
        setProfilePicture(response.data.profilePictureUrl);
        Alert.alert('Success', 'Profile picture updated successfully!');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload profile picture. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = async (values: ProfileValues): Promise<void> => {
    setIsLoading(true);
    try {
      console.log('Save profile data:', values);
      // Simulate API call

      await updateUserProfile(values);
      //   await new Promise((resolve) => setTimeout(resolve, 2000));
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];

  const initialValues = {
    firstName: userProfile?.firstName || '',
    middleName: userProfile?.middleName || '',
    lastName: userProfile?.lastName || '',
    username: userProfile?.username || '',
    dateOfBirth: userProfile?.dateOfBirth || '',
    gender: userProfile?.gender || '',
    address: userProfile?.address || '',
  };

  useEffect(() => {
    setIsLoadingProfile(true);

    Promise.all([getUserProfile(), getUserProfilePicture()])
      .then(([profileResponse, pictureResponse]) => {
        console.log(profileResponse.data.user);
        setUserProfile(profileResponse.data.user);
        console.log(pictureResponse.data.profilePictureUrl);
        setProfilePicture(pictureResponse.data.profilePictureUrl);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoadingProfile(false);
      });
  }, []);

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
          <Text className="ml-4 text-2xl font-bold text-white">Profile</Text>
        </View>

        <ScrollView className="flex-1 px-2" contentContainerStyle={{ flexGrow: 1 }}>
          {isLoadingProfile ? (
            <ProfileSkeleton />
          ) : (
            <>
              {/* Profile Picture Section */}
              <View className="mb-8 mt-4 items-center">
                <View className="relative">
                  <TouchableOpacity
                    onPress={handleImagePick}
                    disabled={isUploading}
                    className="h-32 w-32 items-center justify-center rounded-full border-2 border-gray-700 bg-gray-800">
                    {profilePicture || profileImage ? (
                      <Image
                        source={{ uri: profileImage || profilePicture }}
                        className="h-full w-full rounded-full"
                      />
                    ) : (
                      <Text className="text-4xl text-gray-400">👤</Text>
                    )}

                    {/* Uploading Overlay */}
                    {isUploading && (
                      <View className="absolute inset-0 items-center justify-center rounded-full bg-black bg-opacity-50">
                        <Text className="text-white">Uploading...</Text>
                      </View>
                    )}
                  </TouchableOpacity>

                  {/* Camera/Upload Icon */}
                  <TouchableOpacity
                    onPress={handleImagePick}
                    disabled={isUploading}
                    className="absolute bottom-0 right-0 h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-blue-600">
                    <Ionicons name="camera" size={20} color="white" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={handleImagePick} disabled={isUploading} className="mt-3">
                  <Text className={`text-sm ${isUploading ? 'text-gray-500' : 'text-blue-500'}`}>
                    {isUploading ? 'Uploading...' : 'Change Photo'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Profile Management Form with Formik */}
              <Formik
                initialValues={initialValues}
                validationSchema={profileValidationSchema}
                onSubmit={handleSaveProfile}
                enableReinitialize>
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                  setFieldValue,
                }) => (
                  <View className="mb-6">
                    <Text className="mb-4 text-xl font-semibold text-white">
                      Profile Information
                    </Text>

                    {/* First Name */}
                    <CustomTextInput
                      label="First Name *"
                      placeholder={userProfile?.firstName || 'Enter first name'}
                      value={values.firstName}
                      onChangeText={handleChange('firstName')}
                      onBlur={handleBlur('firstName')}
                      error={touched.firstName ? errors.firstName : undefined}
                    />

                    {/* Middle Name */}
                    <CustomTextInput
                      label="Middle Name"
                      placeholder={userProfile?.middleName || 'Enter middle name'}
                      value={values.middleName}
                      onChangeText={handleChange('middleName')}
                      onBlur={handleBlur('middleName')}
                      error={touched.middleName ? errors.middleName : undefined}
                    />

                    {/* Last Name */}
                    <CustomTextInput
                      label="Last Name *"
                      placeholder={userProfile?.lastName || 'Enter last name'}
                      value={values.lastName}
                      onChangeText={handleChange('lastName')}
                      onBlur={handleBlur('lastName')}
                      error={touched.lastName ? errors.lastName : undefined}
                    />

                    {/* Username */}
                    <CustomTextInput
                      label="Username *"
                      placeholder={userProfile?.username || 'Enter username'}
                      value={values.username}
                      onChangeText={handleChange('username')}
                      onBlur={handleBlur('username')}
                      error={touched.username ? errors.username : undefined}
                    />

                    {/* Date of Birth and Gender Row */}
                    <View className="mb-4 flex-row gap-3">
                      <View className="flex-1">
                        <CustomSelectInput
                          label="Date of Birth *"
                          value={values.dateOfBirth}
                          onPress={() => setShowDatePicker(true)}
                          error={touched.dateOfBirth ? errors.dateOfBirth : undefined}
                          placeholder={userProfile?.dateOfBirth || 'Select Date'}
                        />
                      </View>
                      <View className="flex-1">
                        <CustomSelectInput
                          label="Gender *"
                          value={values.gender}
                          onPress={() => setShowGenderPicker(true)}
                          error={touched.gender ? errors.gender : undefined}
                          placeholder={userProfile?.gender || 'Select gender'}
                        />
                      </View>
                    </View>

                    {/* Address */}
                    <CustomTextInput
                      label="Address *"
                      placeholder={userProfile?.address || 'Enter your address'}
                      value={values.address}
                      onChangeText={handleChange('address')}
                      onBlur={handleBlur('address')}
                      error={touched.address ? errors.address : undefined}
                    />

                    {/* Save Button */}
                    <View className="mt-4">
                      <GradientButton
                        title="Save Profile"
                        onPress={handleSubmit}
                        isLoading={isLoading}
                      />
                    </View>

                    {/* Modals */}
                    <DatePickerModal
                      visible={showDatePicker}
                      onClose={() => setShowDatePicker(false)}
                      onSelect={(date: string) => {
                        setFieldValue('dateOfBirth', date);
                        setShowDatePicker(false);
                      }}
                    />

                    <PickerModal
                      visible={showGenderPicker}
                      onClose={() => setShowGenderPicker(false)}
                      options={genderOptions}
                      onSelect={(gender: string) => {
                        setFieldValue('gender', gender);
                        setShowGenderPicker(false);
                      }}
                      title="Select Gender"
                    />
                  </View>
                )}
              </Formik>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Profile;
