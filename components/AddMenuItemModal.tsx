import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Modal, Pressable, ScrollView, Alert } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, useSharedValue, withTiming } from 'react-native-reanimated';
import { X, Save } from 'lucide-react-native';
import type { MenuItem } from './MenuItemCard';

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (item: Omit<MenuItem, 'id'>) => void;
  editItem: MenuItem | null;
};

export function AddMenuItemModal({ open, onClose, onSave, editItem }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [course, setCourse] = useState<'appetizer' | 'main' | 'dessert'>('appetizer');

  // Animation values
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (open) {
      // Reset form if editing
      if (editItem) {
        setName(editItem.name);
        setDescription(editItem.description);
        setPrice(editItem.price.toString());
        setCourse(editItem.course as 'appetizer' | 'main' | 'dessert');
      } else {
        // Reset form for new item
        setName('');
        setDescription('');
        setPrice('');
        setCourse('appetizer');
      }
      // Animate in
      scale.value = withSpring(1, { damping: 15, stiffness: 200 });
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      // Animate out
      scale.value = withTiming(0, { duration: 150 });
      opacity.value = withTiming(0, { duration: 150 });
    }
  }, [open, editItem]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value * 0.5,
  }));

  const handleSave = () => {
    // Validation using if statements
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a menu item name');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Error', 'Please enter a valid price greater than 0');
      return;
    }

    // Save the item
    onSave({
      name: name.trim(),
      description: description.trim(),
      price: priceNum,
      course: course,
    });

    onClose();
  };

  const courses: Array<'appetizer' | 'main' | 'dessert'> = ['appetizer', 'main', 'dessert'];
  const courseLabels: Record<string, string> = {
    appetizer: 'Appetizer',
    main: 'Main Course',
    dessert: 'Dessert',
  };

  if (!open) return null;

  return (
    <Modal
      visible={open}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={styles.backdropPress} onPress={onClose} />
        <Animated.View style={[styles.modal, animatedStyle]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Text style={styles.title}>
                {editItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </Text>
              <Pressable onPress={onClose} style={styles.closeButton}>
                <X size={24} color="#666" />
              </Pressable>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Item Name</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g., Pan-Seared Scallops"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Describe the dish..."
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Price ($)</Text>
                <TextInput
                  style={styles.input}
                  value={price}
                  onChangeText={setPrice}
                  placeholder="0.00"
                  placeholderTextColor="#999"
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Course Type</Text>
                <View style={styles.courseButtons}>
                  {/* Using forEach loop concept with map */}
                  {courses.map((courseOption) => (
                    <Pressable
                      key={courseOption}
                      onPress={() => setCourse(courseOption)}
                      style={[
                        styles.courseButton,
                        course === courseOption && styles.courseButtonActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.courseButtonText,
                          course === courseOption && styles.courseButtonTextActive,
                        ]}
                      >
                        {courseLabels[courseOption]}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View style={styles.actions}>
                <Pressable
                  onPress={onClose}
                  style={[styles.button, styles.cancelButton]}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={handleSave}
                  style={[styles.button, styles.saveButton]}
                >
                  <Save size={18} color="#fff" />
                  <Text style={styles.saveButtonText}>Save</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdropPress: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  closeButton: {
    padding: 4,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    color: '#1a1a1a',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  courseButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  courseButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  courseButtonActive: {
    borderColor: '#2d5016',
    backgroundColor: '#2d5016',
  },
  courseButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  courseButtonTextActive: {
    color: '#fff',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#2d5016',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
