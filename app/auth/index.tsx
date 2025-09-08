import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Button, Surface } from 'react-native-paper';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function AuthScreen() {
  return (

    
    <View style={styles.container}>
      <LinearGradient
        colors={['#4CAF50', '#2E7D32']}
        style={styles.gradient}
      >
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>🌳</Text>
          <Text style={styles.title}>Dijital Bahçem</Text>
          <Text style={styles.subtitle}>Doğayla Bağınızı Güçlendirin</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Surface style={styles.surface}>
            <Button
              mode="contained"
              onPress={() => router.push('/auth/login?type=user')}
              style={styles.button}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
            >
              Kullanıcı Girişi
            </Button>

            <Button
              mode="contained"
              onPress={() => router.push('/auth/login?type=farmer')}
              style={[styles.button, styles.farmerButton]}
              contentStyle={styles.buttonContent}
              labelStyle={[styles.buttonLabel, styles.farmerButtonLabel]}
            >
              Çiftçi Girişi
            </Button>

            <Button
              mode="outlined"
              onPress={() => router.push('/auth/register')}
              style={styles.registerButton}
              labelStyle={styles.registerButtonLabel}
            >
              Yeni Hesap Oluştur
            </Button>

            {/* Hızlı Test Girişi */}
            <View style={styles.divider}>
              <Text style={styles.dividerText}>Hızlı Test</Text>
            </View>

            <Button
              mode="contained"
              onPress={() => router.push('/(tabs)' as any)}
              style={[styles.button, styles.testButton]}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
            >
              🚀 Hızlı Giriş (Test)
            </Button>
          </Surface>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 48,
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 40,
  },
  logo: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#E8F5E9',
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 20,
  },
  surface: {
    padding: 20,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    elevation: 4,
  },
  button: {
    marginBottom: 12,
    height: 50,
    justifyContent: 'center',
  },
  buttonContent: {
    height: 50,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  farmerButtonLabel: {
    color: '#ffffff',
  },
  farmerButton: {
    backgroundColor: '#1B5E20',
  },
  registerButton: {
    marginTop: 8,
    borderColor: '#2E7D32',
  },
  registerButtonLabel: {
    color: '#2E7D32',
  },
  divider: {
    marginVertical: 16,
    alignItems: 'center',
  },
  dividerText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  testButton: {
    backgroundColor: '#FF6B35',
    marginTop: 8,
  },
}); 