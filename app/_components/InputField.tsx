import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  error?: boolean;
  style?: object;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
}

const InputField = ({
  label,
  value,
  onChangeText,
  secureTextEntry = false,
  error = false,
  style,
  autoCapitalize = 'none',
  keyboardType = 'default',
}: InputFieldProps) => {
  return (
    <TextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      error={error}
      style={[styles.input, style]}
      mode="outlined"
      autoCapitalize={autoCapitalize}
      keyboardType={keyboardType}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    marginVertical: 8,
    backgroundColor: '#fff',
  },
});

export default InputField; 