import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  StatusBar,
  StyleSheet,
  Dimensions,
  BackHandler,
} from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation';
import { router } from 'expo-router';
import { handleAddView } from '~/app/api/videos/api';

interface SimpleVideoPlayerProps {
  source: { uri: string };
  title?: string;
  onClose?: () => void;
  id: string;
}

const SimpleVideoPlayer: React.FC<SimpleVideoPlayerProps> = ({
  source,
  title = 'Video',
  id,
  onClose = () => {},
}) => {
  const videoRef = useRef<VideoView>(null);
  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);

  // Create video player
  const player = useVideoPlayer(source.uri, (player) => {
    player.loop = false;
    player.volume = 1;
    player.play(); // Auto play when ready
  });

  // Lock orientation to landscape when component mounts
  useEffect(() => {
    const lockOrientation = async () => {
      try {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      } catch (error) {
        console.error('Orientation lock error:', error);
      }
    };

    lockOrientation();

    // Unlock orientation when component unmounts
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  // Handle hardware back button
  useEffect(() => {
    const backAction = () => {
      onClose();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [onClose]);

  // Setup player event listeners
  useEffect(() => {
    const playingSubscription = player.addListener('playingChange', (event) => {
      setIsPlaying(event.isPlaying);
    });

    const statusSubscription = player.addListener('statusChange', (event) => {
      if (event.status === 'loading') {
        setIsBuffering(true);
      } else if (event.status === 'readyToPlay') {
        setIsBuffering(false);
        // Auto play when video is ready
        player.play();
      } else if (event.status === 'idle') {
        setIsBuffering(false);
      }
    });

    return () => {
      playingSubscription.remove();
      statusSubscription.remove();
    };
  }, [player]);

  // Auto-hide controls after 3 seconds
  useEffect(() => {
    if (showControls) {
      const timer = setTimeout(() => {
        setShowControls(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showControls]);

  //save viewed video
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;

    // poll the player's current time every second (supports player.currentTime or player.getPosition())
    const startPolling = () => {
      intervalId = setInterval(async () => {
        try {
          const anyPlayer = player as any;
          const maybeCurrent = anyPlayer?.currentTime;
          const current =
            typeof maybeCurrent === 'number'
              ? maybeCurrent
              : typeof anyPlayer?.getPosition === 'function'
                ? await anyPlayer.getPosition()
                : undefined;

          if (typeof current === 'number' && current >= 30) {
            await handleAddView({ postId: id });
            console.log('Video viewed for more than 5 seconds:', source.uri);
            if (intervalId) {
              clearInterval(intervalId);
              intervalId = null;
            }
            // Optionally: send server request once here
            // await handle.post('/post/mark-watched', { videoUri: source.uri });
          }
        } catch (error) {
          console.error('Error checking video time:', error);
        }
      }, 1000);
    };

    startPolling();

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [player, source.uri]);
  // Handle tap on video
  const handleVideoPress = () => {
    setShowControls(!showControls);
  };

  // Handle close with orientation unlock
  const handleClose = async () => {
    await ScreenOrientation.unlockAsync();
    onClose();
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* Video Component */}
      <Pressable onPress={handleVideoPress} style={styles.videoContainer}>
        <VideoView
          ref={videoRef}
          player={player}
          contentFit="contain"
          allowsFullscreen={false}
          style={styles.video}
        />

        {/* Loading indicator */}
        {isBuffering && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={styles.loadingText}>Loading video...</Text>
          </View>
        )}

        <View className="absolute left-8 top-10">
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  loadingText: {
    color: 'white',
    marginTop: 16,
    fontSize: 16,
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  playButton: {
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 50,
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50, // Extra padding for status bar area
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  backButton: {
    padding: 8,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  placeholder: {
    width: 40, // Same as back button for balance
  },
  centerArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerPlayButton: {
    padding: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 60,
  },
  bottomControls: {
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
  },
  controlButton: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 30,
  },
});

export default SimpleVideoPlayer;
