import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

type Props = {
  onClick?: () => void;
  onPress?: () => void;
  className?: string;
  children: React.ReactNode;
};

export function Button({ onClick, onPress, children }: Props) {
  return (
    <Pressable onPress={onClick || onPress} style={styles.button}>
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  text: {
    color: '#fff',
    fontWeight: '600',
  },
});
