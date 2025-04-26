import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, HelperText, IconButton, Surface } from 'react-native-paper';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function RegisterScreen() {
  const [userType, setUserType] = useState('user');
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    confirmPassword: '',
    gardenLocation: '',
    products: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const validateForm = () => {
    if (!formData.name || !formData.surname) {
      setError('Ad ve soyad alanları zorunludur');
      return false;
    }
    if (!formData.email || !formData.email.includes('@')) {
      setError('Geçerli bir e-posta adresi giriniz');
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return false;
    }
    if (userType === 'farmer') {
      if (!formData.gardenLocation) {
        setError('Bahçe konumu zorunludur');
        return false;
      }
      if (!formData.products) {
        setError('Üretilen ürünler zorunludur');
        return false;
      }
      if (!formData.phone) {
        setError('Telefon numarası zorunludur');
        return false;
      }
    }
    if (!acceptTerms) {
      setError('Kullanım koşullarını kabul etmelisiniz');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const userData = {
        id: Date.now().toString(),
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        password: formData.password,
        userType,
        ...(userType === 'farmer' && {
          gardenLocation: formData.gardenLocation,
          products: formData.products,
          phone: formData.phone,
        }),
      };

      await AsyncStorage.setItem('user', JSON.stringify(userData));
      await AsyncStorage.setItem('currentUser', JSON.stringify(userData));

      if (userType === 'farmer') {
        router.replace('/farmer/');
      } else {
        router.replace('/(tabs)/');
      }
    } catch (error) {
      console.error('Kayıt hatası:', error);
      setError('Kayıt olurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const UserTypeCard = ({ type, title, description, icon }) => (
    <TouchableOpacity
      onPress={() => setUserType(type)}
      style={[
        styles.userTypeCard,
        userType === type && styles.selectedCard
      ]}
    >
      <Surface style={[styles.iconContainer, userType === type && styles.selectedIconContainer]}>
        <MaterialCommunityIcons
          name={icon}
          size={32}
          color={userType === type ? '#fff' : '#2E7D32'}
        />
      </Surface>
      <Text style={[styles.cardTitle, userType === type && styles.selectedText]}>
        {title}
      </Text>
      <Text style={[styles.cardDescription, userType === type && styles.selectedText]}>
        {description}
      </Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={['#4CAF50', '#2E7D32']}
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
            <Text style={styles.welcomeText}>Yeni Hesap</Text>
            <Text style={styles.subtitle}>
              Dijital Bahçem'e hoş geldiniz
            </Text>
          </View>

          <Surface style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Hesap Türü</Text>
            <View style={styles.userTypeContainer}>
              <UserTypeCard
                type="user"
                title="Kullanıcı"
                description="Kendi ağacınızın hikayesine ortak olun"
                icon="account"
              />
              <UserTypeCard
                type="farmer"
                title="Çiftçi"
                description="Bahçenizi dijital dünyaya taşıyın"
                icon="tree"
              />
            </View>

            <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>
            
            <TextInput
              label="Ad"
              value={formData.name}
              onChangeText={(text) => {
                setFormData({ ...formData, name: text });
                setError('');
              }}
              mode="outlined"
              style={styles.input}
              outlineStyle={styles.inputOutline}
              left={<TextInput.Icon icon="account" />}
              theme={{ colors: { primary: '#2E7D32' } }}
            />

            <TextInput
              label="Soyad"
              value={formData.surname}
              onChangeText={(text) => {
                setFormData({ ...formData, surname: text });
                setError('');
              }}
              mode="outlined"
              style={styles.input}
              outlineStyle={styles.inputOutline}
              left={<TextInput.Icon icon="account" />}
              theme={{ colors: { primary: '#2E7D32' } }}
            />

            <TextInput
              label="E-posta"
              value={formData.email}
              onChangeText={(text) => {
                setFormData({ ...formData, email: text });
                setError('');
              }}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              outlineStyle={styles.inputOutline}
              left={<TextInput.Icon icon="email" />}
              theme={{ colors: { primary: '#2E7D32' } }}
            />

            <TextInput
              label="Şifre"
              value={formData.password}
              onChangeText={(text) => {
                setFormData({ ...formData, password: text });
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
              theme={{ colors: { primary: '#2E7D32' } }}
            />

            <TextInput
              label="Şifre Tekrar"
              value={formData.confirmPassword}
              onChangeText={(text) => {
                setFormData({ ...formData, confirmPassword: text });
                setError('');
              }}
              mode="outlined"
              secureTextEntry={!showPassword}
              style={styles.input}
              outlineStyle={styles.inputOutline}
              left={<TextInput.Icon icon="lock" />}
              theme={{ colors: { primary: '#2E7D32' } }}
            />

            {userType === 'farmer' && (
              <>
                <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Çiftçi Bilgileri</Text>
                <TextInput
                  label="Bahçe Konumu"
                  value={formData.gardenLocation}
                  onChangeText={(text) => {
                    setFormData({ ...formData, gardenLocation: text });
                    setError('');
                  }}
                  mode="outlined"
                  style={styles.input}
                  outlineStyle={styles.inputOutline}
                  left={<TextInput.Icon icon="map-marker" />}
                  placeholder="İl, İlçe, Mahalle"
                  theme={{ colors: { primary: '#2E7D32' } }}
                />

                <TextInput
                  label="Üretilen Ürünler"
                  value={formData.products}
                  onChangeText={(text) => {
                    setFormData({ ...formData, products: text });
                    setError('');
                  }}
                  mode="outlined"
                  style={styles.input}
                  outlineStyle={styles.inputOutline}
                  left={<TextInput.Icon icon="fruit-cherries" />}
                  placeholder="Örn: Zeytin, Fındık"
                  theme={{ colors: { primary: '#2E7D32' } }}
                />

                <TextInput
                  label="Telefon"
                  value={formData.phone}
                  onChangeText={(text) => {
                    setFormData({ ...formData, phone: text });
                    setError('');
                  }}
                  mode="outlined"
                  keyboardType="phone-pad"
                  style={styles.input}
                  outlineStyle={styles.inputOutline}
                  left={<TextInput.Icon icon="phone" />}
                  placeholder="05XX XXX XX XX"
                  theme={{ colors: { primary: '#2E7D32' } }}
                />
              </>
            )}

            <TouchableOpacity
              style={styles.termsContainer}
              onPress={() => setAcceptTerms(!acceptTerms)}
            >
              <MaterialCommunityIcons
                name={acceptTerms ? "checkbox-marked" : "checkbox-blank-outline"}
                size={24}
                color="#2E7D32"
              />
              <Text style={styles.termsText}>
                Kullanım koşullarını kabul ediyorum
              </Text>
            </TouchableOpacity>

            {error ? (
              <HelperText type="error" visible={!!error} style={styles.errorText}>
                {error}
              </HelperText>
            ) : null}

            <Button
              mode="contained"
              onPress={handleRegister}
              style={styles.registerButton}
              contentStyle={styles.buttonContent}
              loading={loading}
              icon="account-plus"
            >
              {loading ? 'Kayıt yapılıyor...' : 'Hesap Oluştur'}
            </Button>

            <Button
              mode="text"
              onPress={() => router.back()}
              style={styles.backButton}
              textColor="#666"
            >
              Zaten hesabım var
            </Button>
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
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 16,
  },
  userTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  userTypeCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  selectedCard: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedIconContainer: {
    backgroundColor: '#1B5E20',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
    color: '#666',
  },
  selectedText: {
    color: '#fff',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  inputOutline: {
    borderRadius: 8,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  termsText: {
    marginLeft: 8,
    color: '#666',
    flex: 1,
  },
  errorText: {
    marginBottom: 16,
    fontSize: 14,
  },
  registerButton: {
    marginTop: 8,
    backgroundColor: '#2E7D32',
    borderRadius: 8,
    height: 48,
  },
  buttonContent: {
    height: 48,
  },
  backButton: {
    marginTop: 12,
  },
}); 