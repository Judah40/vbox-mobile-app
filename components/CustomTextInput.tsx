import React, { useState } from 'react';
import { View, Text, TextStyle, ViewStyle } from 'react-native';
import { TextInput, TextInputProps } from 'react-native-paper';

interface CustomTextInputProps  {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: (e:any) => void;
  error?: string;
  secureTextEntry?: boolean;
  isPassword?: boolean;
  textColor?: string;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  label,
  value,
  onChangeText,
  onBlur,
  error,
  secureTextEntry = false,
  isPassword = false,
  textColor = '#D3D3D3',
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  return (
    <View style={styles.container}>
      <TextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        secureTextEntry={isPassword && !isPasswordVisible}
        style={styles.textInputColor}
        error={!!error}
        textColor={textColor}
        theme={{ colors: { primary: textColor, outline: textColor } }}
        placeholderTextColor={'white'}
        right={
          isPassword ? (
            <TextInput.Icon
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              icon={isPasswordVisible ? 'eye-off' : 'eye'}
            />
          ) : null
        }
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles: { textInputColor: TextStyle; errorText: TextStyle; container: ViewStyle } = {
  textInputColor: {
    backgroundColor: 'transparent',
    color: 'white',
    width: "100%", // Equivalent to 'w-80' in Tailwind CSS
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
  container: {
    paddingVertical: 16, // Equivalent to 'py-4' in Tailwind CSS
  },
};

export default CustomTextInput;