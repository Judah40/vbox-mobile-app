import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
// import * as Haptics from 'expo-haptics';
import { updateProfilePicture } from '../api/auth';

const ProfilePictureUpload = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // Request permissions on mount
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(status === 'granted');

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please grant camera roll permissions to upload your profile picture.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Settings',
              onPress: () => ImagePicker.requestMediaLibraryPermissionsAsync(),
            },
          ]
        );
      }
    })();
  }, []);

  // Pick image from gallery
  const pickImageFromGallery = async () => {
    try {
      //   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        // Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  // Take photo with camera
  const takePhoto = async () => {
    try {
      //   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Request camera permission
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant camera permissions to take a photo.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        // Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  // Show action sheet for image selection
  const showImageOptions = () => {
    Alert.alert(
      'Choose Photo',
      'Select a photo from your gallery or take a new one',
      [
        {
          text: 'Take Photo',
          onPress: takePhoto,
        },
        {
          text: 'Choose from Gallery',
          onPress: pickImageFromGallery,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  // Remove selected image
  const removeImage = () => {
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('Remove Photo', 'Are you sure you want to remove this photo?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          setSelectedImage(null);
          //   Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        },
      },
    ]);
  };

  // Upload image
  const handleUpload = async () => {
    if (!selectedImage) {
      Alert.alert('No Image Selected', 'Please select an image to upload.');
      return;
    }

    setIsUploading(true);
    // Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      const filename = selectedImage.split('/').pop() || 'profile.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('profile_picture', {
        uri: selectedImage,
        type: type,
        name: filename,
      } as any);

      await updateProfilePicture(formData);

      Alert.alert('Success', 'Profile picture uploaded successfully!', [
        {
          text: 'OK',
          onPress: () => {
            // Navigate to next screen
            router.push('/(app)/Home');
          },
        },
      ]);
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload Failed', 'Failed to upload profile picture. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Skip upload
  const handleSkip = () => {
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('Skip Upload', 'You can upload your profile picture later from settings.', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Skip',
        onPress: () => {
          // Navigate to next screen
          router.push('/(app)/Home');
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-black" edges={['top']}>
      {/* Animated Background Gradients */}
      <View className="absolute inset-0">
        <View className="absolute right-10 top-20 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />
        <View className="absolute bottom-32 left-10 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
      </View>

      <View className="flex-1 px-6 pt-6">
        {/* Header Section */}
        <View className="mb-12 items-center">
          {/* Icon Container */}
          <View className="mb-6 h-20 w-20 items-center justify-center overflow-hidden rounded-2xl shadow-lg shadow-purple-500/30">
            <LinearGradient
              colors={['#8B5CF6', '#6366F1']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="h-full w-full items-center justify-center">
              <Ionicons name="camera" size={40} color="white" />
            </LinearGradient>
          </View>

          {/* Title */}
          <Text className="mb-3 text-center text-4xl font-bold">
            <Text className="text-purple-500">Upload Your </Text>
            <Text className="text-blue-500">Photo</Text>
          </Text>

          {/* Subtitle */}
          <Text className="px-8 text-center text-base text-gray-400">
            Add a profile picture so others can recognize you
          </Text>
        </View>

        {/* Profile Picture Container */}
        <View className="mb-8 items-center">
          <View className="relative">
            {/* Main Circle */}
            <TouchableOpacity
              onPress={showImageOptions}
              activeOpacity={0.8}
              disabled={isUploading}
              className="h-48 w-48 overflow-hidden rounded-full border-4 border-gray-800 bg-gray-900">
              {selectedImage ? (
                <Image
                  source={{ uri: selectedImage }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="h-full w-full items-center justify-center bg-gray-900">
                  <Ionicons name="person" size={80} color="#4B5563" />
                </View>
              )}

              {/* Uploading Overlay */}
              {isUploading && (
                <View className="absolute inset-0 items-center justify-center bg-black/70">
                  <ActivityIndicator size="large" color="#8B5CF6" />
                  <Text className="mt-3 font-medium text-white">Uploading...</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Camera Button */}
            <TouchableOpacity
              onPress={showImageOptions}
              disabled={isUploading}
              activeOpacity={0.8}
              className="absolute bottom-2 right-2 h-14 w-14 overflow-hidden rounded-full shadow-lg">
              <LinearGradient
                colors={['#8B5CF6', '#6366F1']}
                className="h-full w-full items-center justify-center">
                <Ionicons name="camera" size={24} color="white" />
              </LinearGradient>
            </TouchableOpacity>

            {/* Remove Button */}
            {selectedImage && !isUploading && (
              <TouchableOpacity
                onPress={removeImage}
                activeOpacity={0.8}
                className="absolute right-2 top-2 h-10 w-10 items-center justify-center rounded-full bg-red-500 shadow-lg">
                <Ionicons name="close" size={20} color="white" />
              </TouchableOpacity>
            )}
          </View>

          {/* Tap to change text */}
          <TouchableOpacity onPress={showImageOptions} disabled={isUploading} className="mt-4">
            <Text className="text-base font-medium text-purple-500">
              {selectedImage ? 'Tap to change photo' : 'Tap to add photo'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Image Options Buttons */}
        <View className="mb-8 gap-3">
          {/* Gallery Button */}
          <TouchableOpacity
            onPress={pickImageFromGallery}
            disabled={isUploading}
            activeOpacity={0.7}
            className="overflow-hidden rounded-xl border-2 border-gray-800">
            <View className="flex-row items-center justify-center bg-gray-900 p-4">
              <Ionicons name="images" size={24} color="#8B5CF6" />
              <Text className="ml-3 text-base font-medium text-white">Choose from Gallery</Text>
            </View>
          </TouchableOpacity>

          {/* Camera Button */}
          <TouchableOpacity
            onPress={takePhoto}
            disabled={isUploading}
            activeOpacity={0.7}
            className="overflow-hidden rounded-xl border-2 border-gray-800">
            <View className="flex-row items-center justify-center bg-gray-900 p-4">
              <Ionicons name="camera" size={24} color="#6366F1" />
              <Text className="ml-3 text-base font-medium text-white">Take a Photo</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Bottom Actions */}
        <View className="flex-1 justify-end pb-8">
          <View className="gap-3">
            {/* Upload Button */}
            <TouchableOpacity
              onPress={handleUpload}
              disabled={!selectedImage || isUploading}
              activeOpacity={0.8}
              className={`overflow-hidden rounded-xl shadow-lg ${
                !selectedImage || isUploading ? 'opacity-50' : ''
              }`}>
              <LinearGradient
                colors={['#8B5CF6', '#6366F1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="px-8 py-4">
                <View className="flex-row items-center justify-center gap-2">
                  {isUploading ? (
                    <>
                      <ActivityIndicator size="small" color="white" />
                      <Text className="text-base font-bold text-white">Uploading...</Text>
                    </>
                  ) : (
                    <>
                      <Text className="text-base font-bold text-white">Upload Photo</Text>
                      <Ionicons name="cloud-upload" size={20} color="white" />
                    </>
                  )}
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Skip Button */}
            <TouchableOpacity
              onPress={handleSkip}
              disabled={isUploading}
              className="rounded-xl border-2 border-gray-700 bg-gray-900 px-6 py-4 active:bg-gray-800">
              <Text className="text-center font-medium text-gray-300">Skip for now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfilePictureUpload;
