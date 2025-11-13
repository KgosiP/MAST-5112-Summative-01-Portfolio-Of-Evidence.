import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ArrowLeft, CheckCircle, ChevronDown } from 'lucide-react-native';
import { MenuHeader } from '../components/MenuHeader';
import type { MenuItem } from '../components/MenuItemCard';

type OrderItem = {
  item: MenuItem;
  quantity: number;
};

type Props = {
  orderItems: OrderItem[];
  total: number;
  onGoBack: () => void;
  onComplete: () => void;
};

const PAYMENT_METHODS = ['Cash on Pickup', 'Debit/Credit Card', 'Mobile Wallet'] as const;
type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export function PaymentScreen({ orderItems, total, onGoBack, onComplete }: Props) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  const handleConfirm = () => {
    if (!selectedMethod) {
      setConfirmationMessage('Please select a payment method to continue.');
      return;
    }
    setConfirmationMessage('Thank you! Your order is confirmed. Returning to the menu...');
    setTimeout(() => {
      setConfirmationMessage('');
      onComplete();
    }, 1800);
  };

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
            <Text style={styles.title}>Payment</Text>
          </View>

          <Animated.View entering={FadeInDown} style={styles.summaryCard}>
            <Text style={styles.sectionTitle}>Order Total</Text>
            <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
            <Text style={styles.pickupNotice}>Orders are pick-up only from our kitchen.</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(150)} style={styles.itemsCard}>
            <Text style={styles.sectionTitle}>Items</Text>
            {orderItems.map(({ item, quantity }) => (
              <View key={item.id} style={styles.itemRow}>
                <Text style={styles.itemName}>{item.name} × {quantity}</Text>
                <Text style={styles.itemPrice}>${(item.price * quantity).toFixed(2)}</Text>
              </View>
            ))}
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(250)} style={styles.paymentSection}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <Pressable
              onPress={() => setShowDropdown((prev) => !prev)}
              style={styles.dropdownToggle}
            >
              <Text style={styles.dropdownText}>
                {selectedMethod ?? 'Select a payment method'}
              </Text>
              <ChevronDown size={18} color="#1a1a1a" />
            </Pressable>
            {showDropdown && (
              <View style={styles.dropdownList}>
                {PAYMENT_METHODS.map((method) => (
                  <Pressable
                    key={method}
                    onPress={() => {
                      setSelectedMethod(method);
                      setShowDropdown(false);
                    }}
                    style={styles.dropdownItem}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        selectedMethod === method && styles.dropdownItemTextSelected,
                      ]}
                    >
                      {method}
                    </Text>
                    {selectedMethod === method && (
                      <CheckCircle size={18} color="#2d5016" />
                    )}
                  </Pressable>
                ))}
              </View>
            )}
          </Animated.View>

          {confirmationMessage.length > 0 && (
            <Animated.View entering={FadeInDown.delay(350)} style={styles.messageCard}>
              <Text style={styles.messageText}>{confirmationMessage}</Text>
            </Animated.View>
          )}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Pressable onPress={handleConfirm} style={styles.confirmButton}>
          <Text style={styles.confirmButtonText}>Confirm Order</Text>
        </Pressable>
      </View>
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
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2d5016',
  },
  pickupNotice: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  itemsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    gap: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 14,
    color: '#444',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  paymentSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  dropdownToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dropdownText: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  dropdownList: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#444',
  },
  dropdownItemTextSelected: {
    color: '#2d5016',
    fontWeight: '600',
  },
  messageCard: {
    backgroundColor: '#eef5ea',
    borderRadius: 12,
    padding: 16,
  },
  messageText: {
    fontSize: 14,
    color: '#2d5016',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  confirmButton: {
    backgroundColor: '#2d5016',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

