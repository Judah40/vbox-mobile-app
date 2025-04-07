import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, Switch } from 'react-native';
// import { string } from 'yup';

const UserProfile = () => {
  // Sample user data - would be fetched from your API
  const [userData, setUserData] = useState({
    username: 'alex_streamer',
    displayName: 'Alex Johnson',
    bio: 'Content creator focused on gaming and tech. Live streams every Tuesday and Friday at 8PM EST.',
    avatar: 'https://via.placeholder.com/200',
    coverImage: 'https://via.placeholder.com/800',
    email: 'alex.johnson@example.com',
    followers: 12580,
    following: 351,
    totalViews: 458762,
    isCreator: true,
    preferences: {
      darkMode: true,
      notifications: true,
      autoplayVideos: true,
      showOnlineStatus: true,
      privateAccount: false,
    },
  });

  type SettingKey =
    | 'darkMode'
    | 'notifications'
    | 'autoplayVideos'
    | 'showOnlineStatus'
    | 'privateAccount';

  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ ...userData });

  // Stats items to display
  const statsItems = [
    { icon: 'users', label: 'Followers', value: userData.followers.toLocaleString() },
    { icon: 'user-plus', label: 'Following', value: userData.following.toLocaleString() },
    { icon: 'eye', label: 'Total Views', value: userData.totalViews.toLocaleString() },
  ];

  // Menu items to display
  const menuItems = [
    { icon: 'bookmark', label: 'Saved Streams', action: () => console.log('Saved Streams') },
    { icon: 'clock', label: 'Watch History', action: () => console.log('Watch History') },
    { icon: 'heart', label: 'Liked Content', action: () => console.log('Liked Content') },
    { icon: 'bell', label: 'Notification Settings', action: () => console.log('Notifications') },
    { icon: 'shield', label: 'Privacy Settings', action: () => console.log('Privacy') },
    { icon: 'help-circle', label: 'Help & Support', action: () => console.log('Help') },
    { icon: 'log-out', label: 'Sign Out', action: () => console.log('Sign Out') },
  ];

  const handleSaveProfile = () => {
    setUserData(editData);
    setEditMode(false);
  };

  const togglePreference = (key: SettingKey) => {
    setEditData({
      ...editData,
      preferences: {
        ...editData.preferences,
        [key]: !editData.preferences[key],
      },
    });
  };

  return (
    <ScrollView className="flex-1 bg-gray-900">
      {/* Cover Image & Avatar */}
      <View className="relative">
        <Image source={{ uri: userData.coverImage }} className="h-48 w-full" resizeMode="cover" />
        <View className="absolute inset-0 bg-black bg-opacity-40" />
        {editMode && (
          <TouchableOpacity
            className="absolute right-4 top-4 rounded-full bg-gray-800 bg-opacity-70 p-2"
            onPress={() => console.log('Change cover image')}>
            <Feather name="camera" size={18} color="#EAB308" />
          </TouchableOpacity>
        )}

        <View className="absolute -bottom-16 left-4 rounded-full border-4 border-gray-900">
          <Image source={{ uri: userData.avatar }} className="h-32 w-32 rounded-full" />
          {editMode && (
            <TouchableOpacity
              className="absolute bottom-0 right-0 rounded-full bg-yellow-500 p-2"
              onPress={() => console.log('Change avatar')}>
              <Feather name="camera" size={16} color="#000" />
            </TouchableOpacity>
          )}
        </View>

        {!editMode && (
          <TouchableOpacity
            className="absolute right-4 top-4 flex-row items-center rounded-lg bg-gray-800 bg-opacity-70 px-3 py-2"
            onPress={() => setEditMode(true)}>
            <Feather name="edit-2" size={14} color="#EAB308" />
            <Text className="ml-1 font-medium text-yellow-500">Edit Profile</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Profile Info */}
      <View className="mt-20 px-4">
        {editMode ? (
          <View>
            <TextInput
              className="border-b border-gray-700 pb-1 text-xl font-bold text-white"
              value={editData.displayName}
              onChangeText={(text) => setEditData({ ...editData, displayName: text })}
              placeholderTextColor="#9CA3AF"
            />
            <View className="mt-1 flex-row items-center">
              <Text className="text-sm text-gray-400">@</Text>
              <TextInput
                className="text-sm text-gray-400"
                value={editData.username}
                onChangeText={(text) => setEditData({ ...editData, username: text })}
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <TextInput
              className="mt-3 border-b border-gray-700 pb-1 text-gray-300"
              value={editData.email}
              onChangeText={(text) => setEditData({ ...editData, email: text })}
              keyboardType="email-address"
              placeholderTextColor="#9CA3AF"
            />
            <TextInput
              className="mt-3 min-h-12 border-b border-gray-700 pb-1 text-gray-300"
              value={editData.bio}
              onChangeText={(text) => setEditData({ ...editData, bio: text })}
              multiline
              placeholderTextColor="#9CA3AF"
              placeholder="Add a bio..."
            />
          </View>
        ) : (
          <View>
            <View className="flex-row items-center">
              <Text className="text-xl font-bold text-white">{userData.displayName}</Text>
              {userData.isCreator && (
                <View className="ml-2 h-5 w-5 items-center justify-center rounded-full bg-yellow-500">
                  <Feather name="check" size={14} color="#000" />
                </View>
              )}
            </View>
            <Text className="mt-1 text-gray-400">@{userData.username}</Text>
            <Text className="mt-3 text-gray-300">{userData.bio}</Text>
          </View>
        )}
      </View>

      {/* Stats */}
      <View className="mx-4 mt-6 flex-row justify-around rounded-xl bg-gray-800 px-4 py-4">
        {statsItems.map((item, index) => (
          <View key={index} className="items-center">
            <Feather name:string={item.icon} size={18} color="#EAB308" />
            <Text className="mt-1 font-bold text-white">{item.value}</Text>
            <Text className="text-sm text-gray-400">{item.label}</Text>
          </View>
        ))}
      </View>

      {/* Edit Mode - Preferences */}
      {editMode && (
        <View className="mt-6 px-4">
          <Text className="mb-4 text-lg font-bold text-white">Preferences</Text>

          {Object.entries(editData.preferences).map(([key, value]) => (
            <View
              key={key}
              className="flex-row items-center justify-between border-b border-gray-800 py-3">
              <Text className="capitalize text-gray-300">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </Text>
              <Switch
                trackColor={{ false: '#4B5563', true: '#FCD34D' }}
                thumbColor={value ? '#EAB308' : '#F3F4F6'}
                ios_backgroundColor="#4B5563"
                onValueChange={() => togglePreference(key as SettingKey)}
                value={value}
              />
            </View>
          ))}

          <View className="mt-6 flex-row">
            <TouchableOpacity
              className="mr-2 flex-1 items-center rounded-lg bg-yellow-500 px-4 py-3"
              onPress={handleSaveProfile}>
              <Text className="font-bold text-gray-900">Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 items-center rounded-lg bg-gray-700 px-4 py-3"
              onPress={() => {
                setEditData({ ...userData });
                setEditMode(false);
              }}>
              <Text className="font-bold text-white">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Regular Menu */}
      {!editMode && (
        <View className="mt-6 px-4 pb-8">
          <Text className="mb-2 text-lg font-bold text-white">Settings</Text>

          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row items-center border-b border-gray-800 py-4"
              onPress={item.action}>
              <Feather name:string={item.icon} size={20} color="#EAB308" />
              <Text className="ml-3 text-gray-300">{item.label}</Text>
              <Feather name="chevron-right" size={18} color="#6B7280" className="ml-auto" />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default UserProfile;
