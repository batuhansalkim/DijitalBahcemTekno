import React from 'react';
import { View, StyleSheet, ScrollView, Alert, Image } from 'react-native';
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
    <ScrollView style={styles.bg} contentContainerStyle={{ paddingBottom: 32 }}>
      {/* Profile Card */}
      <Surface style={styles.profileCard} elevation={4}>
        <View style={styles.profileTopRow}>
          <Avatar.Image size={90} source={{ uri: USER_DATA.avatar }} style={styles.avatar} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{USER_DATA.name}</Text>
            <Text style={styles.profileEmail}>{USER_DATA.email}</Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Avatar.Icon icon="tree" size={32} style={styles.statIcon} color="#2D6A4F" />
            <Text style={styles.statValue}>{USER_DATA.activeRentals}</Text>
            <Text style={styles.statLabel}>Aktif Kiralama</Text>
          </View>
          <View style={styles.statBox}>
            <Avatar.Icon icon="fruit-cherries" size={32} style={styles.statIcon} color="#2D6A4F" />
            <Text style={styles.statValue}>{USER_DATA.totalHarvest}</Text>
            <Text style={styles.statLabel}>Toplam Hasat</Text>
          </View>
          <View style={styles.statBox}>
            <Avatar.Icon icon="calendar" size={32} style={styles.statIcon} color="#2D6A4F" />
            <Text style={styles.statValue}>{USER_DATA.memberSince}</Text>
            <Text style={styles.statLabel}>Üyelik Yılı</Text>
          </View>
        </View>
      </Surface>
      {/* Settings Section */}
      <Surface style={styles.section} elevation={2}>
        <List.Section>
          <List.Subheader style={styles.sectionHeader}>Hesap Ayarları</List.Subheader>
          <List.Item
            title="Profili Düzenle"
            left={(props) => <List.Icon {...props} icon="account-edit" color="#2D6A4F" />}
            onPress={() => router.push({ pathname: '/settings/profile' })}
            style={styles.listItem}
            titleStyle={styles.listItemTitle}
          />
          <List.Item
            title="Bildirim Ayarları"
            left={(props) => <List.Icon {...props} icon="bell-outline" color="#2D6A4F" />}
            onPress={() => router.push({ pathname: '/settings/notifications' })}
            style={styles.listItem}
            titleStyle={styles.listItemTitle}
          />
          <List.Item
            title="Ödeme Yöntemleri"
            left={(props) => <List.Icon {...props} icon="credit-card" color="#2D6A4F" />}
            onPress={() => router.push({ pathname: '/settings/payment' })}
            style={styles.listItem}
            titleStyle={styles.listItemTitle}
          />
        </List.Section>
        <Divider style={{ marginVertical: 4 }} />
        <List.Section>
          <List.Subheader style={styles.sectionHeader}>Uygulama</List.Subheader>
          <List.Item
            title="Dil Seçimi"
            left={(props) => <List.Icon {...props} icon="translate" color="#2D6A4F" />}
            onPress={() => router.push({ pathname: '/settings/language' })}
            style={styles.listItem}
            titleStyle={styles.listItemTitle}
          />
          <List.Item
            title="Yardım ve Destek"
            left={(props) => <List.Icon {...props} icon="help-circle" color="#2D6A4F" />}
            onPress={() => router.push({ pathname: '/settings/help' })}
            style={styles.listItem}
            titleStyle={styles.listItemTitle}
          />
          <List.Item
            title="Hakkında"
            left={(props) => <List.Icon {...props} icon="information" color="#2D6A4F" />}
            onPress={() => router.push({ pathname: '/settings/about' })}
            style={styles.listItem}
            titleStyle={styles.listItemTitle}
          />
        </List.Section>
      </Surface>
      <Button
        mode="outlined"
        onPress={handleLogout}
        style={styles.logoutButton}
        textColor="#B00020"
        labelStyle={{ fontWeight: 'bold', fontSize: 16 }}
      >
        Çıkış Yap
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#F5F7F3' },
  profileCard: {
    margin: 16,
    marginBottom: 0,
    padding: 24,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  profileTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 18,
  },
  avatar: {
    marginRight: 18,
    borderWidth: 2,
    borderColor: '#E8F5E9',
    backgroundColor: '#fff',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B4332',
  },
  profileEmail: {
    color: '#666',
    marginTop: 4,
    fontSize: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 14,
    marginHorizontal: 6,
    paddingVertical: 14,
    paddingHorizontal: 4,
    elevation: 0,
  },
  statIcon: {
    backgroundColor: '#E8F5E9',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B4332',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 13,
    color: '#2D6A4F',
    fontWeight: '500',
  },
  section: {
    margin: 16,
    marginTop: 18,
    borderRadius: 18,
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 0,
    elevation: 2,
  },
  sectionHeader: {
    fontSize: 15,
    color: '#1B4332',
    fontWeight: 'bold',
    marginBottom: 2,
    marginTop: 8,
    marginLeft: 8,
  },
  listItem: {
    borderRadius: 12,
    marginHorizontal: 8,
    marginVertical: 2,
    paddingVertical: 2,
  },
  listItemTitle: {
    fontSize: 15,
    color: '#222',
    fontWeight: '500',
  },
  logoutButton: {
    margin: 20,
    borderColor: '#B00020',
    borderRadius: 12,
    paddingVertical: 6,
  },
}); 