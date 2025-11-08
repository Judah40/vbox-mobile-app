import React from 'react';
import { Modal, Pressable, ScrollView, View, Text } from 'react-native';

interface PickerModalProps {
  visible: boolean;
  onClose: () => void;
  options: string[] | number[];
  onSelect: (value: string) => void;
  title: string;
}

const PickerModal: React.FC<PickerModalProps> = ({
  visible,
  onClose,
  options,
  onSelect,
  title,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          justifyContent: 'flex-end',
        }}
        onPress={onClose}>
        <Pressable
          style={{
            backgroundColor: '#1e293b',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            maxHeight: '60%',
          }}
          onPress={(e) => e.stopPropagation()}>
          <View className="border-b border-gray-700 p-4">
            <Text className="text-center text-xl font-bold text-white">{title}</Text>
          </View>
          <ScrollView style={{ maxHeight: 400 }}>
            {options.map((option, index) => (
              <Pressable
                key={index}
                onPress={() => {
                  onSelect(String(option));
                  onClose();
                }}
                style={({ pressed }) => ({
                  padding: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: '#374151',
                  backgroundColor: pressed ? '#374151' : 'transparent',
                })}>
                <Text className="text-center text-lg text-white">{option}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default PickerModal;
