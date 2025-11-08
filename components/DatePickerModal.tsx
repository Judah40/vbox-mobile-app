import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, View, Text } from 'react-native';

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (date: string) => void;
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({ visible, onClose, onSelect }) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const generateDateOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 18; i >= currentYear - 100; i--) {
      years.push(i);
    }
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    return { years, months, days };
  };

  const { years, months, days } = generateDateOptions();

  const handleConfirm = () => {
    if (selectedDay && selectedMonth && selectedYear) {
      const monthIndex = months.indexOf(selectedMonth) + 1;
      const formattedDate = `${String(monthIndex).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}-${selectedYear}`;
      onSelect(formattedDate);
      onClose();
    }
  };

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
          }}
          onPress={(e) => e.stopPropagation()}>
          <View className="border-b border-gray-700 p-4">
            <Text className="text-center text-xl font-bold text-white">Select Date of Birth</Text>
          </View>
          <View className="flex-row gap-2 p-4">
            <View className="flex-1">
              <Text className="mb-2 text-center text-xs text-gray-400">Month</Text>
              <ScrollView style={{ height: 150 }} showsVerticalScrollIndicator={false}>
                {months.map((month, index) => (
                  <Pressable
                    key={index}
                    onPress={() => setSelectedMonth(month)}
                    style={{
                      padding: 12,
                      backgroundColor: selectedMonth === month ? '#d4af37' : '#0f172a',
                      marginBottom: 4,
                      borderRadius: 8,
                    }}>
                    <Text
                      className="text-center"
                      style={{ color: selectedMonth === month ? '#000' : '#fff' }}>
                      {month.slice(0, 3)}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
            <View className="flex-1">
              <Text className="mb-2 text-center text-xs text-gray-400">Day</Text>
              <ScrollView style={{ height: 150 }} showsVerticalScrollIndicator={false}>
                {days.map((day) => (
                  <Pressable
                    key={day}
                    onPress={() => setSelectedDay(day)}
                    style={{
                      padding: 12,
                      backgroundColor: selectedDay === day ? '#d4af37' : '#0f172a',
                      marginBottom: 4,
                      borderRadius: 8,
                    }}>
                    <Text
                      className="text-center"
                      style={{ color: selectedDay === day ? '#000' : '#fff' }}>
                      {day}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
            <View className="flex-1">
              <Text className="mb-2 text-center text-xs text-gray-400">Year</Text>
              <ScrollView style={{ height: 150 }} showsVerticalScrollIndicator={false}>
                {years.map((year) => (
                  <Pressable
                    key={year}
                    onPress={() => setSelectedYear(year)}
                    style={{
                      padding: 12,
                      backgroundColor: selectedYear === year ? '#d4af37' : '#0f172a',
                      marginBottom: 4,
                      borderRadius: 8,
                    }}>
                    <Text
                      className="text-center"
                      style={{ color: selectedYear === year ? '#000' : '#fff' }}>
                      {year}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>
          <View className="gap-2 p-4">
            <Pressable
              onPress={handleConfirm}
              disabled={!selectedDay || !selectedMonth || !selectedYear}
              style={{
                backgroundColor:
                  selectedDay && selectedMonth && selectedYear ? '#d4af37' : '#374151',
                padding: 16,
                borderRadius: 12,
              }}>
              <Text className="text-center text-lg font-bold" style={{ color: '#fff' }}>
                Confirm
              </Text>
            </Pressable>
            <Pressable
              onPress={onClose}
              style={{
                backgroundColor: '#374151',
                padding: 16,
                borderRadius: 12,
              }}>
              <Text className="text-center text-gray-300">Cancel</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default DatePickerModal;
