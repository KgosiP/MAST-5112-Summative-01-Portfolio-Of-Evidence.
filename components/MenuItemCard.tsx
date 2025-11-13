import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, withTiming, useSharedValue } from 'react-native-reanimated';
import { Edit2, Trash2, PlusCircle, MinusCircle } from 'lucide-react-native';

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  course: 'appetizer' | 'main' | 'dessert' | string;
};

type Props = {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  index: number;
  onAddToOrder?: (item: MenuItem) => void;
  onRemoveFromOrder?: (item: MenuItem) => void;
  selectedCount?: number;
};

export function MenuItemCard({
  item,
  onEdit,
  onDelete,
  index,
  onAddToOrder,
  onRemoveFromOrder,
  selectedCount = 0,
}: Props) {
  // Animation values for entrance and interaction
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const pressScale = useSharedValue(1);

  React.useEffect(() => {
    // Staggered entrance animation using for loop concept
    const delay = index * 100;
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 10, stiffness: 100 });
      opacity.value = withTiming(1, { duration: 300 });
    }, delay);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * pressScale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    pressScale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    pressScale.value = withSpring(1);
  };

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        </View>
        <Text style={styles.description}>{item.description}</Text>
        <View style={styles.courseBadge}>
          <Text style={styles.courseText}>{item.course.toUpperCase()}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        {onAddToOrder && (
          <View style={styles.orderControls}>
            <Text style={styles.selectionLabel}>
              In order: {selectedCount}
            </Text>
            <View style={styles.orderButtons}>
              <Pressable
                onPress={() => onRemoveFromOrder?.(item)}
                disabled={!onRemoveFromOrder || selectedCount === 0}
                style={[
                  styles.iconButton,
                  selectedCount === 0 && styles.iconButtonDisabled,
                ]}
              >
                <MinusCircle size={22} color={selectedCount === 0 ? '#ccc' : '#2d5016'} />
              </Pressable>
              <Pressable
                onPress={() => onAddToOrder(item)}
                style={styles.iconButton}
              >
                <PlusCircle size={22} color="#2d5016" />
              </Pressable>
            </View>
          </View>
        )}
        <View style={styles.manageButtons}>
          <Pressable
            onPress={() => onEdit(item)}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={({ pressed }) => [
              styles.actionButton,
              styles.editButton,
              pressed && styles.pressed
            ]}
          >
            <Edit2 size={16} color="#fff" />
            <Text style={styles.actionText}>Edit</Text>
          </Pressable>
          <Pressable
            onPress={() => onDelete(item.id)}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={({ pressed }) => [
              styles.actionButton,
              styles.deleteButton,
              pressed && styles.pressed
            ]}
          >
            <Trash2 size={16} color="#fff" />
            <Text style={styles.actionText}>Delete</Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  content: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d5016',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  courseBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  courseText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666',
    letterSpacing: 0.5,
  },
  actions: {
    gap: 12,
  },
  orderControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2d5016',
  },
  orderButtons: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  iconButton: {
    padding: 4,
  },
  iconButtonDisabled: {
    opacity: 0.4,
  },
  manageButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  editButton: {
    backgroundColor: '#4a90e2',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  pressed: {
    opacity: 0.7,
  },
});
