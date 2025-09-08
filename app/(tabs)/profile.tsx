import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Image, Modal, Dimensions } from 'react-native';
import { Text, Avatar, List, Button, Surface, Divider, Switch, Chip, IconButton } from 'react-native-paper';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock servisleri import et
import { walletService } from '../lib/wallet';
import { blockchainService } from '../lib/blockchain';

const { width } = Dimensions.get('window');

// Örnek kullanıcı verisi
const USER_DATA = {
  name: 'Ahmet Yılmaz',
  email: 'ahmet.yilmaz@example.com',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
  activeRentals: 5,
  totalHarvest: '850 kg',
  memberSince: '2023',
  walletConnected: false,
  walletAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  cryptoDiscount: '30%',
  totalNFTs: 3,
  blockchainTransactions: 12,
};

// Fake NFT Collection Data
const NFT_COLLECTION = [
  {
    id: '1',
    name: 'Zeytin Ağacı #123',
    image: 'https://images.unsplash.com/photo-1445264718234-a623be589d37',
    tokenId: '0x1234567890abcdef',
    contractAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    mintDate: '2024-01-15',
    rarity: 'Rare',
    attributes: {
      age: '15 yıl',
      location: 'İzmir, Seferihisar',
      health: '95%',
      yield: '320 kg/yıl'
    }
  },
  {
    id: '2',
    name: 'Portakal Ağacı #456',
    image: 'https://images.unsplash.com/photo-1590086783191-a0694c7d1e6e',
    tokenId: '0xabcdef1234567890',
    contractAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    mintDate: '2024-02-20',
    rarity: 'Common',
    attributes: {
      age: '8 yıl',
      location: 'Antalya, Finike',
      health: '87%',
      yield: '280 kg/yıl'
    }
  },
  {
    id: '3',
    name: 'Fındık Ağacı #789',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b',
    tokenId: '0x7890abcdef123456',
    contractAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    mintDate: '2024-03-10',
    rarity: 'Epic',
    attributes: {
      age: '25 yıl',
      location: 'Giresun, Bulancak',
      health: '92%',
      yield: '450 kg/yıl'
    }
  }
];

// Fake Blockchain Transactions
const BLOCKCHAIN_TRANSACTIONS = [
  {
    id: '1',
    type: 'NFT_MINT',
    description: 'Zeytin Ağacı #123 NFT oluşturuldu',
    amount: '0.05 ETH',
    date: '2024-01-15 14:30:22',
    status: 'confirmed',
    txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    gasUsed: '0.002 ETH'
  },
  {
    id: '2',
    type: 'RENTAL_CONTRACT',
    description: 'Ağaç kiralama sözleşmesi oluşturuldu',
    amount: '0.1 ETH',
    date: '2024-01-15 14:32:15',
    status: 'confirmed',
    txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    gasUsed: '0.003 ETH'
  },
  {
    id: '3',
    type: 'NFT_MINT',
    description: 'Portakal Ağacı #456 NFT oluşturuldu',
    amount: '0.05 ETH',
    date: '2024-02-20 09:15:45',
    status: 'confirmed',
    txHash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
    gasUsed: '0.002 ETH'
  },
  {
    id: '4',
    type: 'HARVEST_UPDATE',
    description: 'Hasat verisi blockchain\'e kaydedildi',
    amount: '0.01 ETH',
    date: '2024-02-25 16:45:30',
    status: 'confirmed',
    txHash: '0x4567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123',
    gasUsed: '0.001 ETH'
  },
  {
    id: '5',
    type: 'NFT_MINT',
    description: 'Fındık Ağacı #789 NFT oluşturuldu',
    amount: '0.05 ETH',
    date: '2024-03-10 11:20:18',
    status: 'confirmed',
    txHash: '0xdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abc',
    gasUsed: '0.002 ETH'
  }
];

