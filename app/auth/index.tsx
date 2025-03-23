import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { router } from 'expo-router';

export default function AuthScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>🌳</Text>
        <Text style={styles.title}>Dijital Bahçem</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => router.push('/auth/login')}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Giriş Yap
        </Button>

        <Button
          mode="outlined"
          onPress={() => router.push('/auth/register')}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Kayıt Ol
        </Button>
      </View>

      <Text style={styles.footer}>
        Doğayla bağınızı güçlendirin, geleceğe yatırım yapın.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  button: {
    marginVertical: 10,
    borderRadius: 25,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  footer: {
    color: '#558B2F',
    textAlign: 'center',
    marginBottom: 20,
  },
}); 