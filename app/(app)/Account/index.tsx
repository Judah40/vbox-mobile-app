import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, Switch } from 'react-native';
import { Feather } from '@expo/vector-icons';

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
      privateAccount: false
    }
  });

  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({...userData});

  // Stats items to display
  const statsItems = [
    { icon: 'users', label: 'Followers', value: userData.followers.toLocaleString() },
    { icon: 'user-plus', label: 'Following', value: userData.following.toLocaleString() },
    { icon: 'eye', label: 'Total Views', value: userData.totalViews.toLocaleString() }
  ];

  // Menu items to display
  const menuItems = [
    { icon: 'bookmark', label: 'Saved Streams', action: () => console.log('Saved Streams') },
    { icon: 'clock', label: 'Watch History', action: () => console.log('Watch History') },
    { icon: 'heart', label: 'Liked Content', action: () => console.log('Liked Content') },
    { icon: 'bell', label: 'Notification Settings', action: () => console.log('Notifications') },
    { icon: 'shield', label: 'Privacy Settings', action: () => console.log('Privacy') },
    { icon: 'help-circle', label: 'Help & Support', action: () => console.log('Help') },
    { icon: 'log-out', label: 'Sign Out', action: () => console.log('Sign Out') }
  ];

  const handleSaveProfile = () => {
    setUserData(editData);
    setEditMode(false);
  };

  const togglePreference = (key) => {
    setEditData({
      ...editData,
      preferences: {
        ...editData.preferences,
        [key]: !editData.preferences[key]
      }
    });
  };

  return (
    <ScrollView className="flex-1 bg-gray-900">
      {/* Cover Image & Avatar */}
      <View className="relative">
        <Image
          source={{ uri: userData.coverImage }}
          className="w-full h-48"
          resizeMode="cover"
        />
        
        <View className="absolute inset-0 bg-black bg-opacity-40" />
        
        {editMode && (
          <TouchableOpacity 
            className="absolute top-4 right-4 bg-gray-800 bg-opacity-70 p-2 rounded-full"
            onPress={() => console.log('Change cover image')}
          >
            <Feather name="camera" size={18} color="#EAB308" />
          </TouchableOpacity>
        )}
        
        <View className="absolute -bottom-16 left-4 border-4 border-gray-900 rounded-full">
          <Image
            source={{ uri: userData.avatar }}
            className="w-32 h-32 rounded-full"
          />
          {editMode && (
            <TouchableOpacity 
              className="absolute bottom-0 right-0 bg-yellow-500 p-2 rounded-full"
              onPress={() => console.log('Change avatar')}
            >
              <Feather name="camera" size={16} color="#000" />
            </TouchableOpacity>
          )}
        </View>
        
        {!editMode && (
          <TouchableOpacity 
            className="absolute top-4 right-4 bg-gray-800 bg-opacity-70 px-3 py-2 rounded-lg flex-row items-center"
            onPress={() => setEditMode(true)}
          >
            <Feather name="edit-2" size={14} color="#EAB308" />
            <Text className="text-yellow-500 ml-1 font-medium">Edit Profile</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Profile Info */}
      <View className="mt-20 px-4">
        {editMode ? (
          <View>
            <TextInput
              className="text-white text-xl font-bold pb-1 border-b border-gray-700"
              value={editData.displayName}
              onChangeText={(text) => setEditData({...editData, displayName: text})}
              placeholderTextColor="#9CA3AF"
            />
            <View className="flex-row items-center mt-1">
              <Text className="text-gray-400 text-sm">@</Text>
              <TextInput
                className="text-gray-400 text-sm"
                value={editData.username}
                onChangeText={(text) => setEditData({...editData, username: text})}
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <TextInput
              className="text-gray-300 mt-3 pb-1 border-b border-gray-700"
              value={editData.email}
              onChangeText={(text) => setEditData({...editData, email: text})}
              keyboardType="email-address"
              placeholderTextColor="#9CA3AF"
            />
            <TextInput
              className="text-gray-300 mt-3 pb-1 border-b border-gray-700 min-h-12"
              value={editData.bio}
              onChangeText={(text) => setEditData({...editData, bio: text})}
              multiline
              placeholderTextColor="#9CA3AF"
              placeholder="Add a bio..."
            />
          </View>
        ) : (
          <View>
            <View className="flex-row items-center">
              <Text className="text-white text-xl font-bold">{userData.displayName}</Text>
              {userData.isCreator && (
                <View className="ml-2 bg-yellow-500 rounded-full w-5 h-5 items-center justify-center">
                  <Feather name="check" size={14} color="#000" />
                </View>
              )}
            </View>
            <Text className="text-gray-400 mt-1">@{userData.username}</Text>
            <Text className="text-gray-300 mt-3">{userData.bio}</Text>
          </View>
        )}
      </View>

      {/* Stats */}
      <View className="flex-row justify-around mt-6 px-4 py-4 bg-gray-800 mx-4 rounded-xl">
        {statsItems.map((item, index) => (
          <View key={index} className="items-center">
            <Feather name={item.icon} size={18} color="#EAB308" />
            <Text className="text-white font-bold mt-1">{item.value}</Text>
            <Text className="text-gray-400 text-sm">{item.label}</Text>
          </View>
        ))}
      </View>

      {/* Edit Mode - Preferences */}
      {editMode && (
        <View className="mt-6 px-4">
          <Text className="text-white text-lg font-bold mb-4">Preferences</Text>
          
          {Object.entries(editData.preferences).map(([key, value]) => (
            <View key={key} className="flex-row justify-between items-center py-3 border-b border-gray-800">
              <Text className="text-gray-300 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Text>
              <Switch
                trackColor={{ false: "#4B5563", true: "#FCD34D" }}
                thumbColor={value ? "#EAB308" : "#F3F4F6"}
                ios_backgroundColor="#4B5563"
                onValueChange={() => togglePreference(key)}
                value={value}
              />
            </View>
          ))}
          
          <View className="flex-row mt-6">
            <TouchableOpacity 
              className="bg-yellow-500 rounded-lg px-4 py-3 flex-1 mr-2 items-center"
              onPress={handleSaveProfile}
            >
              <Text className="text-gray-900 font-bold">Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="bg-gray-700 rounded-lg px-4 py-3 flex-1 items-center"
              onPress={() => {
                setEditData({...userData});
                setEditMode(false);
              }}
            >
              <Text className="text-white font-bold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Regular Menu */}
      {!editMode && (
        <View className="mt-6 px-4 pb-8">
          <Text className="text-white text-lg font-bold mb-2">Settings</Text>
          
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index}
              className="flex-row items-center py-4 border-b border-gray-800"
              onPress={item.action}
            >
              <Feather name={item.icon} size={20} color="#EAB308" />
              <Text className="text-gray-300 ml-3">{item.label}</Text>
              <Feather name="chevron-right" size={18} color="#6B7280" className="ml-auto" />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default UserProfile;