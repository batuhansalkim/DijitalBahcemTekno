import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Alert } from 'react-native';
import { Text, Surface, Button, Avatar, List, Divider, Switch, Chip, Card } from 'react-native-paper';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

// Örnek çiftçi verileri
const FARMER_DATA = {
  name: 'Ahmet Çiftçi',
  email: 'ahmet.ciftci@email.com',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
  phone: '+90 555 123 4567',
  location: 'Ayvalık, Balıkesir',
  experience: '15 yıl',
  about: 'Üç nesildir zeytincilik yapan ailemizle birlikte organik tarım ilkeleriyle ağaçlarımızı özenle yetiştiriyoruz.',
  specialties: ['Zeytin', 'Narenciye', 'Organik Tarım'],
  rating: 4.8,
  reviewCount: 127,
  treeCount: 250,
  customerCount: 180,
  activeRentals: 45,
  totalHarvest: '12.5 ton',
  memberSince: '2010',
  walletAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  totalNFTs: 8,
  blockchainTransactions: 23,
  certifications: ['Organik Tarım', 'İyi Tarım'],
  statistics: {
    totalHarvest: '12.5 ton',
    activeRentals: 145,
    completedRentals: 890,
    satisfactionRate: 98,
  }
};

// Örnek bahçe verileri
const GARDEN_DATA = [
  {
    id: '1',
    name: 'Ayvalık Zeytinliği',
    location: 'Ayvalık, Balıkesir',
    treeCount: 150,
    area: '25 dönüm',
    treeTypes: ['Zeytin'],
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578',
  },
  {
    id: '2',
    name: 'Finike Portakal Bahçesi',
    location: 'Finike, Antalya',
    treeCount: 100,
    area: '15 dönüm',
    treeTypes: ['Portakal', 'Mandalina'],
    image: 'https://images.unsplash.com/photo-1590086783191-a0694c7d1e6e',
  }
];

