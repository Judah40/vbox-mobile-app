import { useRef, useState } from 'react';
import { View, TextInput, StyleSheet, Keyboard } from 'react-native';

interface OTPInputProps {
  length?: number;
  onComplete?: (otp: string) => void;
  onChangeOTP?: (otp: string) => void;
}

const OTPInput: React.FC<OTPInputProps> = ({ length = 6, onComplete, onChangeOTP }) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleChangeText = (text: string, index: number) => {
    // Only allow numbers
    const sanitizedText = text.replace(/[^0-9]/g, '');

    if (sanitizedText.length === 0) {
      // Handle backspace
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      onChangeOTP?.(newOtp.join(''));

      // Move to previous input
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      return;
    }

    // Handle paste of multiple digits
    if (sanitizedText.length > 1) {
      const digits = sanitizedText.slice(0, length).split('');
      const newOtp = [...otp];

      digits.forEach((digit, i) => {
        if (index + i < length) {
          newOtp[index + i] = digit;
        }
      });

      setOtp(newOtp);
      onChangeOTP?.(newOtp.join(''));

      // Focus on next empty field or last field
      const nextIndex = Math.min(index + digits.length, length - 1);
      inputRefs.current[nextIndex]?.focus();

      // Check if OTP is complete
      if (newOtp.every((digit) => digit !== '')) {
        onComplete?.(newOtp.join(''));
        Keyboard.dismiss();
      }
      return;
    }

    // Handle single digit input
    const newOtp = [...otp];
    newOtp[index] = sanitizedText;
    setOtp(newOtp);
    onChangeOTP?.(newOtp.join(''));

    // Move to next input if current is filled
    if (sanitizedText && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if OTP is complete
    if (newOtp.every((digit) => digit !== '')) {
      onComplete?.(newOtp.join(''));
      Keyboard.dismiss();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {otp.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          style={[
            styles.input,
            focusedIndex === index && styles.inputFocused,
            digit !== '' && styles.inputFilled,
          ]}
          value={digit}
          onChangeText={(text) => handleChangeText(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          onFocus={() => setFocusedIndex(index)}
          onBlur={() => setFocusedIndex(null)}
          keyboardType="number-pad"
          maxLength={1}
          selectTextOnFocus
          textAlign="center"
          placeholderTextColor="#4B5563"
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    height: 56,
    borderWidth: 2,
    borderColor: '#374151',
    borderRadius: 12,
    backgroundColor: '#1F2937',
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  inputFocused: {
    borderColor: '#3B82F6',
    backgroundColor: '#1E3A5F',
  },
  inputFilled: {
    borderColor: '#10B981',
    backgroundColor: '#064E3B',
  },
});

export default OTPInput;
