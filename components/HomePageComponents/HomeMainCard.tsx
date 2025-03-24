import { View, Text, Image, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import Carousel from 'react-native-reanimated-carousel';
import { handleGetPostByGenre } from '~/app/api/videos/api';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');

export interface PostItem {
  id: number;
  postId: string;
  userId: number;
  content: string;
  thumbnailUrl: string;
  bannerUrl: string;
  caption: string;
  location: string;
  creator?: string;
  timestamp?: string;
  likes?: number;
  category?: string;
}

const PostCarousel = ({ onPostPress, genre = 'Music' }) => {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Enhanced carousel item with beautiful styling
  const CarouselItem = ({ item, index, animationValue }) => {
    const animatedStyle = useAnimatedStyle(() => {
      const scale = interpolate(
        animationValue.value,
        [(index - 1) * screenWidth, index * screenWidth, (index + 1) * screenWidth],
        [0.9, 1, 0.9]
      );
      
      return {
        transform: [{ scale }]
      };
    });
    
    return (
      <TouchableOpacity 
        activeOpacity={0.9}
        onPress={() => onPostPress?.(item)}
        style={styles.itemContainer}
      >
        <Animated.View style={[styles.animatedCard, animatedStyle]}>
          <Image 
            source={{ uri: item.bannerUrl }} 
            style={styles.bannerImage}
          />
          
          {/* Gradient overlay for better text visibility */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
            style={styles.gradient}
          >
            {/* Category tag */}
            <View style={styles.categoryContainer}>
              <View style={styles.categoryTag}>
                <Text style={styles.categoryText}>{item.category || 'FEATURED'}</Text>
              </View>
            </View>
            
            {/* Content overlay */}
            <View style={styles.contentContainer}>
              {/* Creator info */}
              <View style={styles.creatorRow}>
                <Image 
                  source={{ uri: `https://randomuser.me/api/portraits/${index % 2 ? 'men' : 'women'}/${(index % 10) + 1}.jpg` }} 
                  style={styles.creatorAvatar} 
                />
                <View style={styles.creatorInfo}>
                  <Text style={styles.creatorName}>{item.creator || 'Content Creator'}</Text>
                  <Text style={styles.timestamp}>{item.timestamp || '2 hours ago'}</Text>
                </View>
              </View>
              
              {/* Caption */}
              <Text style={styles.caption}>{item.caption}</Text>
              
              {/* Details row */}
              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  <FontAwesome5 name="map-marker-alt" size={12} color="white" />
                  <Text style={styles.detailText}>{item.location}</Text>
                </View>
                
                <View style={styles.detailItem}>
                  <FontAwesome5 name="heart" size={12} color="white" />
                  <Text style={styles.detailText}>{item.likes || '2.4k'}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
          
          {/* Post number badge */}
          <View style={styles.numberBadge}>
            <Text style={styles.numberText}>{index + 1}</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };
  
  // Pagination indicators
  const Pagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {posts.map((_, index) => (
          <View 
            key={index}
            style={[
              styles.paginationDot,
              activeIndex === index ? styles.activeDot : styles.inactiveDot
            ]}
          />
        ))}
      </View>
    );
  };

  useEffect(() => {
    // Data fetching with enhanced post metadata
    handleGetPostByGenre(genre)
      .then((response) => {
        // Enhance the data with additional details
        const enhancedData = response.data.post.map((item: PostItem, index: number) => ({
          ...item,
          creator: item.creator || getRandomCreator(),
          timestamp: item.timestamp || getRandomTimestamp(),
          likes: item.likes || Math.floor(Math.random() * 9000) + 500,
          category: item.category || getRandomCategory(),
        }));
        setPosts(enhancedData);
      })
      .catch((error) => {
        console.log(error.response?.data || error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [genre]);
  
  // Helper functions for realistic data
  const getRandomCreator = () => {
    const creators = [
      'James Arthur', 'Emma Wilson', 'Michael Scott', 
      'Sarah Johnson', 'Robert Chen', 'Alex Morgan'
    ];
    return creators[Math.floor(Math.random() * creators.length)];
  };
  
  const getRandomTimestamp = () => {
    const times = ['Just now', '2 min ago', '15 min ago', '1 hour ago', '3 hours ago', 'Yesterday'];
    return times[Math.floor(Math.random() * times.length)];
  };
  
  const getRandomCategory = () => {
    const categories = ['TRENDING', 'POPULAR', 'FEATURED', 'NEW', 'RECOMMENDED'];
    return categories[Math.floor(Math.random() * categories.length)];
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading posts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Title section */}
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.headerTitle}>Trending Posts</Text>
          <Text style={styles.headerSubtitle}>Discover amazing content</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      
      {/* Carousel container */}
      <View style={styles.carouselContainer}>
        <Carousel
          data={posts}
          renderItem={({ item, index, animationValue }) => (
            <CarouselItem item={item} index={index} animationValue={animationValue} />
          )}
          width={screenWidth * 0.9}
          height={250}
          loop
          autoPlay
          autoPlayInterval={5000}
          onSnapToItem={(index) => setActiveIndex(index)}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.9,
            parallaxScrollingOffset: 50,
          }}
        />
      </View>
      
      {/* Pagination dots */}
      <Pagination />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 24,
  },
  loadingContainer: {
    width: '100%',
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#757575',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#212121',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#757575',
  },
  viewAllText: {
    color: '#e53935',
    fontWeight: '600',
  },
  carouselContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 250,
  },
  itemContainer: {
    width: '100%',
    height: '100%',
    padding: 5,
  },
  animatedCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    justifyContent: 'space-between',
    padding: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  categoryTag: {
    backgroundColor: '#e53935',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  contentContainer: {
    justifyContent: 'flex-end',
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  creatorAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'white',
    marginRight: 8,
  },
  creatorInfo: {
    flex: 1,
  },
  creatorName: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  timestamp: {
    color: '#e0e0e0',
    fontSize: 11,
  },
  caption: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    color: '#e0e0e0',
    fontSize: 12,
    marginLeft: 6,
  },
  numberBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  paginationDot: {
    height: 2,
    borderRadius: 1,
    marginHorizontal: 2,
  },
  activeDot: {
    width: 24,
    backgroundColor: '#e53935',
  },
  inactiveDot: {
    width: 8,
    backgroundColor: '#bdbdbd',
  }
});

export default PostCarousel;