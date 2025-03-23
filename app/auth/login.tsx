import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      // Gerçek API entegrasyonunda bu kısım değişecek
      // Şimdilik local storage'dan okuyalım
      const userDataString = await AsyncStorage.getItem('user');
      
      if (!userDataString) {
        // Fake kullanıcı verileri (geliştirme aşamasında kullanmak için)
        const fakeUsers = [
          {
            id: '1',
            email: 'user@example.com',
            password: '123456',
            userType: 'user',
            name: 'Test Kullanıcı'
          },
          {
            id: '2',
            email: 'farmer@example.com',
            password: '123456',
            userType: 'farmer',
            name: 'Test Çiftçi'
          }
        ];

        // Fake kullanıcılar arasında ara
        const user = fakeUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
          // Kullanıcı tipine göre yönlendirme
          if (user.userType === 'farmer') {
            router.replace('/farmer/');
          } else {
            router.replace('/(tabs)/');
          }
          return;
        }
      }

      // Kayıtlı kullanıcı varsa kontrol et
      const userData = JSON.parse(userDataString);
      if (userData.email === email && userData.password === password) {
        if (userData.userType === 'farmer') {
          router.replace('/farmer/');
        } else {
          router.replace('/(tabs)/');
        }
      } else {
        setError('E-posta veya şifre hatalı');
      }
    } catch (error) {
      console.error('Giriş hatası:', error);
      setError('Giriş yapılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Dijital Bahçem</Text>
        <Text style={styles.subtitle}>Hoş geldiniz!</Text>

        <TextInput
          label="E-posta"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setError('');
          }}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <TextInput
          label="Şifre"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setError('');
          }}
          mode="outlined"
          secureTextEntry
          style={styles.input}
        />

        {error ? (
          <HelperText type="error" visible={!!error}>
            {error}
          </HelperText>
        ) : null}

        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
          loading={loading}
        >
          Giriş Yap
        </Button>

        <Button
          mode="text"
          onPress={() => router.push('/auth/forgot-password')}
          style={styles.textButton}
        >
          Şifremi Unuttum
        </Button>

        <View style={styles.registerContainer}>
          <Text>Hesabınız yok mu? </Text>
          <Button
            mode="text"
            onPress={() => router.push('/auth/register')}
            style={styles.textButton}
          >
            Kayıt Ol
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2E7D32',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 32,
    color: '#666',
  },
  input: {
    width: '100%',
    marginBottom: 16,
  },
  button: {
    width: '100%',
    marginTop: 8,
    backgroundColor: '#2E7D32',
  },
  textButton: {
    marginTop: 8,
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
}); 