import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { Text, TextInput, Button, HelperText, IconButton, Surface } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const { type } = useLocalSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Sayfa başlığını kullanıcı tipine göre ayarla
    if (type === 'farmer') {
      router.setParams({ title: 'Çiftçi Girişi' });
    } else {
      router.setParams({ title: 'Kullanıcı Girişi' });
    }
  }, [type]);

  const validateInputs = () => {
    if (!email || !email.includes('@')) {
      setError('Geçerli bir e-posta adresi giriniz');
      return false;
    }
    if (!password || password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    setError('');

    try {
      // Gerçek API entegrasyonunda bu kısım değişecek
      const userDataString = await AsyncStorage.getItem('user');
      
      // Test kullanıcıları
      const fakeUsers = [
        {
          id: '1',
          email: 'batu@gmail.com',
          password: '123456',
          userType: 'user',
          name: 'Test Kullanıcı'
        },
        {
          id: '2',
          email: 'ciftci@gmail.com',
          password: '123456',
          userType: 'farmer',
          name: 'Test Çiftçi'
        }
      ];

      const user = userDataString 
        ? JSON.parse(userDataString)
        : fakeUsers.find(u => u.email === email && u.password === password);

      if (!user) {
        setError('E-posta veya şifre hatalı');
        return;
      }

      if (type !== user.userType) {
        setError(`Bu giriş sayfası ${type === 'farmer' ? 'çiftçiler' : 'kullanıcılar'} içindir`);
        return;
      }

      // Kullanıcı bilgilerini kaydet
      await AsyncStorage.setItem('currentUser', JSON.stringify(user));

      // Kullanıcı tipine göre yönlendirme
      if (user.userType === 'farmer') {
        router.replace('/farmer/');
      } else {
        router.replace('/(tabs)/');
      }
    } catch (error) {
      console.error('Giriş hatası:', error);
      setError('Giriş yapılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={type === 'farmer' ? ['#2E7D32', '#1B5E20'] : ['#4CAF50', '#2E7D32']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={() => router.back()}
            iconColor="#fff"
          />
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.topSection}>
            <MaterialCommunityIcons 
              name={type === 'farmer' ? 'tree' : 'sprout'} 
              size={80} 
              color="#fff" 
            />
            <Text style={styles.welcomeText}>Hoş Geldiniz!</Text>
            <Text style={styles.subtitle}>
              {type === 'farmer' 
                ? 'Bahçenizi dijital dünyaya taşıyın'
                : 'Kendi ağacınızın hikayesine ortak olun'}
            </Text>
          </View>

          <Surface style={styles.formContainer}>
            <Text style={styles.title}>
              {type === 'farmer' ? 'Çiftçi Girişi' : 'Kullanıcı Girişi'}
            </Text>

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
  outlineStyle={styles.inputOutline}
  left={<TextInput.Icon icon="email" />}
  textColor="#000" //yazı rengi buradan belirleniyor
  theme={{ colors: { primary: '#2E7D32' } }}
/>

<TextInput
  label="Şifre"
  value={password}
  onChangeText={(text) => {
    setPassword(text);
    setError('');
  }}
  mode="outlined"
  secureTextEntry={!showPassword}
  style={styles.input}
  outlineStyle={styles.inputOutline}
  left={<TextInput.Icon icon="lock" />}
  right={
    <TextInput.Icon
      icon={showPassword ? "eye-off" : "eye"}
      onPress={() => setShowPassword(!showPassword)}
    />
  }
  textColor="#000" //yazı rengi buradan belirleniyor
  theme={{ colors: { primary: '#2E7D32' } }}
/>

            {error ? (
              <HelperText type="error" visible={!!error} style={styles.errorText}>
                {error}
              </HelperText>
            ) : null}

            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.loginButton}
              contentStyle={styles.buttonContent}
              loading={loading}
              icon="login"
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </Button>

            <Button
              mode="text"
              onPress={() => router.push('/auth/forgot-password')}
              style={styles.forgotPassword}
              textColor="#666"
            >
              Şifremi Unuttum
            </Button>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>veya</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Hesabınız yok mu?</Text>
              <Button
                mode="outlined"
                onPress={() => router.push(`/auth/register?type=${type}`)}
                style={styles.registerButton}
                contentStyle={styles.registerButtonContent}
              >
                Yeni Hesap Oluştur
              </Button>
            </View>
          </Surface>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  gradient: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 40 : 10,
    paddingHorizontal: 10,
  },
  scrollContent: {
    flexGrow: 1,
  },
  topSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#E8F5E9',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 32,
  },
  formContainer: {
    backgroundColor: '#fff',
    marginTop: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    elevation: 8,
    minHeight: 600,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  inputOutline: {
    borderRadius: 8,
  },
  errorText: {
    marginBottom: 16,
    fontSize: 14,
  },
  loginButton: {
    marginTop: 8,
    backgroundColor: '#2E7D32',
    borderRadius: 8,
    height: 48,
  },
  buttonContent: {
    height: 48,
  },
  forgotPassword: {
    marginTop: 12,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#666',
  },
  registerContainer: {
    alignItems: 'center',
  },
  registerText: {
    color: '#666',
    marginBottom: 12,
  },
  registerButton: {
    width: '100%',
    borderColor: '#2E7D32',
    borderRadius: 8,
  },
  registerButtonContent: {
    height: 48,
  },
}); 