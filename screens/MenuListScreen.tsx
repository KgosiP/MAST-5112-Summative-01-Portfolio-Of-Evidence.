import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Plus, BarChart3 } from 'lucide-react-native';
import { MenuHeader } from '../components/MenuHeader';
import { CourseSection } from '../components/CourseSection';
import { AddMenuItemModal } from '../components/AddMenuItemModal';
import type { MenuItem } from '../components/MenuItemCard';

type Props = {
  menuItems: MenuItem[];
  onAddItem: (item: Omit<MenuItem, 'id'>) => void;
  onUpdateItem: (item: Omit<MenuItem, 'id'>, editingId?: string) => void;
  onDeleteItem: (id: string) => void;
  onEditItem: (item: MenuItem) => void;
  onNavigateToStats: () => void;
  onAddToOrder: (item: MenuItem) => void;
  onRemoveFromOrder: (item: MenuItem) => void;
  onReviewOrder: () => void;
  selectedItems: Record<string, number>;
};

export function MenuListScreen({
  menuItems,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onEditItem,
  onNavigateToStats,
  onAddToOrder,
  onRemoveFromOrder,
  onReviewOrder,
  selectedItems,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSave = (item: Omit<MenuItem, 'id'>) => {
    if (editingItem) {
      onUpdateItem(item, editingItem.id);
    } else {
      onAddItem(item);
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  // Using filter loop with if statement for search functionality
  const filteredItems = menuItems.filter((item) => {
    if (!searchQuery.trim()) {
      return true;
    }
    const query = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.course.toLowerCase().includes(query)
    );
  });

  // Using reduce loop to calculate statistics
  const totalItems = filteredItems.length;
  const totalValue = filteredItems.reduce((sum, item) => {
    return sum + item.price;
  }, 0);

  const selectedCounts = selectedItems;
  const selectedItemCount = Object.values(selectedCounts).reduce(
    (count, quantity) => count + quantity,
    0
  );
  const selectedTotal = Object.entries(selectedCounts).reduce((sum, [id, quantity]) => {
    const item = menuItems.find((menuItem) => menuItem.id === id);
    return item ? sum + item.price * quantity : sum;
  }, 0);

  // Using for loop concept with forEach to categorize items
  const appetizers: MenuItem[] = [];
  const mains: MenuItem[] = [];
  const desserts: MenuItem[] = [];

  filteredItems.forEach((item) => {
    if (item.course === 'appetizer') {
      appetizers.push(item);
    } else if (item.course === 'main') {
      mains.push(item);
    } else if (item.course === 'dessert') {
      desserts.push(item);
    }
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <MenuHeader />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Menu Management</Text>
              <Text style={styles.subtitle}>
                {totalItems} items • Total: ${totalValue.toFixed(2)}
              </Text>
            </View>
            <View style={styles.headerButtons}>
              <Pressable
                onPress={onNavigateToStats}
                style={styles.statsButton}
              >
                <BarChart3 size={20} color="#2d5016" />
              </Pressable>
              <Pressable
                onPress={() => setIsModalOpen(true)}
                style={styles.addButton}
              >
                <Plus size={18} color="#fff" />
                <Text style={styles.addButtonText}>Add</Text>
              </Pressable>
            </View>
          </View>

          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search menu items..."
            placeholderTextColor="#999"
          />

          {selectedItemCount > 0 && (
            <View style={styles.orderSummary}>
              <View>
                <Text style={styles.orderSummaryTitle}>Current Order</Text>
                <Text style={styles.orderSummarySubtitle}>
                  {selectedItemCount} item{selectedItemCount > 1 ? 's' : ''} • ${selectedTotal.toFixed(2)}
                </Text>
              </View>
              <Pressable onPress={onReviewOrder} style={styles.reviewButton}>
                <Text style={styles.reviewButtonText}>Review Order</Text>
              </Pressable>
            </View>
          )}

          <CourseSection
            title="Appetizers"
            items={appetizers}
            onEdit={handleEditItem}
            onDelete={onDeleteItem}
            onAddToOrder={onAddToOrder}
            onRemoveFromOrder={onRemoveFromOrder}
            selectedCounts={selectedCounts}
          />

          <CourseSection
            title="Main Courses"
            items={mains}
            onEdit={handleEditItem}
            onDelete={onDeleteItem}
            onAddToOrder={onAddToOrder}
            onRemoveFromOrder={onRemoveFromOrder}
            selectedCounts={selectedCounts}
          />

          <CourseSection
            title="Desserts"
            items={desserts}
            onEdit={handleEditItem}
            onDelete={onDeleteItem}
            onAddToOrder={onAddToOrder}
            onRemoveFromOrder={onRemoveFromOrder}
            selectedCounts={selectedCounts}
          />

          {/* Using if statement to show empty state */}
          {filteredItems.length === 0 && (
            <Animated.View entering={FadeIn} style={styles.emptyState}>
              <Text style={styles.emptyText}>
                {searchQuery ? 'No items match your search' : 'No menu items yet'}
              </Text>
              <Text style={styles.emptySubtext}>
                {searchQuery ? 'Try a different search term' : 'Tap "Add" to create your first item'}
              </Text>
            </Animated.View>
          )}
        </View>
      </ScrollView>

      <AddMenuItemModal
        open={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        editItem={editingItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  orderSummary: {
    backgroundColor: '#2d5016',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderSummaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  orderSummarySubtitle: {
    fontSize: 14,
    color: '#f1f1f1',
  },
  reviewButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  reviewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d5016',
  },
  statsButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d5016',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

