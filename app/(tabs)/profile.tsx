import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Avatar, List, Button, Surface, Divider } from 'react-native-paper';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Örnek kullanıcı verisi
const USER_DATA = {
  name: 'Ahmet Yılmaz',
  email: 'ahmet.yilmaz@example.com',
  avatar: 'https://example.com/avatar.jpg',
  activeRentals: 5,
  totalHarvest: '850 kg',
  memberSince: '2023',
};

export default function ProfileScreen() {
  const handleLogout = async () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkış yapmak istediğinize emin misiniz?',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Çıkış Yap',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userToken');
              router.replace('/auth');
            } catch (error) {
              console.error('Çıkış yapılırken hata oluştu:', error);
            }
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.header} elevation={2}>
        <View style={styles.profile}>
          <Avatar.Image
            size={80}
            source={{ uri: USER_DATA.avatar }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text variant="headlineSmall">{USER_DATA.name}</Text>
            <Text variant="bodyMedium" style={styles.email}>
              {USER_DATA.email}
            </Text>
          </View>
        </View>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text variant="titleLarge">{USER_DATA.activeRentals}</Text>
            <Text variant="bodyMedium">Aktif Kiralama</Text>
          </View>
          <View style={styles.stat}>
            <Text variant="titleLarge">{USER_DATA.totalHarvest}</Text>
            <Text variant="bodyMedium">Toplam Hasat</Text>
          </View>
          <View style={styles.stat}>
            <Text variant="titleLarge">{USER_DATA.memberSince}</Text>
            <Text variant="bodyMedium">Üyelik Yılı</Text>
          </View>
        </View>
      </Surface>

      <Surface style={styles.section} elevation={2}>
        <List.Section>
          <List.Subheader>Hesap Ayarları</List.Subheader>
          <List.Item
            title="Profili Düzenle"
            left={(props) => <List.Icon {...props} icon="account-edit" />}
            onPress={() => router.push('/settings/profile')}
          />
          <List.Item
            title="Bildirim Ayarları"
            left={(props) => <List.Icon {...props} icon="bell-outline" />}
            onPress={() => router.push('/settings/notifications')}
          />
          <List.Item
            title="Ödeme Yöntemleri"
            left={(props) => <List.Icon {...props} icon="credit-card" />}
            onPress={() => router.push('/settings/payment')}
          />
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader>Uygulama</List.Subheader>
          <List.Item
            title="Dil Seçimi"
            left={(props) => <List.Icon {...props} icon="translate" />}
            onPress={() => router.push('/settings/language')}
          />
          <List.Item
            title="Yardım ve Destek"
            left={(props) => <List.Icon {...props} icon="help-circle" />}
            onPress={() => router.push('/settings/help')}
          />
          <List.Item
            title="Hakkında"
            left={(props) => <List.Icon {...props} icon="information" />}
            onPress={() => router.push('/settings/about')}
          />
        </List.Section>
      </Surface>

      <Button
        mode="outlined"
        onPress={handleLogout}
        style={styles.logoutButton}
        textColor="#B00020"
      >
        Çıkış Yap
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  email: {
    color: '#666',
    marginTop: 4,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  stat: {
    alignItems: 'center',
  },
  section: {
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  logoutButton: {
    margin: 16,
    borderColor: '#B00020',
  },
}); 