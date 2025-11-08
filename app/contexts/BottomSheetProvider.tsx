import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import {
  Modal,
  View,
  ActivityIndicator,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { handleGetSinglePost } from '../api/videos/api';
import { router } from 'expo-router';
import { useStreamContext } from './streamContext';
import { Channel as StreamChannel } from 'stream-chat';
import { Chat, Channel, MessageList, MessageInput, OverlayProvider } from 'stream-chat-expo';

type BottomSheetContextType = {
  openSheetWithId: (id: string) => void;
  closeSheet: () => void;
};

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(undefined);

export const BottomSheetProvider = ({ children }: { children: ReactNode }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [postId, setPostId] = useState('');
  const [channel, setChannel] = useState<StreamChannel | null>(null);
  const [commentsExpanded, setCommentsExpanded] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const animatedHeight = useState(new Animated.Value(0))[0];
  const rotateAnim = useState(new Animated.Value(0))[0];
  const { chatClient } = useStreamContext();

  const openSheetWithId = useCallback(
    async (id: string) => {
      if (!chatClient) return;

      try {
        setLoading(true);
        setData(null);
        setModalVisible(true);
        setPostId(id);

        const response = await handleGetSinglePost(id);
        setData(response.data.post);

        // Create and watch channel
        const newChannel = chatClient.channel('livestream', `video-${id}`);
        await newChannel.watch();
        setChannel(newChannel);

        // Get comment count
        const state = newChannel.state;
        setCommentCount(state.messages.length || 0);
      } catch (error) {
        console.error('Error fetching post details:', error);
      } finally {
        setLoading(false);
      }
    },
    [chatClient]
  );

  const closeSheet = useCallback(() => {
    setModalVisible(false);

    // Clean up channel
    if (channel) {
      channel.stopWatching().catch(console.error);
    }

    setTimeout(() => {
      setData(null);
      setChannel(null);
      setPostId('');
      setCommentsExpanded(false);
    }, 300);
  }, [channel]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleComments = () => {
    const toValue = commentsExpanded ? 0 : 1;

    Animated.parallel([
      Animated.spring(animatedHeight, {
        toValue,
        useNativeDriver: false,
        tension: 50,
        friction: 8,
      }),
      Animated.timing(rotateAnim, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    setCommentsExpanded(!commentsExpanded);
  };

  const heightInterpolate = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 500],
  });

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <BottomSheetContext.Provider value={{ openSheetWithId, closeSheet }}>
      {children}

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeSheet}
        statusBarTranslucent={true}>
        <View className="flex-1 bg-black pt-10">
          {/* Header with close button */}
          <View className="flex-row items-center justify-between border-b border-zinc-800 px-4 py-2">
            <Text className="text-lg font-semibold text-white">Details</Text>
            <Pressable onPress={closeSheet} className="p-2">
              <Ionicons name="close" size={24} color="#fff" />
            </Pressable>
          </View>

          <ScrollView className="flex-1 bg-black" showsVerticalScrollIndicator={false}>
            {loading ? (
              <View className="flex-1 items-center justify-center py-20">
                <ActivityIndicator size="large" color="#e50914" />
                <Text className="mt-4 text-gray-400">Loading details...</Text>
              </View>
            ) : data ? (
              <View className="flex-1">
                {/* Thumbnail with Gradient Overlay */}
                <View className="relative h-64 w-full">
                  <Image
                    source={{ uri: data.thumbnailUrl }}
                    className="h-full w-full"
                    resizeMode="cover"
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)', '#000000']}
                    className="absolute bottom-0 left-0 right-0 h-32"
                  />

                  {/* Duration Badge */}
                  <View className="absolute right-4 top-4 rounded bg-black/70 px-2 py-1">
                    <Text className="text-xs font-semibold text-white">
                      {formatDuration(data.duration)}
                    </Text>
                  </View>
                </View>

                {/* Content */}
                <View className="-mt-8 px-4">
                  {/* Title */}
                  <Text className="mb-2 text-2xl font-bold text-white">{data.title}</Text>

                  {/* Metadata Row */}
                  <View className="mb-4 flex-row flex-wrap items-center">
                    <View className="mb-2 mr-4 flex-row items-center">
                      <Ionicons name="eye" size={16} color="#9ca3af" />
                      <Text className="ml-1 text-sm text-gray-400">
                        {formatNumber(data.viewCount)} views
                      </Text>
                    </View>
                    <View className="mb-2 mr-4 flex-row items-center">
                      <Ionicons name="heart" size={16} color="#9ca3af" />
                      <Text className="ml-1 text-sm text-gray-400">
                        {formatNumber(data.likeCount)}
                      </Text>
                    </View>
                    {data.location && (
                      <View className="mb-2 flex-row items-center">
                        <Ionicons name="location" size={16} color="#9ca3af" />
                        <Text className="ml-1 text-sm text-gray-400">{data.location}</Text>
                      </View>
                    )}
                  </View>

                  {/* Action Buttons */}
                  <View className="mb-6 flex-row gap-3">
                    <TouchableOpacity
                      onPress={() => {
                        closeSheet();
                        router.push({
                          pathname: '/Player',
                          params: {
                            url: postId,
                          },
                        });
                      }}
                      className="flex-1 flex-row items-center justify-center rounded-md bg-white py-3">
                      <Ionicons name="play" size={20} color="#000" />
                      <Text className="ml-2 text-base font-bold text-black">Play</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="items-center justify-center rounded-md bg-zinc-800 px-4 py-3">
                      <Ionicons name="add" size={24} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity className="items-center justify-center rounded-md bg-zinc-800 px-4 py-3">
                      <Ionicons name="share-social" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>

                  {/* Description */}
                  <Text className="mb-6 text-base leading-6 text-gray-300">{data.description}</Text>

                  {/* Genres */}
                  {data.genre && data.genre.length > 0 && (
                    <View className="mb-6">
                      <Text className="mb-2 text-sm text-gray-400">Genres</Text>
                      <View className="flex-row flex-wrap gap-2">
                        {data.genre.map((genre: string, index: number) => (
                          <View key={index} className="rounded-full bg-zinc-800 px-3 py-1.5">
                            <Text className="text-sm text-white">{genre}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                  {/* Additional Info */}
                  <View className="mb-6 border-t border-zinc-800 pt-4">
                    <View className="mb-3 flex-row justify-between">
                      <Text className="text-sm text-gray-400">Posted</Text>
                      <Text className="text-sm text-white">
                        {new Date(data.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </Text>
                    </View>

                    {data.rating && (
                      <View className="flex-row justify-between">
                        <Text className="text-sm text-gray-400">Rating</Text>
                        <View className="flex-row items-center">
                          <Ionicons name="star" size={14} color="#fbbf24" />
                          <Text className="ml-1 text-sm text-white">{data.rating}</Text>
                        </View>
                      </View>
                    )}
                  </View>

                  {/* Comments Toggle Button - YouTube Style */}
                  {channel && chatClient ? (
                    <TouchableOpacity
                      onPress={toggleComments}
                      activeOpacity={0.7}
                      className="mb-4 flex-row items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-4"
                      style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                      }}>
                      <View className="flex-1 flex-row items-center">
                        <View className="mr-3 rounded-full bg-zinc-800 p-2">
                          <Ionicons name="chatbubble" size={20} color="#fff" />
                        </View>
                        <View className="flex-1">
                          <Text className="text-base font-semibold text-white">Comments</Text>
                          <Text className="text-sm text-gray-400">
                            {commentCount === 0
                              ? 'Be the first to comment'
                              : `${formatNumber(commentCount)} ${commentCount === 1 ? 'comment' : 'comments'}`}
                          </Text>
                        </View>
                      </View>
                      <Animated.View
                        style={{
                          transform: [{ rotate: rotateInterpolate }],
                        }}>
                        <Ionicons name="chevron-down" size={24} color="#9ca3af" />
                      </Animated.View>
                    </TouchableOpacity>
                  ) : (
                    <View className="mb-4 flex-row items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/30 px-4 py-4">
                      <View className="flex-1 flex-row items-center">
                        <View className="mr-3 rounded-full bg-zinc-800 p-2">
                          <Ionicons name="chatbubble-outline" size={20} color="#71717a" />
                        </View>
                        <View>
                          <Text className="text-base font-semibold text-zinc-500">Comments</Text>
                          <Text className="text-sm text-gray-600">Loading...</Text>
                        </View>
                      </View>
                      <ActivityIndicator size="small" color="#71717a" />
                    </View>
                  )}
                </View>
              </View>
            ) : (
              <View className="flex-1 items-center justify-center py-20">
                <Ionicons name="film-outline" size={48} color="#404040" />
                <Text className="mt-4 text-gray-400">No data loaded</Text>
              </View>
            )}
          </ScrollView>

          {/* Expandable Comments Section */}
          {channel && chatClient && commentsExpanded && (
            <Animated.View
              style={{
                height: heightInterpolate,
                overflow: 'hidden',
              }}
              className="border-t border-zinc-800 bg-black">
              <View className="flex-1">
                {/* Comments Header */}
                <View className="flex-row items-center justify-between border-b border-zinc-800 px-4 py-3">
                  <View className="flex-row items-center">
                    <Ionicons name="chatbubbles" size={20} color="#fff" />
                    <Text className="ml-2 text-lg font-bold text-white">
                      {commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={toggleComments}
                    className="rounded-full bg-zinc-800 p-2"
                    activeOpacity={0.7}>
                    <Ionicons name="close" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>

                {/* Chat Container */}
                <View className="flex-1 bg-zinc-950">
                  <OverlayProvider
                    value={{
                      style: {
                        messageList: {
                          container: {
                            backgroundColor: 'transparent',
                            paddingHorizontal: 0,
                            flex: 1,
                          },
                          contentContainer: {
                            paddingHorizontal: 12,
                            flexGrow: 1,
                          },
                          listContainer: {
                            backgroundColor: 'transparent',
                          },
                        },
                        messageSimple: {
                          container: {
                            backgroundColor: 'transparent',
                            marginVertical: 8,
                          },
                          content: {
                            containerInner: {
                              backgroundColor: '#18181b',
                              borderRadius: 12,
                              borderWidth: 1,
                              borderColor: '#27272a',
                              paddingHorizontal: 12,
                              paddingVertical: 10,
                            },
                            textContainer: {
                              backgroundColor: 'transparent',
                              marginLeft: 0,
                              marginRight: 0,
                            },
                            metaContainer: {
                              marginTop: 4,
                            },
                            metaText: {
                              color: 'white',
                              fontSize: 12,
                            },
                          },
                          avatarWrapper: {
                            container: {
                              marginRight: 12,
                            },
                          },
                        },
                        reply: {
                          container: {
                            backgroundColor: '#09090b',
                            borderLeftWidth: 2,
                            borderLeftColor: '#3f3f46',
                            marginLeft: 44,
                            marginTop: 6,
                            paddingLeft: 12,
                            borderRadius: 8,
                          },
                          messageContainer: {
                            backgroundColor: 'transparent',
                          },
                        },
                      },
                    }}>
                    <Chat client={chatClient}>
                      <Channel channel={channel} keyboardVerticalOffset={0}>
                        <View style={{ flex: 1 }}>
                          {/* Message List */}
                          <View style={{ flex: 1, minHeight: 0 }}>
                            <MessageList
                              onThreadSelect={() => {}}
                              inverted={true}
                              FooterComponent={() => (
                                <View className="pb-2 pt-4">
                                  <Text className="px-4 text-center text-xs text-zinc-600">
                                    {commentCount === 0
                                      ? 'No comments yet. Start the conversation!'
                                      : 'Start of comments'}
                                  </Text>
                                </View>
                              )}
                              EmptyStateIndicator={() => (
                                <View className="h-full w-full items-center justify-center bg-black">
                                  <Text className="text-white">No Comments Available</Text>
                                </View>
                              )}
                            />
                          </View>

                          {/* Message Input */}
                          {/* Message Input */}
                          <View className="border-t border-zinc-800 bg-zinc-950 px-4 py-4">
                            <MessageInput
                              additionalTextInputProps={{
                                placeholder: 'Add a comment...',
                                placeholderTextColor: '#52525b',
                                multiline: true,
                                style: {
                                  backgroundColor: '#09090b',
                                  borderRadius: 24,
                                  paddingHorizontal: 18,
                                  paddingVertical: 12,
                                  paddingTop: 12,
                                  color: '#fafafa',
                                  fontSize: 15,
                                  lineHeight: 20,
                                  borderWidth: 1.5,
                                  borderColor: '#27272a',
                                  maxHeight: 120,
                                  minHeight: 44,
                                  fontWeight: '400',
                                },
                              }}
                              SendButton={() => (
                                <TouchableOpacity
                                  className="ml-2 items-center justify-center rounded-full bg-blue-600 px-6 py-3"
                                  style={{
                                    shadowColor: '#2563eb',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.3,
                                    shadowRadius: 4,
                                    elevation: 4,
                                  }}>
                                  <Ionicons name="send" size={18} color="#fff" />
                                </TouchableOpacity>
                              )}
                            />
                          </View>
                        </View>
                      </Channel>
                    </Chat>
                  </OverlayProvider>
                </View>

                {/* Comment Guidelines */}
                <View className="border-t border-zinc-800 bg-zinc-950 px-4 py-2">
                  <Text className="text-xs text-zinc-500">
                    💡 Keep comments respectful and follow community guidelines
                  </Text>
                </View>
              </View>
            </Animated.View>
          )}
        </View>
      </Modal>
    </BottomSheetContext.Provider>
  );
};

export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error('useBottomSheet must be used within BottomSheetProvider');
  }
  return context;
};
