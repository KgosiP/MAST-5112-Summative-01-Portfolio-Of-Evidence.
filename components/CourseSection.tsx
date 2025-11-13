import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MenuItemCard } from './MenuItemCard';
import type { MenuItem } from './MenuItemCard';

type Props = {
  title: string;
  items: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  onAddToOrder?: (item: MenuItem) => void;
  onRemoveFromOrder?: (item: MenuItem) => void;
  selectedCounts?: Record<string, number>;
};

export function CourseSection({
  title,
  items,
  onEdit,
  onDelete,
  onAddToOrder,
  onRemoveFromOrder,
  selectedCounts = {},
}: Props) {
  // Using if statement to conditionally render
  if (items.length === 0) {
    return null;
  }

  return (
    <Animated.View entering={FadeInDown.duration(400)} style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{items.length}</Text>
        </View>
      </View>
      
      <View style={styles.itemsContainer}>
        {/* Using map loop to render items */}
        {items.map((item, index) => (
          <MenuItemCard
            key={item.id}
            item={item}
            onEdit={onEdit}
            onDelete={onDelete}
            index={index}
            onAddToOrder={onAddToOrder}
            onRemoveFromOrder={onRemoveFromOrder}
            selectedCount={selectedCounts[item.id] ?? 0}
          />
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  countBadge: {
    backgroundColor: '#2d5016',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  itemsContainer: {
    gap: 0,
  },
});
