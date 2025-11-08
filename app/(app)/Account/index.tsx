import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '~/app/contexts/AuthContext';
// import { string } from 'yup';

const UserProfile = () => {
  // Stats items to display
  // const statsItems = [
  //   { icon: 'users', label: 'Followers', value: userData.followers.toLocaleString() },
  //   { icon: 'user-plus', label: 'Favorites', value: userData.following.toLocaleString() },
  //   { icon: 'eye', label: 'Total watch', value: userData.totalViews.toLocaleString() },
  // ];

  // Menu items to display
  const menuItems = [
    { icon: 'bookmark', label: 'Saved Videos', action: () => router.push('/(app)/Account/Saved') },
    { icon: 'clock', label: 'Watch History', action: () => router.push('/(app)/Account/Watch') },
    { icon: 'heart', label: 'Liked Videos', action: () => router.push('/(app)/Account/Liked') },
    {
      icon: 'bell',
      label: 'Notification Settings',
      action: () => router.push('/(app)/Account/Notification'),
    },
    {
      icon: 'shield',
      label: 'Privacy Settings',
      action: () => router.push('/(app)/Account/Privacy'),
    },
    { icon: 'help-circle', label: 'Help & Support', action: () => console.log('Help') },
    {
      icon: 'log-out',
      label: 'Sign Out',
      action: () => {
        if (onLogout) {
          onLogout();
        }
      },
    },
  ];

  const { userProfilePicture, userDetails, onLogout } = useAuth();

  useEffect(() => {}, [userProfilePicture, userDetails]);
  return (
    <ScrollView className="flex-1 bg-black">
      <SafeAreaView>
        {/* Cover Image & Avatar */}
        <View className="relative">
          <Image
            source={{ uri: userProfilePicture ? userProfilePicture : null }}
            className="z-30 h-48 w-full"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-black bg-opacity-40" />

          <View className="absolute -bottom-16 left-4 rounded-full border-4 border-gray-900">
            <Image
              source={{ uri: userProfilePicture ? userProfilePicture : null }}
              className="z-40 h-32 w-32 rounded-full"
            />
          </View>
          <TouchableOpacity className=" absolute right-5 top-5 z-50 h-8 w-36 flex-row items-center justify-center gap-2 rounded bg-yellow-500">
            <Feather name="pen-tool" />
            <Text className="font-bold">Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View className="mt-20 flex-row justify-between px-4">
          <View>
            <View className="flex-row items-center">
              <Text className="text-xl font-bold text-white">{`${userDetails?.firstName && userDetails?.firstName} ${userDetails?.lastName && userDetails?.lastName}`}</Text>
              <View className="ml-2 h-5 w-5 items-center justify-center rounded-full bg-yellow-500">
                <Feather name="check" size={14} color="#000" />
              </View>
            </View>
            <Text className="mt-1 text-gray-400">@{userDetails && userDetails?.username}</Text>
          </View>
        </View>

        {/* Stats */}
        {/* <View className="mx-4 mt-6 flex-row justify-around rounded-xl bg-gray-800 px-4 py-4">
          {statsItems.map((item, index) => (
            <View key={index} className="items-center">
              <Feather name={item.icon} size={18} color="#EAB308" />
              <Text className="mt-1 font-bold text-white">{item.value}</Text>
              <Text className="text-sm text-gray-400">{item.label}</Text>
            </View>
          ))}
        </View> */}

        {/* Regular Menu */}
        <View className="mt-6 px-4 pb-8">
          <Text className="mb-2 text-lg font-bold text-white">Settings</Text>

          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row items-center border-b border-gray-800 py-4"
              onPress={item.action}>
              <Feather name={item.icon} size={20} color="#EAB308" />
              <Text className="ml-3 text-gray-300">{item.label}</Text>
              <Feather name="chevron-right" size={18} color="#6B7280" className="ml-auto" />
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default UserProfile;
