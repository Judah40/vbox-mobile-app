import { createContext, useEffect, useState, useContext } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { View, Text, Animated } from 'react-native';

const NetworkContext = createContext<{ isConnected: boolean }>({ isConnected: true });

let globalNetworkStatus = { isConnected: true };
export const getNetworkStatus = () => globalNetworkStatus;
export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [bgColor, setBgColor] = useState('red');
  const opacity = new Animated.Value(0);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected !== null) {
        if (!state.isConnected) {
          setMessage('No Internet Connection');
          setBgColor('#d9534f');
          setVisible(true);
          animateIn();
        } else {
          setMessage('Internet Restored');
          setBgColor('#5cb85c');
          setVisible(true);
          animateIn();
          setTimeout(() => animateOut(), 2000);
        }
        const connected = !!state.isConnected;
        globalNetworkStatus.isConnected = connected;
        setIsConnected(connected);
        setIsConnected(state.isConnected);
      }
    });
    return () => unsubscribe();
  }, []);

  const animateIn = () => {
    Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  };

  const animateOut = () => {
    Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }).start(() =>
      setVisible(false)
    );
  };

  return (
    <NetworkContext.Provider value={{ isConnected }}>
      {children}
      {visible && (
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: bgColor,
            padding: 10,
            zIndex: 9999,
            opacity,
          }}>
          <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>{message}</Text>
        </Animated.View>
      )}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => useContext(NetworkContext);
