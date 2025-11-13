import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function MenuHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Kiss The Cheff</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