export default function ProfileScreen() {
  const [walletConnected, setWalletConnected] = useState(USER_DATA.walletConnected);
  const [showQRModal, setShowQRModal] = useState(false);

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

  const handleWalletConnection = () => {
    if (walletConnected) {
      Alert.alert(
        'Cüzdan Bağlantısını Kes',
        'Dijital cüzdan bağlantısını kesmek istediğinize emin misiniz?',
        [
          { text: 'İptal', style: 'cancel' },
          {
            text: 'Bağlantıyı Kes',
            style: 'destructive',
            onPress: () => setWalletConnected(false),
          },
        ]
      );
    } else {
      setShowQRModal(true);
    }
  };

  const handleWalletConnect = async () => {
    setShowQRModal(false);
    
    try {
      // Gerçek mock wallet servisini kullan
      const result = await walletService.connectMetaMask();
      
      setWalletConnected(true);
      
      // AsyncStorage'a kaydet
      await AsyncStorage.setItem('walletConnected', 'true');
      await AsyncStorage.setItem('walletAddress', result.address || '');
      
      Alert.alert(
        'Cüzdan Bağlandı! 🎉',
        `Adres: ${result.address?.substring(0, 10)}...${result.address?.substring(38)}\n` +
        `Bakiye: ${result.balance} ETH\n` +
        `Ağ: ${result.network}\n\n` +
        `🎁 %15 kripto indirimi aktif!\n` +
        `🔗 Blockchain işlemleri hazır!`
      );
    } catch (error) {
      Alert.alert('Bağlantı Hatası', 'Cüzdan bağlanamadı');
    }
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
                  {USER_DATA.walletAddress.substring(0, 10)}...{USER_DATA.walletAddress.substring(38)}
                </Text>
              </>
            )}
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
                description={`${USER_DATA.totalNFTs} ağaç NFT'si`}
                left={(props) => <List.Icon {...props} icon="nfc" color="#2D6A4F" />}
                onPress={() => router.push('/nft-collection')}
                style={styles.listItem}
                titleStyle={styles.listItemTitle}
              />
              <List.Item
                title="Blockchain İşlemleri"
                description={`${USER_DATA.blockchainTransactions} işlem`}
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
            onPress={() => router.push('/payment-methods')}
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

      {/* QR Code Modal */}
      <Modal
        visible={showQRModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowQRModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Surface style={styles.qrModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>WalletConnect QR Kodu</Text>
              <IconButton
                icon="close"
                size={24}
                onPress={() => setShowQRModal(false)}
              />
            </View>
            <View style={styles.qrContainer}>
              <View style={styles.qrCode}>
                <Text style={styles.qrText}>QR Code</Text>
                <Text style={styles.qrSubtext}>WalletConnect</Text>
              </View>
              <Text style={styles.qrInstructions}>
                Mobil cüzdanınızla bu QR kodu tarayın
              </Text>
              <Button
                mode="contained"
                onPress={handleWalletConnect}
                style={styles.connectButton}
              >
                Bağlantıyı Simüle Et
              </Button>
            </View>
          </Surface>
        </View>
      </Modal>
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 0,
  },
  qrModalContent: {
    width: width * 0.8,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B4332',
  },
  modalScroll: {
    padding: 16,
  },
  // QR Code Styles
  qrContainer: {
    padding: 30,
    alignItems: 'center',
  },
  qrCode: {
    width: 200,
    height: 200,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  qrText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  qrSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  qrInstructions: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  connectButton: {
    backgroundColor: '#2D6A4F',
    borderRadius: 8,
  },
  // NFT Styles
  nftCard: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  nftImage: {
    width: 80,
    height: 80,
  },
  nftInfo: {
    flex: 1,
    padding: 12,
  },
  nftName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B4332',
    marginBottom: 4,
  },
  nftTokenId: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  rarityChip: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  rarityText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  nftAttributes: {
    gap: 2,
  },
  attributeText: {
    fontSize: 12,
    color: '#666',
  },
  // Transaction Styles
  txCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
  },
  txHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  txType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1B4332',
  },
  txStatus: {
    backgroundColor: '#E8F5E9',
  },
  txStatusText: {
    color: '#2D6A4F',
    fontSize: 10,
    fontWeight: 'bold',
  },
  txDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  txAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D6A4F',
    marginBottom: 4,
  },
  txDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  txHash: {
    fontSize: 11,
    color: '#666',
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  txGas: {
    fontSize: 11,
    color: '#999',
    fontFamily: 'monospace',
  },
}); 