import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Alert } from 'react-native';
import { Text, Surface, Card, Button, ProgressBar, IconButton, Avatar, Chip } from 'react-native-paper';
import { router } from 'expo-router';

// Mock servisleri import et
import { ahmetBLEService } from '../lib/ahmet-integration';
import { blockchainService } from '../lib/blockchain';
import { ipfsService } from '../lib/ipfs';

const { width } = Dimensions.get('window');

// Örnek kullanıcı verileri
const USER_DATA = {
  name: 'Mehmet',
};

// Kiralanan ağaçlar
const RENTED_TREES = [
  {
    id: '1',
    name: 'Zeytin Ağacı',
    location: 'Ayvalık, Balıkesir',
    farmer: 'Ahmet Çiftçi',
    farmerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    image: 'https://images.unsplash.com/photo-1445264718234-a623be589d37',
    health: 95,
    nextHarvest: '15 Ekim 2024',
    lastHarvest: '320 kg',
    rentalDate: '01.01.2024',
  },
  {
    id: '2',
    name: 'Portakal Ağacı',
    location: 'Finike, Antalya',
    farmer: 'Mehmet Yılmaz',
    farmerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
    image: 'https://images.unsplash.com/photo-1590086783191-a0694c7d1e6e',
    health: 92,
    nextHarvest: '1 Aralık 2024',
    lastHarvest: '280 kg',
    rentalDate: '15.01.2024',
  },
];

// Öne çıkan ağaçlar ve bahçeler
const FEATURED_ITEMS = [
  {
    id: '3',
    name: 'Mandalina Ağacı',
    location: 'Bodrum, Muğla',
    price: '950₺',
    image: 'https://images.unsplash.com/photo-1587411768638-ec71f8e33b78',
    rating: 4.8,
    category: 'Meyve Ağacı',
    harvestTime: 'Kasım - Şubat',
    type: 'tree',
  },
  {
    id: '4',
    name: 'Fındık Ağacı',
    location: 'Giresun',
    price: '800₺',
    image: 'https://images.unsplash.com/photo-1509983165097-0c31a863e3f3',
    rating: 4.5,
    category: 'Kuruyemiş',
    harvestTime: 'Ağustos - Eylül',
    type: 'tree',
  },
  {
    id: '5',
    name: 'Ege Bahçesi',
    location: 'İzmir, Urla',
    price: '2500₺',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae',
    rating: 4.9,
    category: 'Zeytin Bahçesi',
    size: '2 Dönüm',
    type: 'garden',
  },
];

const RENTAL_OPTIONS = [
  {
    id: '1',
    title: 'Ağaç Kirala',
    description: 'Kendi ağacınızı seçin',
    icon: 'tree',
    route: '/explore',
  },
  {
    id: '2',
    title: 'Bahçe Kirala',
    description: 'Özel bahçenizi oluşturun',
    icon: 'flower',
    route: '/gardens',
  },
];

