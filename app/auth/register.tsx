import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, SegmentedButtons } from 'react-native-paper';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('user');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      // TODO: Şifre uyuşmazlığı hatası göster
      return;
    }

    setLoading(true);
    try {
      // Gerçek API entegrasyonunda bu kısım değişecek
      // Şimdilik local storage'da saklayalım
      const userData = {
        id: Date.now().toString(),
        name,
        email,
        userType,
        // Gerçek uygulamada şifre asla plain text saklanmaz
        password
      };

      // Kullanıcı bilgilerini saklama
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      
      // Kullanıcı tipine göre yönlendirme
      if (userType === 'farmer') {
        router.replace('/farmer/');
      } else {
        router.replace('/tabs/');
      }
    } catch (error) {
      console.error('Kayıt hatası:', error);
      // TODO: Hata mesajı göster
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Kayıt Ol</Text>
        <Text style={styles.subtitle}>Dijital Bahçem'e hoş geldiniz!</Text>

        <SegmentedButtons
          value={userType}
          onValueChange={setUserType}
          buttons={[
            { value: 'user', label: 'Kullanıcı' },
            { value: 'farmer', label: 'Çiftçi' },
          ]}
          style={styles.segmentedButtons}
        />

        <TextInput
          label="Ad Soyad"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="E-posta"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <TextInput
          label="Şifre"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry
          style={styles.input}
        />

        <TextInput
          label="Şifre Tekrar"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          mode="outlined"
          secureTextEntry
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleRegister}
          style={styles.button}
          loading={loading}
        >
          Kayıt Ol
        </Button>

        <View style={styles.loginContainer}>
          <Text>Zaten hesabınız var mı? </Text>
          <Button
            mode="text"
            onPress={() => router.push('/auth/login')}
            style={styles.textButton}
          >
            Giriş Yap
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
  segmentedButtons: {
    marginBottom: 24,
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
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
}); 