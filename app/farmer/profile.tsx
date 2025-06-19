import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Alert } from 'react-native';
import { Text, Surface, Button, Avatar, List, Divider, Switch, Chip, Card, IconButton } from 'react-native-paper';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with gradient */}
      <LinearGradient
        colors={['#2E7D32', '#388E3C']}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Profil</Text>
            <Text style={styles.headerSubtitle}>Çiftçi Hesabı</Text>
          </View>
          <IconButton
            icon="account-edit"
            size={24}
            iconColor="#fff"
            style={styles.editButton}
            onPress={() => Alert.alert('Profil Düzenle', 'Profil düzenleme sayfası açılacak')}
          />
        </View>
      </LinearGradient>

      {/* Profile Card */}
      <Surface style={styles.profileCard} elevation={3}>
        <View style={styles.profileHeader}>
          <Avatar.Image 
            size={100} 
            source={{ uri: FARMER_DATA.avatar }} 
            style={styles.avatar} 
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{FARMER_DATA.name}</Text>
            <Text style={styles.profileEmail}>{FARMER_DATA.email}</Text>
            <View style={styles.locationContainer}>
              <Avatar.Icon icon="map-marker" size={16} style={styles.locationIcon} color="#2E7D32" />
              <Text style={styles.profileLocation}>{FARMER_DATA.location}</Text>
            </View>
            <View style={styles.ratingContainer}>
              <Avatar.Icon icon="star" size={16} style={styles.ratingIcon} color="#FFD700" />
              <Text style={styles.rating}>{FARMER_DATA.rating}</Text>
              <Text style={styles.reviewCount}>({FARMER_DATA.reviewCount} değerlendirme)</Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.about}>{FARMER_DATA.about}</Text>

        <View style={styles.specialtiesContainer}>
          {FARMER_DATA.specialties.map((specialty, index) => (
            <Chip key={index} style={styles.specialtyChip} textStyle={styles.specialtyText}>
              {specialty}
            </Chip>
          ))}
        </View>

        {walletConnected && (
          <View style={styles.walletSection}>
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
          </View>
        )}
      </Surface>

      {/* Statistics Cards */}
      <View style={styles.statsContainer}>
        <Surface style={styles.statCard} elevation={2}>
          <View style={styles.statContent}>
            <Avatar.Icon icon="tree" size={40} style={styles.statIcon} color="#2E7D32" />
            <View style={styles.statText}>
              <Text style={styles.statValue}>{FARMER_DATA.activeRentals}</Text>
              <Text style={styles.statLabel}>Aktif Kiralama</Text>
            </View>
          </View>
        </Surface>

        <Surface style={styles.statCard} elevation={2}>
          <View style={styles.statContent}>
            <Avatar.Icon icon="fruit-cherries" size={40} style={styles.statIcon} color="#2E7D32" />
            <View style={styles.statText}>
              <Text style={styles.statValue}>{FARMER_DATA.totalHarvest}</Text>
              <Text style={styles.statLabel}>Toplam Hasat</Text>
            </View>
          </View>
        </Surface>

        <Surface style={styles.statCard} elevation={2}>
          <View style={styles.statContent}>
            <Avatar.Icon icon="calendar" size={40} style={styles.statIcon} color="#2E7D32" />
            <View style={styles.statText}>
              <Text style={styles.statValue}>{FARMER_DATA.experience}</Text>
              <Text style={styles.statLabel}>Deneyim</Text>
            </View>
          </View>
        </Surface>
      </View>

      {/* Detailed Statistics */}
      <Surface style={styles.section} elevation={2}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Detaylı İstatistikler</Text>
        </View>
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
      </Surface>

      {/* Certifications */}
      <Surface style={styles.section} elevation={2}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Sertifikalar</Text>
        </View>
        <View style={styles.certificatesContainer}>
          {FARMER_DATA.certifications.map((cert, index) => (
            <Chip key={index} style={styles.certChip} icon="check-circle" textStyle={styles.certText}>
              {cert}
            </Chip>
          ))}
        </View>
      </Surface>

      {/* Digital Wallet Section */}
      <Surface style={styles.section} elevation={2}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Dijital Cüzdan</Text>
        </View>
        <List.Item
          title="Dijital Cüzdan Bağla"
          description={walletConnected ? "Cüzdanınız bağlı - %30 kripto indirimi aktif" : "WalletConnect ile cüzdanınızı bağlayın"}
          left={(props) => <List.Icon {...props} icon="wallet" color="#2E7D32" />}
          right={() => (
            <Switch
              value={walletConnected}
              onValueChange={handleWalletConnection}
              color="#2E7D32"
            />
          )}
          style={styles.listItem}
          titleStyle={styles.listItemTitle}
          descriptionStyle={styles.listItemDescription}
        />
        {walletConnected && (
          <>
            <List.Item
              title="NFT Koleksiyonum"
              description={`${FARMER_DATA.totalNFTs} ağaç NFT'si`}
              left={(props) => <List.Icon {...props} icon="nfc" color="#2E7D32" />}
              onPress={() => router.push('/nft-collection')}
              style={styles.listItem}
              titleStyle={styles.listItemTitle}
              descriptionStyle={styles.listItemDescription}
            />
            <List.Item
              title="Blockchain İşlemleri"
              description={`${FARMER_DATA.blockchainTransactions} işlem`}
              left={(props) => <List.Icon {...props} icon="block-helper" color="#2E7D32" />}
              onPress={() => router.push('/blockchain-transactions')}
              style={styles.listItem}
              titleStyle={styles.listItemTitle}
              descriptionStyle={styles.listItemDescription}
            />
          </>
        )}
      </Surface>

      {/* Account Settings Section */}
      <Surface style={styles.section} elevation={2}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Hesap Ayarları</Text>
        </View>
        <List.Item
          title="Bildirim Ayarları"
          left={(props) => <List.Icon {...props} icon="bell-outline" color="#2E7D32" />}
          onPress={() => Alert.alert('Bildirimler', 'Bildirim ayarları sayfası açılacak')}
          style={styles.listItem}
          titleStyle={styles.listItemTitle}
        />
        <List.Item
          title="Ödeme Yöntemleri"
          left={(props) => <List.Icon {...props} icon="credit-card" color="#2E7D32" />}
          onPress={() => Alert.alert('Ödeme Yöntemleri', 'Ödeme yöntemleri sayfası açılacak')}
          style={styles.listItem}
          titleStyle={styles.listItemTitle}
        />
        <List.Item
          title="Dil Seçimi"
          left={(props) => <List.Icon {...props} icon="translate" color="#2E7D32" />}
          onPress={() => Alert.alert('Dil Seçimi', 'Dil seçimi sayfası açılacak')}
          style={styles.listItem}
          titleStyle={styles.listItemTitle}
        />
        <List.Item
          title="Yardım ve Destek"
          left={(props) => <List.Icon {...props} icon="help-circle" color="#2E7D32" />}
          onPress={() => Alert.alert('Yardım', 'Yardım ve destek sayfası açılacak')}
          style={styles.listItem}
          titleStyle={styles.listItemTitle}
        />
        <List.Item
          title="Hakkında"
          left={(props) => <List.Icon {...props} icon="information" color="#2E7D32" />}
          onPress={() => Alert.alert('Hakkında', 'Uygulama hakkında bilgiler')}
          style={styles.listItem}
          titleStyle={styles.listItemTitle}
        />
      </Surface>

      <Button
        mode="outlined"
        onPress={handleLogout}
        style={styles.logoutButton}
        textColor="#B00020"
        labelStyle={styles.logoutButtonLabel}
      >
        Çıkış Yap
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E8F5E9',
    fontWeight: '500',
    textAlign: 'center',
  },
  editButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    margin: 0,
    position: 'absolute',
    right: 0,
  },
  profileCard: {
    margin: 20,
    marginTop: -10,
    padding: 24,
    borderRadius: 24,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    marginRight: 20,
    borderWidth: 4,
    borderColor: '#E8F5E9',
    backgroundColor: '#fff',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 4,
  },
  profileEmail: {
    color: '#666',
    fontSize: 16,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationIcon: {
    backgroundColor: '#E8F5E9',
    marginRight: 6,
  },
  profileLocation: {
    color: '#2E7D32',
    fontSize: 15,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingIcon: {
    backgroundColor: 'transparent',
    marginRight: 6,
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginRight: 6,
  },
  reviewCount: {
    fontSize: 14,
    color: '#666',
  },
  about: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
    marginBottom: 20,
    textAlign: 'left',
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  specialtyChip: {
    marginRight: 10,
    marginBottom: 8,
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
  },
  specialtyText: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  walletSection: {
    alignItems: 'flex-start',
  },
  walletChip: {
    backgroundColor: '#E8F5E9',
    marginBottom: 8,
  },
  walletChipText: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  walletAddress: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statContent: {
    padding: 16,
    alignItems: 'center',
  },
  statIcon: {
    backgroundColor: '#E8F5E9',
    marginBottom: 8,
  },
  statText: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
    textAlign: 'center',
  },
  section: {
    margin: 20,
    marginTop: 0,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 18,
    color: '#1B5E20',
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
  },
  statItem: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    marginHorizontal: '1%',
  },
  certificatesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
  },
  certChip: {
    marginRight: 10,
    marginBottom: 8,
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
  },
  certText: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  listItem: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    paddingVertical: 4,
  },
  listItemTitle: {
    fontSize: 16,
    color: '#1B5E20',
    fontWeight: '600',
  },
  listItemDescription: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    margin: 20,
    borderColor: '#B00020',
    borderRadius: 16,
    paddingVertical: 8,
    borderWidth: 2,
  },
  logoutButtonLabel: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});