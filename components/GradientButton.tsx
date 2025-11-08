import { ColorValue, Pressable, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  colors?: [string, string, ...string[]];
  disabled?: boolean;
  isLoading: boolean;
}

const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  onPress,
  colors = ['#d4af37', '#b8860b', '#8b6914'],
  disabled = false,
  isLoading,
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.98 : 1 }],
        opacity: disabled ? 0.6 : 1,
        marginTop: 10,
      })}>
      <LinearGradient
        colors={disabled ? ['#374151', '#374151'] : colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 12,
          padding: 18,
          shadowColor: '#b8860b',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: disabled ? 0 : 0.4,
          shadowRadius: 8,
          elevation: disabled ? 0 : 6,
        }}>
        <Text className="text-center text-lg font-bold text-white" style={{ letterSpacing: 1 }}>
          {isLoading ? 'Please wait' : title}
        </Text>
      </LinearGradient>
    </Pressable>
  );
};

export default GradientButton;
