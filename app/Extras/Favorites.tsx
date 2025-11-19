import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { handleAddingFavorites } from '../api/auth';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const { width } = Dimensions.get('window');

const data = [
  { name: 'Technology', icon: 'laptop' },
  { name: 'Sports', icon: 'futbol-o' },
  { name: 'Music', icon: 'music' },
  { name: 'Travel', icon: 'plane' },
  { name: 'Food', icon: 'cutlery' },
  { name: 'Fashion', icon: 'shopping-bag' },
  { name: 'Gaming', icon: 'gamepad' },
  { name: 'Photography', icon: 'camera' },
  { name: 'Art', icon: 'paint-brush' },
  { name: 'Fitness', icon: 'heartbeat' },
  { name: 'Books', icon: 'book' },
  { name: 'Movies', icon: 'film' },
];

const FavoritesSelector = () => {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [selectedName, setSelectedName] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const bottomHeight = useSafeAreaInsets().bottom;
  const toggleItem = (itemId: number, itemName: string) => {
    const newSelected = new Set(selected);
    const newSelectedName = new Set(selectedName);

    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
      newSelectedName.delete(itemName);
    } else {
      newSelected.add(itemId);
      newSelectedName.add(itemName);
    }

    setSelected(newSelected);
    setSelectedName(newSelectedName);
  };

  const handleNext = async () => {
    setIsLoading(true);
    const favorites: string[] = Array.from(selectedName);
    if (favorites.length > 0) {
      try {
        await handleAddingFavorites(favorites);
        // Alert.alert('Success', response.data.message);
        router.push('/Extras/ProfilePictureUpload');
      } catch (error: any) {
        Alert.alert('Error', error.response?.data?.message || 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    } else {
      Alert.alert('Selection Required', 'Please select at least one item.');
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    router.push('/Extras/ProfilePictureUpload');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <FontAwesome name="heart" size={28} color="#f43f5e" />
          </View>
          <Text style={styles.title}>Choose Your Interests</Text>
          <Text style={styles.subtitle}>Select topics you'd like to see more of</Text>
        </View>

        {/* Selection Counter */}
        {selected.size > 0 && (
          <View style={styles.counter}>
            <FontAwesome name="check-circle" size={16} color="#10b981" />
            <Text style={styles.counterText}>{selected.size} selected</Text>
          </View>
        )}

        {/* Grid */}
        <View style={styles.grid}>
          {data.map((item, idx) => {
            const isSelected = selected.has(idx);
            return (
              <TouchableOpacity
                key={idx}
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => toggleItem(idx, item.name)}
                activeOpacity={0.7}>
                <View style={styles.cardContent}>
                  <FontAwesome
                    name={item.icon}
                    size={24}
                    color={isSelected ? '#06b6d4' : '#64748b'}
                  />
                  <Text style={[styles.cardText, isSelected && styles.cardTextSelected]}>
                    {item.name}
                  </Text>
                </View>

                {isSelected && (
                  <View style={styles.checkmark}>
                    <FontAwesome name="check" size={12} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Bottom spacing for fixed footer */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Footer */}
      <View style={{ ...styles.footer, paddingBottom: bottomHeight + 20 }}>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip} disabled={isLoading}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.continueButton,
            (isLoading || selected.size === 0) && styles.continueButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={isLoading || selected.size === 0}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.continueText}>Continue</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 64,
    height: 64,
    backgroundColor: '#1e293b',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#94a3b8',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#1e293b',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
    gap: 6,
  },
  counterText: {
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  card: {
    width: (width - 52) / 2,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  cardSelected: {
    backgroundColor: '#164e63',
    borderColor: '#06b6d4',
  },
  cardContent: {
    alignItems: 'center',
    gap: 12,
  },
  cardText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#cbd5e1',
    textAlign: 'center',
  },
  cardTextSelected: {
    color: '#e0f2fe',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    backgroundColor: '#06b6d4',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#0f172a',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  skipButton: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipText: {
    color: '#cbd5e1',
    fontSize: 16,
    fontWeight: '600',
  },
  continueButton: {
    flex: 2,
    paddingVertical: 16,
    backgroundColor: '#06b6d4',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#334155',
    opacity: 0.6,
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FavoritesSelector;
