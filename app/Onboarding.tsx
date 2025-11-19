import { View, Text, Image, Dimensions, ImageBackground, StatusBar } from 'react-native';
import React, { JSX } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import GradientButton from '~/components/GradientButton';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

type OnboardingItem = {
  title: string;
  description: string;
  image: any; // Replace 'any' with the appropriate type for your images
};

type RenderContentProps = {
  item: OnboardingItem;
  index: number;
};

const dimensions = Dimensions.get('window');
const Onboarding = () => {
  const flatListRedf = React.useRef<FlatList<OnboardingItem>>(null);

  const handleNext = async (index: number) => {
    if (index < onboardingData.length - 1) {
      flatListRedf.current?.scrollToIndex({ index: index + 1 });
    } else {
      await AsyncStorage.setItem('onboarding', 'true');
      router.push('/(auth)/login');
    }
  };
  const onboardingData: OnboardingItem[] = [
    {
      title: 'Welcome to Our App',
      description: 'Discover new features and functionalities to enhance your experience.',
      image: require('../assets/onboarding1.jpg'), // Replace with your image path
    },
    {
      title: 'Stay Connected',
      description: 'Connect with friends and share your moments seamlessly.',
      image: require('../assets/onboarding2.jpg'), // Replace with your image path
    },
    {
      title: 'Achieve More',
      description: 'Utilize our tools to boost your productivity and reach your goals.',
      image: require('../assets/onboarding3.jpg'), // Replace with your image path
    },
  ];

  const renderContent = ({ item, index }: RenderContentProps): JSX.Element => {
    return (
      <ImageBackground
        source={item.image}
        style={{ width: dimensions.width }}
        resizeMode="cover"
        className="flex-1  ">
        <View
          style={{ height: dimensions.height / 1.8, paddingTop: StatusBar.currentHeight! + 10 }}
          className="">
          <Image source={require('../assets/vbox.png')} style={{ width: 80, height: 80 }} />
        </View>

        <View className="relative  flex-1  bg-black/85" style={{ borderRadius: 40 }}>
          <View
            className="absolute  w-full  gap-6 px-8"
            style={{
              bottom: 150,
            }}>
            <Text className="text-4xl font-bold text-white">{item.title}</Text>
            <Text className="text-sm text-gray-400">{item.description}</Text>
            <View className="flex-row items-center justify-center gap-2">
              {[0, 1, 2].map((value) => (
                <View
                  className={`${index === value ? 'h-1 w-4 rounded-full bg-yellow-500' : 'h-1 w-1 rounded-full bg-gray-800'} `}
                />
              ))}
            </View>
            <GradientButton
              title={index === 2 ? 'Get Started' : 'Next'}
              onPress={() => {
                handleNext(index);
              }}
              isLoading={false}
            />
          </View>
        </View>
      </ImageBackground>
    );
  };
  return (
    <FlatList
      data={onboardingData}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderContent}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      ref={flatListRedf}
    />
  );
};

export default Onboarding;
