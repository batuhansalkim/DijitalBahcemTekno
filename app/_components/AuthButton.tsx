import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

interface AuthButtonProps {
  mode?: 'text' | 'outlined' | 'contained';
  onPress: () => void;
  style?: object;
  children: React.ReactNode;
  loading?: boolean;
}

const AuthButton = ({
  mode = 'contained',
  onPress,
  style,
  children,
  loading = false,
}: AuthButtonProps) => {
  return (
    <Button
      mode={mode}
      onPress={onPress}
      style={[styles.button, style]}
      loading={loading}
      contentStyle={styles.buttonContent}
    >
      {children}
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 2,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default AuthButton; 