export default function HomeScreen() {
  const [scanningRFID, setScanningRFID] = useState(false);

  // RFID Okuma Fonksiyonu
  const handleScanRFID = async () => {
    try {
      setScanningRFID(true);
      
      // Ahmet'in RFID cihazından veri al
      const rfidData = await ahmetBLEService.readRFIDData();
      
      if (rfidData) {
        Alert.alert(
          'RFID Okundu! 📱',
          `RFID: ${rfidData.rfid}\n` +
          `Cihaz ID: ${rfidData.deviceId}\n` +
          `Zaman: ${new Date(rfidData.timestamp).toLocaleString()}\n\n` +
          `Bu RFID ile ne yapmak istiyorsunuz?`,
          [
            { text: 'İptal', style: 'cancel' },
            { 
              text: 'Ağaç Bilgilerini Gör', 
              onPress: () => handleSearchTree(rfidData.rfid)
            },
            { 
              text: 'Yeni Ağaç Kaydet', 
              onPress: () => handleRegisterTree(rfidData)
            }
          ]
        );
      }
    } catch (error) {
      Alert.alert('RFID Okuma Hatası', 'RFID okunamadı, tekrar deneyin');
    } finally {
      setScanningRFID(false);
    }
  };

  // Ağaç Arama
  const handleSearchTree = async (rfid: string) => {
    try {
      const cid = await blockchainService.getCIDByRFID(rfid);
      
      if (cid) {
        const treeData = await ipfsService.fetchFromIPFS(cid);
        if (treeData) {
          Alert.alert(
            'Ağaç Bulundu! 🌳',
            `İsim: ${treeData.name}\n` +
            `Konum: ${treeData.location.address}\n` +
            `Tür: ${treeData.treeInfo.type}\n` +
            `Yaş: ${treeData.treeInfo.age} yıl\n` +
            `Sağlık: %${treeData.health.score}\n` +
            `Çiftçi: ${treeData.farmer.name}`
          );
        } else {
          Alert.alert('Hata', 'Ağaç verileri okunamadı');
        }
      } else {
        Alert.alert('Ağaç Bulunamadı', 'Bu RFID kayıtlı değil');
      }
    } catch (error) {
      Alert.alert('Arama Hatası', 'Ağaç aranırken hata oluştu');
    }
  };

  // Hızlı Ağaç Kaydı
  const handleRegisterTree = async (rfidData: any) => {
    Alert.alert(
      'Hızlı Kayıt',
      'Ağaç bilgilerini girin:',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Detaylı Kayıt', 
          onPress: () => {
            // Mock kayıt işlemi
            Alert.alert(
              'Ağaç Kaydediliyor...',
              'IPFS ve Blockchain entegrasyonu başlatıldı',
              [
                { 
                  text: 'Tamam', 
                  onPress: () => Alert.alert('Başarılı!', 'Ağaç kaydedildi 🌳')
                }
              ]
            );
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Hoşgeldin Kartı */}
      <Surface style={styles.welcomeCard}>
        <View style={styles.welcomeHeader}>
          <View style={styles.welcomeTextContainer}>
            <Text style={styles.userName}>Merhaba, {USER_DATA.name}</Text>
            <Text style={styles.welcomeSubtext}>Sürdürülebilir tarımın bir parçası olun</Text>
          </View>
          <IconButton
            icon="tree"
            size={32}
            iconColor="#fff"
            style={styles.welcomeIcon}
          />
        </View>
      </Surface>

      {/* RFID Okuma Butonu */}
      <Surface style={styles.rfidSection}>
        <View style={styles.rfidHeader}>
          <Text style={styles.rfidTitle}>📱 RFID Okuyucu</Text>
          <Text style={styles.rfidSubtitle}>Ağaç etiketini okut, bilgileri gör</Text>
        </View>
        <Button
          mode="contained"
          onPress={handleScanRFID}
          loading={scanningRFID}
          icon="nfc"
          style={styles.rfidButton}
          contentStyle={styles.rfidButtonContent}
          labelStyle={styles.rfidButtonLabel}
        >
          {scanningRFID ? 'RFID Okunuyor...' : 'RFID Okut'}
        </Button>
      </Surface>

      {/* Kiralama Seçenekleri */}
      <View style={styles.rentalOptionsGrid}>
        {RENTAL_OPTIONS.map(option => (
          <Card
            key={option.id}
            style={styles.rentalOptionCard}
            onPress={() => router.push(option.route as any)}
          >
            <Card.Content style={styles.rentalOptionContent}>
              <IconButton
                icon={option.icon}
                size={32}
                iconColor="#fff"
                style={styles.rentalOptionIcon}
              />
              <Text style={styles.rentalOptionTitle}>{option.title}</Text>
              <Text style={styles.rentalOptionDescription}>{option.description}</Text>
            </Card.Content>
          </Card>
        ))}
      </View>

      {/* Kiralanan ve Öne Çıkan İçerikler */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kiralanan Ağaçlarım</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.cardsScroll}
        >
          {RENTED_TREES.map(tree => (
            <Card
              key={tree.id}
              style={styles.treeCard}
              onPress={() => router.push({
                pathname: '/tree/[id]' as const,
                params: { id: tree.id }
              })}
            >
              <Card.Cover source={{ uri: tree.image }} style={styles.treeImage} />
              <Card.Content style={styles.treeContent}>
                <View style={styles.treeHeader}>
                  <Text style={styles.treeName}>{tree.name}</Text>
                  <Text style={styles.treeLocation}>{tree.location}</Text>
                </View>
                
                <View style={styles.treeStats}>
                  <View style={styles.healthBar}>
                    <Text style={styles.healthLabel}>Sağlık</Text>
                    <ProgressBar 
                      progress={tree.health / 100} 
                      color="#2E7D32"
                      style={styles.progressBar}
                    />
                    <Text style={styles.healthText}>%{tree.health}</Text>
                  </View>

                  <View style={styles.harvestInfo}>
                    <Text style={styles.harvestLabel}>Sonraki Hasat</Text>
                    <Text style={styles.harvestValue}>{tree.nextHarvest}</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Öne Çıkanlar</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.cardsScroll}
        >
          {FEATURED_ITEMS.map(item => (
            <Card
              key={item.id}
              style={styles.featuredCard}
              onPress={() => router.push({
                pathname: item.type === 'tree' ? '/tree/[id]' : '/garden/[id]' as const,
                params: { id: item.id }
              })}
            >
              <Card.Cover source={{ uri: item.image }} style={styles.featuredImage} />
              <View style={styles.featuredOverlay}>
                <View style={styles.featuredCategory}>
                  <Text style={styles.featuredCategoryText}>{item.category}</Text>
                </View>
              </View>
              <Card.Content style={styles.featuredContent}>
                <Text style={styles.featuredName}>{item.name}</Text>
                <Text style={styles.featuredLocation}>{item.location}</Text>
                <View style={styles.featuredFooter}>
                  <View style={styles.ratingContainer}>
                    <IconButton icon="star" size={16} iconColor="#FFD700" />
                    <Text style={styles.rating}>{item.rating}</Text>
                  </View>
                  <Text style={styles.featuredPrice}>{item.price}/yıl</Text>
                </View>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFCFA',
  },
  welcomeCard: {
    backgroundColor: '#2E7D32',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeTextContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  welcomeSubtext: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  welcomeIcon: {
    margin: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  rentalOptionsGrid: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  rentalOptionCard: {
    flex: 1,
    backgroundColor: '#2E7D32',
    borderRadius: 16,
  },
  rentalOptionContent: {
    alignItems: 'center',
    padding: 16,
  },
  rentalOptionIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    margin: 0,
    marginBottom: 12,
  },
  rentalOptionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
    textAlign: 'center',
  },
  rentalOptionDescription: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  cardsScroll: {
    marginLeft: -16,
    paddingLeft: 16,
    paddingBottom: 8,
  },
  treeCard: {
    width: width * 0.75,
    marginRight: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
    elevation: 4,
  },
  treeImage: {
    height: 160,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  treeContent: {
    padding: 16,
  },
  treeHeader: {
    marginBottom: 16,
  },
  treeName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  treeLocation: {
    fontSize: 14,
    color: '#666',
  },
  treeStats: {
    gap: 12,
  },
  healthBar: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 12,
  },
  healthLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  healthText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 8,
  },
  harvestInfo: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 12,
  },
  harvestLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  harvestValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  featuredCard: {
    width: width * 0.7,
    marginRight: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
    elevation: 4,
  },
  featuredImage: {
    height: 180,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  featuredOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  featuredCategory: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  featuredCategoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2E7D32',
  },
  featuredContent: {
    padding: 16,
  },
  featuredName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  featuredLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  featuredFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingRight: 12,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  featuredPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
  },
  // RFID Section Styles
  rfidSection: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#E8F5E9',
    elevation: 2,
  },
  rfidHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  rfidTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B4332',
    marginBottom: 4,
  },
  rfidSubtitle: {
    fontSize: 14,
    color: '#2E7D32',
    textAlign: 'center',
  },
  rfidButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 12,
  },
  rfidButtonContent: {
    height: 48,
  },
  rfidButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
