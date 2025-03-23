import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import { router } from 'expo-router';

export default function SplashScreen() {
  const logoOpacity = new Animated.Value(0);
  const titleOpacity = new Animated.Value(0);

  useEffect(() => {
    // Logo ve başlık için fade-in animasyonu
    Animated.sequence([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // 2.5 saniye sonra Auth ekranına yönlendir
    const timer = setTimeout(() => {
      router.replace('/auth');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, { opacity: logoOpacity }]}>
        <Text style={styles.logo}>🌳</Text>
      </Animated.View>
      <Animated.View style={{ opacity: titleOpacity }}>
        <Text style={styles.title}>Dijital Bahçem</Text>
        <Text style={styles.subtitle}>Doğayla Bağınızı Güçlendirin</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    fontSize: 80,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#558B2F',
    textAlign: 'center',
  },
}); 