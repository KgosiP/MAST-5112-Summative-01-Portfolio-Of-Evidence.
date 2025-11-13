import React, { useMemo, useState, Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MenuListScreen } from './screens/MenuListScreen';
import { StatisticsScreen } from './screens/StatisticsScreen';
import { OrderReviewScreen } from './screens/OrderReviewScreen';
import { PaymentScreen } from './screens/PaymentScreen';
import type { MenuItem } from './components/MenuItemCard';

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorText}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

type Screen = 'MenuList' | 'Review' | 'Payment' | 'Statistics';

type OrderEntry = {
  item: MenuItem;
  quantity: number;
};

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('MenuList');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: '1',
      name: 'Pan-Seared Scallops',
      description: 'Fresh Atlantic scallops with cauliflower purée and crispy pancetta',
      price: 28.0,
      course: 'appetizer',
    },
    {
      id: '2',
      name: 'Wagyu Beef Tenderloin',
      description: 'Grilled to perfection with roasted vegetables and red wine reduction',
      price: 65.0,
      course: 'main',
    },
    {
      id: '3',
      name: 'Dark Chocolate Soufflé',
      description: 'Warm chocolate soufflé with vanilla bean ice cream',
      price: 18.0,
      course: 'dessert',
    },
    {
      id: '4',
      name: 'Truffle Mushroom Risotto',
      description: 'Creamy arborio rice with wild mushrooms and shaved truffle',
      price: 32.0,
      course: 'main',
    },
    {
      id: '5',
      name: 'Heirloom Tomato Salad',
      description: 'Heritage tomatoes with burrata, basil oil, and balsamic pearls',
      price: 16.0,
      course: 'appetizer',
    },
    {
      id: '6',
      name: 'Lemon Lavender Tart',
      description: 'Zesty lemon curd with lavender meringue and candied peel',
      price: 14.0,
      course: 'dessert',
    },
  ]);
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>({});

  const orderItems = useMemo<OrderEntry[]>(() => {
    return Object.entries(selectedItems)
      .map(([id, quantity]) => {
        const item = menuItems.find((menuItem) => menuItem.id === id);
        if (!item) {
          return null;
        }
        return { item, quantity };
      })
      .filter((entry): entry is OrderEntry => entry !== null);
  }, [menuItems, selectedItems]);

  const orderTotal = useMemo(() => {
    return orderItems.reduce((sum, entry) => sum + entry.item.price * entry.quantity, 0);
  }, [orderItems]);

  const handleAddItem = (newItem: Omit<MenuItem, 'id'>) => {
    const item: MenuItem = {
      ...newItem,
      id: Date.now().toString()
    };
    setMenuItems((prev: MenuItem[]) => [...prev, item]);
  };

  const handleUpdateItem = (updatedItem: Omit<MenuItem, 'id'>, editingId?: string) => {
    // Using if statement to validate update
    if (editingId) {
      setMenuItems((prev: MenuItem[]) =>
        prev.map((item: MenuItem) =>
          item.id === editingId
            ? { ...updatedItem, id: editingId }
            : item
        )
      );
    }
  };

  const handleDeleteItem = (id: string) => {
    // Using filter loop to remove item
    setMenuItems((prev: MenuItem[]) =>
      prev.filter((item: MenuItem) => item.id !== id)
    );
    setSelectedItems((prev) => {
      if (!(id in prev)) {
        return prev;
      }
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleEditItem = (item: MenuItem) => {
    // This is handled in MenuListScreen component
  };

  const handleAddToOrder = (item: MenuItem) => {
    setSelectedItems((prev) => ({
      ...prev,
      [item.id]: (prev[item.id] ?? 0) + 1,
    }));
  };

  const handleRemoveFromOrder = (item: MenuItem) => {
    setSelectedItems((prev) => {
      const current = prev[item.id] ?? 0;
      if (current <= 1) {
        const { [item.id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [item.id]: current - 1 };
    });
  };

  const handleIncrementQuantity = (id: string) => {
    const item = menuItems.find((menuItem) => menuItem.id === id);
    if (!item) {
      return;
    }
    handleAddToOrder(item);
  };

  const handleDecrementQuantity = (id: string) => {
    const item = menuItems.find((menuItem) => menuItem.id === id);
    if (!item) {
      return;
    }
    handleRemoveFromOrder(item);
  };

  const handleRemoveOrderItem = (id: string) => {
    setSelectedItems((prev) => {
      if (!(id in prev)) {
        return prev;
      }
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const navigateToStats = () => {
    setCurrentScreen('Statistics');
  };

  const navigateToMenu = () => {
    setCurrentScreen('MenuList');
  };

  const navigateToReview = () => {
    setCurrentScreen('Review');
  };

  const navigateToPayment = () => {
    setCurrentScreen('Payment');
  };

  const handleCompleteOrder = () => {
    setSelectedItems({});
    setCurrentScreen('MenuList');
  };

  // Using if statements for screen navigation
  if (currentScreen === 'Statistics') {
    return (
      <StatisticsScreen
        menuItems={menuItems}
        onGoBack={navigateToMenu}
      />
    );
  }

  if (currentScreen === 'Review') {
    return (
      <OrderReviewScreen
        orderItems={orderItems}
        total={orderTotal}
        onIncrement={handleIncrementQuantity}
        onDecrement={handleDecrementQuantity}
        onRemove={handleRemoveOrderItem}
        onAddMore={navigateToMenu}
        onGoBack={navigateToMenu}
        onProceedToPayment={navigateToPayment}
      />
    );
  }

  if (currentScreen === 'Payment') {
    return (
      <PaymentScreen
        orderItems={orderItems}
        total={orderTotal}
        onGoBack={navigateToReview}
        onComplete={handleCompleteOrder}
      />
    );
  }

  return (
    <MenuListScreen
      menuItems={menuItems}
      onAddItem={handleAddItem}
      onUpdateItem={handleUpdateItem}
      onDeleteItem={handleDeleteItem}
      onEditItem={handleEditItem}
      onNavigateToStats={navigateToStats}
      onAddToOrder={handleAddToOrder}
      onRemoveFromOrder={handleRemoveFromOrder}
      onReviewOrder={navigateToReview}
      selectedItems={selectedItems}
    />
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