export default function FarmerProfileScreen() {
  const [walletConnected, setWalletConnected] = useState(false);

  const handleWalletConnection = (value: boolean) => {
    setWalletConnected(value);
    if (value) {
      Alert.alert('Başarılı', 'Dijital cüzdan başarıyla bağlandı!');
    } else {
      Alert.alert('Bağlantı Kesildi', 'Dijital cüzdan bağlantısı kesildi.');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkış yapmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Çıkış Yap', style: 'destructive', onPress: () => router.push('/auth') }
      ]
    );
  };

  return (
    <ScrollView style={styles.bg} contentContainerStyle={{ paddingBottom: 32 }}>
      {/* Profile Card */}
      <Surface style={styles.profileCard} elevation={4}>
        <View style={styles.profileTopRow}>
          <Avatar.Image size={90} source={{ uri: FARMER_DATA.avatar }} style={styles.avatar} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{FARMER_DATA.name}</Text>
            <Text style={styles.profileEmail}>{FARMER_DATA.email}</Text>
            <Text style={styles.profileLocation}>{FARMER_DATA.location}</Text>
            <View style={styles.ratingContainer}>
              <Avatar.Icon icon="star" size={16} style={styles.ratingIcon} color="#FFD700" />
              <Text style={styles.rating}>{FARMER_DATA.rating}</Text>
              <Text style={styles.reviewCount}>({FARMER_DATA.reviewCount} değerlendirme)</Text>
            </View>
            {walletConnected && (
              <>
                <Chip 
                  icon="wallet" 
                  style={styles.walletChip}
                  textStyle={styles.walletChipText}
                >
                  Cüzdan Bağlı
                </Chip>
                <Text style={styles.walletAddress}>
                  {FARMER_DATA.walletAddress.substring(0, 10)}...{FARMER_DATA.walletAddress.substring(38)}
                </Text>
              </>
            )}
          </View>
        </View>
        
        <Text style={styles.about}>{FARMER_DATA.about}</Text>

        <View style={styles.specialtiesContainer}>
          {FARMER_DATA.specialties.map((specialty, index) => (
            <Chip key={index} style={styles.specialtyChip}>{specialty}</Chip>
          ))}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Avatar.Icon icon="tree" size={32} style={styles.statIcon} color="#2D6A4F" />
            <Text style={styles.statValue}>{FARMER_DATA.activeRentals}</Text>
            <Text style={styles.statLabel}>Aktif Kiralama</Text>
          </View>
          <View style={styles.statBox}>
            <Avatar.Icon icon="fruit-cherries" size={32} style={styles.statIcon} color="#2D6A4F" />
            <Text style={styles.statValue}>{FARMER_DATA.totalHarvest}</Text>
            <Text style={styles.statLabel}>Toplam Hasat</Text>
          </View>
          <View style={styles.statBox}>
            <Avatar.Icon icon="calendar" size={32} style={styles.statIcon} color="#2D6A4F" />
            <Text style={styles.statValue}>{FARMER_DATA.experience}</Text>
            <Text style={styles.statLabel}>Deneyim</Text>
          </View>
        </View>
      </Surface>

      {/* İstatistikler */}
      <Surface style={styles.section} elevation={2}>
        <List.Section>
          <List.Subheader style={styles.sectionHeader}>Detaylı İstatistikler</List.Subheader>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{FARMER_DATA.statistics.activeRentals}</Text>
              <Text style={styles.statLabel}>Aktif Kiralama</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{FARMER_DATA.statistics.totalHarvest}</Text>
              <Text style={styles.statLabel}>Toplam Hasat</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{FARMER_DATA.treeCount}</Text>
              <Text style={styles.statLabel}>Ağaç Sayısı</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>%{FARMER_DATA.statistics.satisfactionRate}</Text>
              <Text style={styles.statLabel}>Memnuniyet</Text>
            </View>
          </View>
        </List.Section>
      </Surface>

      {/* Sertifikalar */}
      <Surface style={styles.section} elevation={2}>
        <List.Section>
          <List.Subheader style={styles.sectionHeader}>Sertifikalar</List.Subheader>
          <View style={styles.certificatesContainer}>
            {FARMER_DATA.certifications.map((cert, index) => (
              <Chip key={index} style={styles.certChip} icon="check-circle">
                {cert}
              </Chip>
            ))}
          </View>
        </List.Section>
      </Surface>

      {/* Bahçeler */}
      <Surface style={styles.section} elevation={2}>
        <List.Section>
          <List.Subheader style={styles.sectionHeader}>Bahçelerim</List.Subheader>
          {GARDEN_DATA.map(garden => (
            <Card
              key={garden.id}
              style={styles.gardenCard}
              onPress={() => router.push({
                pathname: '/garden/[id]' as const,
                params: { id: garden.id }
              })}
            >
              <Card.Cover source={{ uri: garden.image }} style={styles.gardenImage} />
              <Card.Content style={styles.gardenContent}>
                <Text style={styles.gardenName}>{garden.name}</Text>
                <Text style={styles.gardenLocation}>{garden.location}</Text>
                <View style={styles.gardenDetails}>
                  <Text style={styles.gardenStat}>{garden.treeCount} ağaç</Text>
                  <Text style={styles.gardenStat}>{garden.area}</Text>
                </View>
                <View style={styles.treeTypesContainer}>
                  {garden.treeTypes.map((type, index) => (
                    <Chip key={index} style={styles.treeTypeChip}>{type}</Chip>
                  ))}
                </View>
              </Card.Content>
            </Card>
          ))}
        </List.Section>
      </Surface>

      {/* Digital Wallet Section */}
      <Surface style={styles.section} elevation={2}>
        <List.Section>
          <List.Subheader style={styles.sectionHeader}>Dijital Cüzdan</List.Subheader>
          <List.Item
            title="Dijital Cüzdan Bağla"
            description={walletConnected ? "Cüzdanınız bağlı - %30 kripto indirimi aktif" : "WalletConnect ile cüzdanınızı bağlayın"}
            left={(props) => <List.Icon {...props} icon="wallet" color="#2D6A4F" />}
            right={() => (
              <Switch
                value={walletConnected}
                onValueChange={handleWalletConnection}
                color="#2D6A4F"
              />
            )}
            style={styles.listItem}
            titleStyle={styles.listItemTitle}
          />
          {walletConnected && (
            <>
              <List.Item
                title="NFT Koleksiyonum"
                description={`${FARMER_DATA.totalNFTs} ağaç NFT'si`}
                left={(props) => <List.Icon {...props} icon="nfc" color="#2D6A4F" />}
                onPress={() => router.push('/nft-collection')}
                style={styles.listItem}
                titleStyle={styles.listItemTitle}
              />
              <List.Item
                title="Blockchain İşlemleri"
                description={`${FARMER_DATA.blockchainTransactions} işlem`}
                left={(props) => <List.Icon {...props} icon="block-helper" color="#2D6A4F" />}
                onPress={() => router.push('/blockchain-transactions')}
                style={styles.listItem}
                titleStyle={styles.listItemTitle}
              />
            </>
          )}
        </List.Section>
      </Surface>

      {/* Account Settings Section */}
      <Surface style={styles.section} elevation={2}>
        <List.Section>
          <List.Subheader style={styles.sectionHeader}>Hesap Ayarları</List.Subheader>
          <List.Item
            title="Profili Düzenle"
            left={(props) => <List.Icon {...props} icon="account-edit" color="#2D6A4F" />}
            onPress={() => Alert.alert('Profil Düzenle', 'Profil düzenleme sayfası açılacak')}
            style={styles.listItem}
            titleStyle={styles.listItemTitle}
          />
          <List.Item
            title="Bildirim Ayarları"
            left={(props) => <List.Icon {...props} icon="bell-outline" color="#2D6A4F" />}
            onPress={() => Alert.alert('Bildirimler', 'Bildirim ayarları sayfası açılacak')}
            style={styles.listItem}
            titleStyle={styles.listItemTitle}
          />
          <List.Item
            title="Ödeme Yöntemleri"
            left={(props) => <List.Icon {...props} icon="credit-card" color="#2D6A4F" />}
            onPress={() => Alert.alert('Ödeme Yöntemleri', 'Ödeme yöntemleri sayfası açılacak')}
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
            onPress={() => Alert.alert('Dil Seçimi', 'Dil seçimi sayfası açılacak')}
            style={styles.listItem}
            titleStyle={styles.listItemTitle}
          />
          <List.Item
            title="Yardım ve Destek"
            left={(props) => <List.Icon {...props} icon="help-circle" color="#2D6A4F" />}
            onPress={() => Alert.alert('Yardım', 'Yardım ve destek sayfası açılacak')}
            style={styles.listItem}
            titleStyle={styles.listItemTitle}
          />
          <List.Item
            title="Hakkında"
            left={(props) => <List.Icon {...props} icon="information" color="#2D6A4F" />}
            onPress={() => Alert.alert('Hakkında', 'Uygulama hakkında bilgiler')}
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
  profileLocation: {
    color: '#2D6A4F',
    marginTop: 2,
    fontSize: 14,
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingIcon: {
    backgroundColor: 'transparent',
    marginRight: 4,
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: '#666',
  },
  about: {
    fontSize: 14,
    lineHeight: 20,
    color: '#444',
    marginBottom: 16,
    textAlign: 'center',
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
  },
  specialtyChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#E8F5E9',
  },
  walletChip: {
    backgroundColor: '#E8F5E9',
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  walletChipText: {
    color: '#2D6A4F',
    fontWeight: '600',
  },
  walletAddress: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontFamily: 'monospace',
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  statItem: {
    width: '48%',
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  certificatesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
  },
  certChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#E8F5E9',
  },
  gardenCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gardenImage: {
    height: 150,
  },
  gardenContent: {
    padding: 16,
  },
  gardenName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  gardenLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  gardenDetails: {
    flexDirection: 'row',
    marginTop: 8,
  },
  gardenStat: {
    fontSize: 14,
    color: '#2E7D32',
    marginRight: 16,
  },
  treeTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  treeTypeChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#E8F5E9',
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