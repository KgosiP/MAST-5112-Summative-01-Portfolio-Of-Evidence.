import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ArrowLeft, TrendingUp, DollarSign, Package } from 'lucide-react-native';
import { MenuHeader } from '../components/MenuHeader';
import type { MenuItem } from '../components/MenuItemCard';

type Props = {
  menuItems: MenuItem[];
  onGoBack: () => void;
};

export function StatisticsScreen({ menuItems, onGoBack }: Props) {
  // Using reduce loop to calculate total value
  const totalValue = menuItems.reduce((sum, item) => {
    return sum + item.price;
  }, 0);

  // Using for loop to count items by course
  const courseCounts: Record<string, number> = {};
  for (let i = 0; i < menuItems.length; i++) {
    const course = menuItems[i].course;
    if (courseCounts[course]) {
      courseCounts[course]++;
    } else {
      courseCounts[course] = 1;
    }
  }

  // Using while loop concept to find average price
  let sum = 0;
  let index = 0;
  while (index < menuItems.length) {
    sum += menuItems[index].price;
    index++;
  }
  const averagePrice = menuItems.length > 0 ? sum / menuItems.length : 0;

  // Using forEach loop to find highest and lowest priced items
  let highestPrice = 0;
  let lowestPrice = Infinity;
  let highestItem: MenuItem | null = null;
  let lowestItem: MenuItem | null = null;

  menuItems.forEach((item) => {
    if (item.price > highestPrice) {
      highestPrice = item.price;
      highestItem = item;
    }
    if (item.price < lowestPrice) {
      lowestPrice = item.price;
      lowestItem = item;
    }
  });

  const resolvedHighestItem = highestItem as MenuItem | null;
  const resolvedLowestItem = lowestItem as MenuItem | null;

  // Using if statement to handle empty state
  if (menuItems.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <MenuHeader />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No statistics available</Text>
          <Text style={styles.emptySubtext}>Add menu items to see statistics</Text>
          <Pressable onPress={onGoBack} style={styles.backButton}>
            <ArrowLeft size={18} color="#2d5016" />
            <Text style={styles.backButtonText}>Go Back</Text>
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
            <Text style={styles.title}>Menu Statistics</Text>
          </View>

          {/* Summary Cards */}
          <View style={styles.summaryGrid}>
            <Animated.View entering={FadeInDown.delay(100)} style={styles.statCard}>
              <Package size={24} color="#4a90e2" />
              <Text style={styles.statValue}>{menuItems.length}</Text>
              <Text style={styles.statLabel}>Total Items</Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(200)} style={styles.statCard}>
              <DollarSign size={24} color="#2d5016" />
              <Text style={styles.statValue}>${totalValue.toFixed(2)}</Text>
              <Text style={styles.statLabel}>Total Value</Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(300)} style={styles.statCard}>
              <TrendingUp size={24} color="#e74c3c" />
              <Text style={styles.statValue}>${averagePrice.toFixed(2)}</Text>
              <Text style={styles.statLabel}>Avg Price</Text>
            </Animated.View>
          </View>

          {/* Course Breakdown */}
          <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
            <Text style={styles.sectionTitle}>Items by Course</Text>
            <View style={styles.courseList}>
              {Object.entries(courseCounts).map(([course, count], index) => (
                <Animated.View
                  key={course}
                  entering={FadeInDown.delay(500 + index * 100)}
                  style={styles.courseItem}
                >
                  <Text style={styles.courseName}>{course.toUpperCase()}</Text>
                  <View style={styles.courseBar}>
                    <View
                      style={[
                        styles.courseBarFill,
                        { width: `${(count / menuItems.length) * 100}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.courseCount}>{count} items</Text>
                </Animated.View>
              ))}
            </View>
          </Animated.View>

          {/* Price Range */}
          <Animated.View entering={FadeInDown.delay(600)} style={styles.section}>
            <Text style={styles.sectionTitle}>Price Range</Text>
            {resolvedHighestItem && (
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>Highest</Text>
                <Text style={styles.priceName}>{resolvedHighestItem.name}</Text>
                <Text style={styles.priceValue}>${highestPrice.toFixed(2)}</Text>
              </View>
            )}
            {resolvedLowestItem && (
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>Lowest</Text>
                <Text style={styles.priceName}>{resolvedLowestItem.name}</Text>
                <Text style={styles.priceValue}>${lowestPrice.toFixed(2)}</Text>
              </View>
            )}
          </Animated.View>
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
    marginBottom: 24,
    gap: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    gap: 4,
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
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  courseList: {
    gap: 12,
  },
  courseItem: {
    marginBottom: 12,
  },
  courseName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 6,
  },
  courseBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  courseBarFill: {
    height: '100%',
    backgroundColor: '#2d5016',
    borderRadius: 4,
  },
  courseCount: {
    fontSize: 12,
    color: '#999',
  },
  priceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
    width: 80,
  },
  priceName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d5016',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginBottom: 24,
  },
});

