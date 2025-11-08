import { View, Text, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

interface CustomTextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur: (e: any) => void;
  error?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'name-phone-pad' | 'email-address' | 'numeric' | 'phone-pad';
  isPassword?: boolean;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  label,
  value,
  onChangeText,
  onBlur,
  error,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  isPassword = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!isPassword);

  const showPasswordToggle = isPassword;
  const actualSecureTextEntry = isPassword && !isPasswordVisible;

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View>
      <Text className="mb-2 text-sm font-medium text-gray-300">{label}</Text>
      <View
        style={{
          borderWidth: 2,
          borderColor: error ? '#ef4444' : isFocused ? '#d4af37' : '#374151',
          borderRadius: 12,
          backgroundColor: '#1e293b',
          shadowColor: isFocused ? '#d4af37' : 'transparent',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: isFocused ? 3 : 0,
        }}>
        <View className="flex-row items-center">
          <TextInput
            value={value}
            onChangeText={onChangeText}
            // onBlur={(e) => {
            //   setIsFocused(false);
            //   onBlur(e);
            // }}
            onFocus={() => setIsFocused(true)}
            placeholder={placeholder}
            placeholderTextColor="#64748b"
            secureTextEntry={actualSecureTextEntry}
            style={{
              flex: 1,
              paddingHorizontal: 16,
              paddingVertical: 14,
              fontSize: 16,
              color: '#ffffff',
            }}
            keyboardType={keyboardType}
          />
          {showPasswordToggle && (
            <Pressable
              onPress={togglePasswordVisibility}
              className="pr-4"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name={isPasswordVisible ? 'eye-off' : 'eye'} size={20} color="#64748b" />
            </Pressable>
          )}
        </View>
      </View>
      {error && <Text className="ml-1 mt-1 text-xs text-red-500">{error}</Text>}
    </View>
  );
};

export default CustomTextInput;
