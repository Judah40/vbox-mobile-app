import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Pressable, StatusBar, Dimensions, BackHandler, Platform, StyleSheet } from 'react-native';
import { Video } from 'expo-av';
import Slider from '@react-native-community/slider';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Brightness from 'expo-brightness';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define types
interface Subtitle {
  language: string;
  uri: string;
  text?: string;
}

interface MasterVideoPlayerProps {
  source: { uri: string };
  title?: string;
  autoPlay?: boolean;
  onClose?: () => void;
  style?: React.CSSProperties;
  thumbnailUrl?: string | null;
  subtitles?: Subtitle[];
  onComplete?: () => void;
  enablePictureInPicture?: boolean;
  enableAirplay?: boolean;
  enableChromecast?: boolean;
  allowDownload?: boolean;
  startAt?: number;
}

interface VideoStatus {
  isLoaded: boolean;
  isPlaying: boolean;
  isBuffering: boolean;
  positionMillis: number;
  durationMillis: number;
  shouldPlay: boolean;
  didJustFinish: boolean;
}

interface WatchHistoryItem {
  position: number;
  duration: number;
  timestamp: number;
  title: string;
}

interface WatchHistory {
  [key: string]: WatchHistoryItem;
}

const MasterVideoPlayer: React.FC<MasterVideoPlayerProps> = ({
  source,
  title = "Video Title",
  autoPlay = false,
  onClose = () => {},
  style = {},
  thumbnailUrl = null,
  subtitles = [],
  onComplete = () => {},
  enablePictureInPicture = true,
  enableAirplay = true,
  enableChromecast = true,
  allowDownload = false,
  startAt = 0,
}) => {
  // Refs
  const videoRef = useRef<Video>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const brightnessValueRef = useRef<number>(0.5);
  const volumeValueRef = useRef<number>(1);
  const seekingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // State
  const [status, setStatus] = useState<VideoStatus>({
    isLoaded: false,
    isPlaying: false,
    isBuffering: false,
    positionMillis: 0,
    durationMillis: 0,
    shouldPlay: false,
    didJustFinish: false,
  });
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [selectedSubtitle, setSelectedSubtitle] = useState<Subtitle | null>(null);
  const [isSeeking, setIsSeeking] = useState<boolean>(false);
  const [seekValue, setSeekValue] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [showSpeedOptions, setShowSpeedOptions] = useState<boolean>(false);
  const [showSubtitleMenu, setShowSubtitleMenu] = useState<boolean>(false);
  const [videoQuality, setVideoQuality] = useState<string>('auto');
  const [showQualityOptions, setShowQualityOptions] = useState<boolean>(false);
  const [brightness, setBrightness] = useState<number>(0.5);
  const [showBrightnessControl, setShowBrightnessControl] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [showVolumeControl, setShowVolumeControl] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [watchHistory, setWatchHistory] = useState<WatchHistory>({});
  const [doubleTapSide, setDoubleTapSide] = useState<'left' | 'right' | null>(null);
  const [lastTapTime, setLastTapTime] = useState<number>(0);

  const window = Dimensions.get('window');
  const screenWidth = window.width;
  const screenHeight = window.height;

  // Speed options
  const speedOptions = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];

  // Quality options
  const qualityOptions = ['auto', '1080p', '720p', '480p', '360p', '240p'];

  // Lock orientation to landscape when the component mounts
  useEffect(() => {
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    };

    lockOrientation();

    // Unlock orientation when the component unmounts
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  // Handle hardware back button
  useEffect(() => {
    const backAction = () => {
      onClose();
      return true; // Prevent default behavior
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [onClose]);

  // Load saved watch history on component mount
  useEffect(() => {
    const loadWatchHistory = async () => {
      try {
        const savedHistory = await AsyncStorage.getItem('videoWatchHistory');
        if (savedHistory) {
          setWatchHistory(JSON.parse(savedHistory));
          
          if (source.uri && JSON.parse(savedHistory)[source.uri]) {
            const savedTime = JSON.parse(savedHistory)[source.uri].position;
            if (savedTime && savedTime > 0 && videoRef.current) {
              videoRef.current.setPositionAsync(savedTime);
            }
          }
        }
      } catch (error) {
        console.error('Error loading watch history:', error);
      }
    };
    
    loadWatchHistory();
  }, [source]);

  // Save watch history periodically
  useEffect(() => {
    const saveInterval = setInterval(async () => {
      if (source.uri && currentTime > 0 && duration > 0) {
        try {
          const newHistory = {
            ...watchHistory,
            [source.uri]: {
              position: currentTime,
              duration: duration,
              timestamp: new Date().getTime(),
              title: title,
            }
          };
          
          await AsyncStorage.setItem('videoWatchHistory', JSON.stringify(newHistory));
          setWatchHistory(newHistory);
        } catch (error) {
          console.error('Error saving watch history:', error);
        }
      }
    }, 5000); // Save every 5 seconds
    
    return () => clearInterval(saveInterval);
  }, [currentTime, duration, source, title, watchHistory]);

  // Handle initial brightness
  useEffect(() => {
    const getBrightness = async () => {
      const { status } = await Brightness.requestPermissionsAsync();
      if (status === 'granted') {
        const brightness = await Brightness.getBrightnessAsync();
        setBrightness(brightness);
        brightnessValueRef.current = brightness;
      }
    };
    
    getBrightness();
  }, []);

  // Set initial position if specified
  useEffect(() => {
    if (isReady && startAt > 0 && videoRef.current) {
      videoRef.current.setPositionAsync(startAt);
    }
  }, [isReady, startAt]);

  // Auto hide controls
  useEffect(() => {
    if (showControls && !isSeeking && !showSettings && !showSpeedOptions && !showQualityOptions && !isLocked) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControls, isSeeking, showSettings, showSpeedOptions, showQualityOptions, isLocked]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      if (seekingIntervalRef.current) {
        clearInterval(seekingIntervalRef.current);
      }
    };
  }, []);

  // Video status update handler
  const onPlaybackStatusUpdate = (status: VideoStatus): void => {
    setStatus(status);
    
    if (status.isLoaded) {
      setIsBuffering(status.isBuffering);
      
      if (!isReady && status.isLoaded) {
        setIsReady(true);
        setDuration(status.durationMillis || 0);
      }
      
      if (!isSeeking && status.positionMillis) {
        setCurrentTime(status.positionMillis);
        setSeekValue(status.positionMillis);
      }
      
      if (status.didJustFinish) {
        onComplete();
      }
    }
  };

  // Format time in MM:SS or HH:MM:SS
  const formatTime = (millis: number): string => {
    if (!millis) return "00:00";
    
    const totalSeconds = Math.floor(millis / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Toggle play/pause
  const togglePlayPause = async (): Promise<void> => {
    if (!videoRef.current) return;
    
    if (status.isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = async (): Promise<void> => {
    if (isFullscreen) {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    } else {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    }
    
    setIsFullscreen(!isFullscreen);
  };

  // Seek video (when slider is being dragged)
  const onSeekStart = (): void => {
    setIsSeeking(true);
    if (status.isPlaying && videoRef.current) {
      videoRef.current.pauseAsync();
    }
  };

  // Update seek value (while dragging)
  const onSeekUpdate = (value: number): void => {
    setSeekValue(value);
  };

  // Complete seeking (when slider is released)
  const onSeekComplete = async (value: number): Promise<void> => {
    if (!videoRef.current) return;
    
    await videoRef.current.setPositionAsync(value);
    setCurrentTime(value);
    
    if (status.shouldPlay) {
      await videoRef.current.playAsync();
    }
    
    setIsSeeking(false);
  };

  // Skip forward 10 seconds
  const skipForward = async (): Promise<void> => {
    if (!videoRef.current) return;
    
    const newPosition = Math.min(currentTime + 10000, duration);
    await videoRef.current.setPositionAsync(newPosition);
    setCurrentTime(newPosition);
    setSeekValue(newPosition);
  };

  // Skip backward 10 seconds
  const skipBackward = async (): Promise<void> => {
    if (!videoRef.current) return;
    
    const newPosition = Math.max(currentTime - 10000, 0);
    await videoRef.current.setPositionAsync(newPosition);
    setCurrentTime(newPosition);
    setSeekValue(newPosition);
  };

  // Change playback speed
  const changeSpeed = async (speed: number): Promise<void> => {
    if (!videoRef.current) return;
    
    await videoRef.current.setRateAsync(speed, true);
    setPlaybackSpeed(speed);
    setShowSpeedOptions(false);
  };

  // Change subtitle
  const changeSubtitle = (subtitle: Subtitle | null): void => {
    setSelectedSubtitle(subtitle);
    setShowSubtitleMenu(false);
  };

  // Change video quality
  const changeQuality = (quality: string): void => {
    setVideoQuality(quality);
    setShowQualityOptions(false);
  };

  // Change brightness
  const changeBrightness = async (value: number): Promise<void> => {
    try {
      const { status } = await Brightness.requestPermissionsAsync();
      if (status === 'granted') {
        await Brightness.setBrightnessAsync(value);
        setBrightness(value);
        brightnessValueRef.current = value;
      }
    } catch (error) {
      console.error('Error changing brightness:', error);
    }
  };

  // Change volume
  const changeVolume = async (value: number): Promise<void> => {
    if (!videoRef.current) return;
    
    await videoRef.current.setVolumeAsync(value);
    setVolume(value);
    volumeValueRef.current = value;
  };

  // Handle tap on video (show/hide controls)
  const handleVideoPress = (): void => {
    if (isLocked) return;
    
    setShowControls(!showControls);
  };

  // Handle double tap (for seeking)
  const handleDoubleTap = (side: 'left' | 'right'): void => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    if (now - lastTapTime < DOUBLE_TAP_DELAY) {
      if (side === 'left') {
        skipBackward();
      } else if (side === 'right') {
        skipForward();
      }
      
      setDoubleTapSide(side);
      setTimeout(() => setDoubleTapSide(null), 500);
    }
    
    setLastTapTime(now);
  };

  // Reset player to initial state
  const resetPlayer = async (): Promise<void> => {
    if (!videoRef.current) return;
    
    await videoRef.current.setPositionAsync(0);
    setCurrentTime(0);
    setSeekValue(0);
    
    if (!status.isPlaying) {
      await videoRef.current.playAsync();
    }
  };

  // Enable/disable picture-in-picture mode
  const togglePictureInPicture = async (): Promise<void> => {
    if (!videoRef.current || !enablePictureInPicture) return;
    
    try {
      if (Platform.OS === 'ios') {
        await videoRef.current.presentFullscreenPlayer();
      } else if (Platform.OS === 'android') {
        console.log('Picture-in-picture mode is not fully implemented in this example');
      }
    } catch (error) {
      console.error('Error toggling PiP mode:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      {/* Video Component */}
      <Pressable onPress={handleVideoPress} style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={source}
          rate={playbackSpeed}
          volume={volume}
          isMuted={false}
          resizeMode="contain"
          shouldPlay={autoPlay}
          onPlaybackStatusUpdate={onPlaybackStatusUpdate}
          style={styles.video}
          posterSource={thumbnailUrl ? { uri: thumbnailUrl } : undefined}
          usePoster={!!thumbnailUrl}
        />
        
        {/* Left side double tap area */}
        <TouchableOpacity 
          style={styles.doubleTapAreaLeft}
          onPress={() => handleDoubleTap('left')}
          activeOpacity={1}
        />
        
        {/* Right side double tap area */}
        <TouchableOpacity 
          style={styles.doubleTapAreaRight}
          onPress={() => handleDoubleTap('right')}
          activeOpacity={1}
        />
        
        {/* Double tap indicators */}
        {doubleTapSide === 'left' && (
          <View style={styles.doubleTapIndicatorLeft}>
            <Ionicons name="play-back" size={24} color="white" />
            <Text style={styles.doubleTapText}>-10s</Text>
          </View>
        )}
        
        {doubleTapSide === 'right' && (
          <View style={styles.doubleTapIndicatorRight}>
            <Ionicons name="play-forward" size={24} color="white" />
            <Text style={styles.doubleTapText}>+10s</Text>
          </View>
        )}
      </Pressable>
      
      {/* Loading indicator */}
      {isBuffering && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}
      
      {/* Lock button (always visible) */}
      {!isLocked && showControls && (
        <TouchableOpacity 
          style={styles.lockButton}
          onPress={() => setIsLocked(true)}
        >
          <Ionicons name="lock-open" size={20} color="white" />
        </TouchableOpacity>
      )}
      
      {isLocked && (
        <TouchableOpacity 
          style={styles.lockButtonCenter}
          onPress={() => setIsLocked(false)}
        >
          <Ionicons name="lock-closed" size={28} color="white" />
        </TouchableOpacity>
      )}
      
      {/* Controls overlay */}
      {showControls && !isLocked && (
        <View style={styles.controlsOverlay}>
          {/* Top controls bar */}
          <View style={styles.topControls}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            
            <View style={styles.topRightControls}>
              {enablePictureInPicture && (
                <TouchableOpacity 
                  style={styles.pipButton}
                  onPress={togglePictureInPicture}
                >
                  <MaterialIcons name="picture-in-picture-alt" size={24} color="white" />
                </TouchableOpacity>
              )}
              
              <TouchableOpacity onPress={() => setShowSettings(!showSettings)}>
                <Ionicons name="settings" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Center controls */}
          <View style={styles.centerControls}>
            <TouchableOpacity onPress={skipBackward}>
              <Ionicons name="play-back" size={36} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={togglePlayPause}>
              <Ionicons 
                name={status.isPlaying ? "pause" : "play"} 
                size={48} 
                color="white" 
              />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={skipForward}>
              <Ionicons name="play-forward" size={36} color="white" />
            </TouchableOpacity>
          </View>
          
          {/* Bottom controls bar */}
          <View style={styles.bottomControls}>
            {/* Progress bar */}
            <View style={styles.progressBarContainer}>
              <Text style={styles.timeText}>
                {formatTime(isSeeking ? seekValue : currentTime)}
              </Text>
              
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={duration}
                value={isSeeking ? seekValue : currentTime}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#4f4f4f"
                thumbTintColor="#FFFFFF"
                onSlidingStart={onSeekStart}
                onValueChange={onSeekUpdate}
                onSlidingComplete={onSeekComplete}
              />
              
              <Text style={styles.timeText}>
                {formatTime(duration)}
              </Text>
            </View>
            
            {/* Bottom buttons */}
            <View style={styles.bottomButtons}>
              <View style={styles.bottomLeftButtons}>
                <TouchableOpacity onPress={() => setShowVolumeControl(!showVolumeControl)} style={styles.volumeButton}>
                  <Ionicons 
                    name={volume === 0 ? "volume-mute" : volume < 0.5 ? "volume-low" : "volume-high"} 
                    size={24} 
                    color="white" 
                  />
                </TouchableOpacity>
                
                {subtitles.length > 0 && (
                  <TouchableOpacity onPress={() => setShowSubtitleMenu(!showSubtitleMenu)} style={styles.subtitleButton}>
                    <MaterialIcons name="subtitles" size={24} color={selectedSubtitle ? "white" : "gray"} />
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity onPress={() => setShowSpeedOptions(!showSpeedOptions)} style={styles.speedButton}>
                  <Text style={styles.speedText}>{playbackSpeed}x</Text>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={() => setShowQualityOptions(!showQualityOptions)} style={styles.qualityButton}>
                  <MaterialIcons name="hd" size={24} color="white" />
                </TouchableOpacity>
                
                <TouchableOpacity onPress={() => setShowBrightnessControl(!showBrightnessControl)} style={styles.brightnessButton}>
                  <Ionicons name="sunny" size={24} color="white" />
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity onPress={toggleFullscreen} style={styles.fullscreenButton}>
                <MaterialIcons 
                  name={isFullscreen ? "fullscreen-exit" : "fullscreen"} 
                  size={24} 
                  color="white" 
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      
      {/* Volume control */}
      {showVolumeControl && showControls && !isLocked && (
        <View style={styles.volumeControl}>
          <Ionicons 
            name={volume === 0 ? "volume-mute" : volume < 0.5 ? "volume-low" : "volume-high"} 
            size={24} 
            color="white" 
          />
          <Slider
            style={styles.verticalSlider}
            minimumValue={0}
            maximumValue={1}
            value={volume}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#4f4f4f"
            thumbTintColor="#FFFFFF"
            onValueChange={changeVolume}
            orientation="vertical"
          />
          <Text style={styles.volumeText}>{Math.round(volume * 100)}%</Text>
        </View>
      )}
      
      {/* Brightness control */}
      {showBrightnessControl && showControls && !isLocked && (
        <View style={styles.brightnessControl}>
          <Ionicons name="sunny" size={24} color="white" />
          <Slider
            style={styles.verticalSlider}
            minimumValue={0}
            maximumValue={1}
            value={brightness}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#4f4f4f"
            thumbTintColor="#FFFFFF"
            onValueChange={changeBrightness}
            orientation="vertical"
          />
          <Text style={styles.brightnessText}>{Math.round(brightness * 100)}%</Text>
        </View>
      )}
      
      {/* Speed options */}
      {showSpeedOptions && showControls && !isLocked && (
        <View style={styles.speedOptions}>
          <Text style={styles.speedOptionsTitle}>Playback Speed</Text>
          <View style={styles.speedOptionsContainer}>
            {speedOptions.map((speed) => (
              <TouchableOpacity 
                key={speed} 
                style={[styles.speedOptionButton, playbackSpeed === speed && styles.speedOptionButtonActive]}
                onPress={() => changeSpeed(speed)}
              >
                <Text 
                  style={[styles.speedOptionText, playbackSpeed === speed && styles.speedOptionTextActive]}
                >
                  {speed}x
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      
      {/* Quality options */}
      {showQualityOptions && showControls && !isLocked && (
        <View style={styles.qualityOptions}>
          <Text style={styles.qualityOptionsTitle}>Video Quality</Text>
          {qualityOptions.map((quality) => (
            <TouchableOpacity 
              key={quality} 
              style={[styles.qualityOptionButton, videoQuality === quality && styles.qualityOptionButtonActive]}
              onPress={() => changeQuality(quality)}
            >
              <Text 
                style={[styles.qualityOptionText, videoQuality === quality && styles.qualityOptionTextActive]}
              >
                {quality}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      {/* Subtitle menu */}
      {showSubtitleMenu && showControls && !isLocked && (
        <View style={styles.subtitleMenu}>
          <Text style={styles.subtitleMenuTitle}>Subtitles</Text>
          <TouchableOpacity 
            style={[styles.subtitleOptionButton, selectedSubtitle === null && styles.subtitleOptionButtonActive]}
            onPress={() => changeSubtitle(null)}
          >
            <Text 
              style={[styles.subtitleOptionText, selectedSubtitle === null && styles.subtitleOptionTextActive]}
            >
              Off
            </Text>
          </TouchableOpacity>
          {subtitles.map((subtitle) => (
            <TouchableOpacity 
              key={subtitle.language} 
              style={[styles.subtitleOptionButton, selectedSubtitle === subtitle && styles.subtitleOptionButtonActive]}
              onPress={() => changeSubtitle(subtitle)}
            >
              <Text 
                style={[styles.subtitleOptionText, selectedSubtitle === subtitle && styles.subtitleOptionTextActive]}
              >
                {subtitle.language}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      {/* Settings menu */}
      {showSettings && showControls && !isLocked && (
        <View style={styles.settingsMenu}>
          <Text style={styles.settingsMenuTitle}>Settings</Text>
          
          <TouchableOpacity 
            style={styles.settingsMenuItem}
            onPress={() => {
              setShowSettings(false);
              setShowSpeedOptions(true);
            }}
          >
            <MaterialIcons name="speed" size={20} color="white" style={styles.settingsMenuIcon} />
            <Text style={styles.settingsMenuText}>Playback Speed ({playbackSpeed}x)</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingsMenuItem}
            onPress={() => {
              setShowSettings(false);
              setShowQualityOptions(true);
            }}
          >
            <MaterialIcons name="hd" size={20} color="white" style={styles.settingsMenuIcon} />
            <Text style={styles.settingsMenuText}>Quality ({videoQuality})</Text>
          </TouchableOpacity>
          
          {subtitles.length > 0 && (
            <TouchableOpacity 
              style={styles.settingsMenuItem}
              onPress={() => {
                setShowSettings(false);
                setShowSubtitleMenu(true);
              }}
            >
              <MaterialIcons name="subtitles" size={20} color="white" style={styles.settingsMenuIcon} />
              <Text style={styles.settingsMenuText}>
                Subtitles ({selectedSubtitle ? selectedSubtitle.language : 'Off'})
              </Text>
            </TouchableOpacity>
          )}
          
          {allowDownload && (
            <TouchableOpacity style={styles.settingsMenuItem}>
              <MaterialIcons name="file-download" size={20} color="white" style={styles.settingsMenuIcon} />
              <Text style={styles.settingsMenuText}>Download</Text>
            </TouchableOpacity>
          )}
          
          {enableAirplay && Platform.OS === 'ios' && (
            <TouchableOpacity style={styles.settingsMenuItem}>
              <MaterialCommunityIcons name="apple-airplay" size={20} color="white" style={styles.settingsMenuIcon} />
              <Text style={styles.settingsMenuText}>AirPlay</Text>
            </TouchableOpacity>
          )}
          
          {enableChromecast && (
            <TouchableOpacity style={styles.settingsMenuItem}>
              <MaterialCommunityIcons name="cast" size={20} color="white" style={styles.settingsMenuIcon} />
              <Text style={styles.settingsMenuText}>Cast</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={styles.settingsMenuItem}
            onPress={resetPlayer}
          >
            <MaterialIcons name="replay" size={20} color="white" style={styles.settingsMenuIcon} />
            <Text style={styles.settingsMenuText}>Restart</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Selected subtitle display */}
      {selectedSubtitle && (
        <View style={styles.subtitleDisplay}>
          <View style={styles.subtitleDisplayBox}>
            <Text style={styles.subtitleDisplayText}>
              {selectedSubtitle.text || 'Subtitle example text'}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

// Styles
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
  doubleTapAreaLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '33%',
    height: '100%',
    zIndex: 10,
  },
  doubleTapAreaRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: '33%',
    height: '100%',
    zIndex: 10,
  },
  doubleTapIndicatorLeft: {
    position: 'absolute',
    left: 64,
    top: '50%',
    transform: [{ translateY: -12 }],
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 999,
    padding: 16,
  },
  doubleTapIndicatorRight: {
    position: 'absolute',
    right: 64,
    top: '50%',
    transform: [{ translateY: -12 }],
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 999,
    padding: 16,
  },
  doubleTapText: {
    color: 'white',
    textAlign: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 999,
    padding: 8,
    zIndex: 20,
  },
  lockButtonCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -14 }, { translateY: -14 }],
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 999,
    padding: 16,
    zIndex: 20,
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'space-between',
    zIndex: 20,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    maxWidth: '60%',
  },
  topRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pipButton: {
    marginRight: 16,
  },
  centerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 64,
  },
  bottomControls: {
    padding: 16,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeText: {
    color: 'white',
    fontSize: 12,
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 8,
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomLeftButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  volumeButton: {
    marginRight: 16,
  },
  subtitleButton: {
    marginRight: 16,
  },
  speedButton: {
    marginRight: 16,
  },
  speedText: {
    color: 'white',
    fontWeight: 'bold',
  },
  qualityButton: {
    marginRight: 16,
  },
  brightnessButton: {
    marginRight: 16,
  },
  fullscreenButton: {
    marginLeft: 16,
  },
  volumeControl: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    zIndex: 30,
  },
  verticalSlider: {
    height: 150,
    width: 40,
  },
  volumeText: {
    color: 'white',
    marginTop: 8,
  },
  brightnessControl: {
    position: 'absolute',
    bottom: 80,
    left: 80,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    zIndex: 30,
  },
  brightnessText: {
    color: 'white',
    marginTop: 8,
  },
  speedOptions: {
    position: 'absolute',
    bottom: 80,
    right: 80,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    padding: 16,
    zIndex: 30,
  },
  speedOptionsTitle: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  speedOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  speedOptionButton: {
    margin: 4,
    padding: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  speedOptionButtonActive: {
    backgroundColor: 'white',
  },
  speedOptionText: {
    color: 'white',
    fontWeight: 'bold',
  },
  speedOptionTextActive: {
    color: 'black',
  },
  qualityOptions: {
    position: 'absolute',
    bottom: 80,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    padding: 16,
    zIndex: 30,
  },
  qualityOptionsTitle: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  qualityOptionButton: {
    padding: 8,
  },
  qualityOptionButtonActive: {
    backgroundColor: 'white',
    borderRadius: 4,
  },
  qualityOptionText: {
    color: 'white',
    fontWeight: 'bold',
  },
  qualityOptionTextActive: {
    color: 'black',
  },
  subtitleMenu: {
    position: 'absolute',
    bottom: 80,
    left: 144,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    padding: 16,
    zIndex: 30,
  },
  subtitleMenuTitle: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitleOptionButton: {
    padding: 8,
  },
  subtitleOptionButtonActive: {
    backgroundColor: 'white',
    borderRadius: 4,
  },
  subtitleOptionText: {
    color: 'white',
    fontWeight: 'bold',
  },
  subtitleOptionTextActive: {
    color: 'black',
  },
  settingsMenu: {
    position: 'absolute',
    top: 64,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    padding: 16,
    zIndex: 30,
  },
  settingsMenuTitle: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  settingsMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  settingsMenuIcon: {
    marginRight: 8,
  },
  settingsMenuText: {
    color: 'white',
  },
  subtitleDisplay: {
    position: 'absolute',
    bottom: 64,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitleDisplayBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxWidth: '80%',
  },
  subtitleDisplayText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default MasterVideoPlayer;