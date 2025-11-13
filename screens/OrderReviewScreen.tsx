import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ArrowLeft, Plus, Minus, Trash2 } from 'lucide-react-native';
import { MenuHeader } from '../components/MenuHeader';
import type { MenuItem } from '../components/MenuItemCard';

type OrderItem = {
  item: MenuItem;
  quantity: number;
};

type Props = {
  orderItems: OrderItem[];
  total: number;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onRemove: (id: string) => void;
  onAddMore: () => void;
  onGoBack: () => void;
  onProceedToPayment: () => void;
};

export function OrderReviewScreen({
  orderItems,
  total,
  onIncrement,
  onDecrement,
  onRemove,
  onAddMore,
  onGoBack,
  onProceedToPayment,
}: Props) {
  const totalQuantity = orderItems.reduce((count, entry) => count + entry.quantity, 0);

  if (orderItems.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <MenuHeader />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Your order is empty</Text>
          <Text style={styles.emptySubtitle}>Add delicious dishes to continue.</Text>
          <Pressable onPress={onAddMore} style={styles.addMoreButton}>
            <Text style={styles.addMoreButtonText}>Browse Menu</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <MenuHeader />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Pressable onPress={onGoBack} style={styles.backButton}>
              <ArrowLeft size={20} color="#2d5016" />
              <Text style={styles.backButtonText}>Back</Text>
            </Pressable>
            <Text style={styles.title}>Review Order</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Selected Items</Text>
            {orderItems.map(({ item, quantity }, index) => (
              <React.Fragment key={item.id}>
                <Animated.View
                  entering={FadeInDown.delay(index * 100)}
                  style={styles.orderRow}
                >
                  <View style={styles.orderInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemDescription}>{item.description}</Text>
                    <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                  </View>
                  <View style={styles.quantityControls}>
                    <Pressable
                      onPress={() => onDecrement(item.id)}
                      style={styles.iconButton}
                    >
                      <Minus size={20} color="#2d5016" />
                    </Pressable>
                    <Text style={styles.quantityText}>{quantity}</Text>
                    <Pressable
                      onPress={() => onIncrement(item.id)}
                      style={styles.iconButton}
                    >
                      <Plus size={20} color="#2d5016" />
                    </Pressable>
                  </View>
                  <Pressable onPress={() => onRemove(item.id)} style={styles.removeButton}>
                    <Trash2 size={18} color="#e74c3c" />
                  </Pressable>
                </Animated.View>
              </React.Fragment>
            ))}
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Order Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Items</Text>
            <Text style={styles.summaryValue}>{totalQuantity}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total</Text>
              <Text style={styles.summaryTotal}>${total.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.footerActions}>
            <Pressable onPress={onAddMore} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Add More Items</Text>
            </Pressable>
            <Pressable onPress={onProceedToPayment} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Proceed to Payment</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
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
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d5016',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  orderRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingVertical: 12,
    gap: 12,
  },
  orderInfo: {
    gap: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  itemDescription: {
    fontSize: 12,
    color: '#666',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d5016',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  removeButton: {
    alignSelf: 'flex-start',
    padding: 4,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    gap: 12,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#555',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  summaryTotal: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2d5016',
  },
  footerActions: {
    gap: 12,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#2d5016',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#2d5016',
    fontWeight: '600',
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: '#2d5016',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
  },
  addMoreButton: {
    backgroundColor: '#2d5016',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  addMoreButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

