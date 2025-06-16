import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { Text, Surface, Button, Divider, IconButton, ProgressBar, Chip, Modal, Portal } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Örnek ağaç detay verisi
const TREE_DETAIL = {
  id: '1',
  name: 'Zeytin Ağacı',
  type: 'Zeytin',
  location: 'Ayvalık, Balıkesir',
  coordinates: {
    latitude: 39.309196,
    longitude: 26.685179,
  },
  age: 25,
  price: 1200,
  score: 4.8,
  images: [
    'https://images.unsplash.com/photo-1445264618000-f1e069c5920f',
    'https://images.unsplash.com/photo-1445264457307-01f96d17559c',
    'https://images.unsplash.com/photo-1445264390824-83c0c52e3818',
  ],
  farmer: {
    id: '1',
    name: 'Ahmet Çiftçi',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
    experience: 15,
    rating: 4.9,
  },
  details: {
    health: 0.95,
    soil: 'Kireçli Toprak',
    irrigation: 'Damla Sulama',
    lastMaintenance: '15.03.2024',
    nextMaintenance: '15.04.2024',
    organic: true,
  },
  harvest: {
    lastAmount: 85,
    averageAmount: 80,
    nextEstimate: 90,
    history: [
      { year: 2023, amount: 85, quality: 'A+' },
      { year: 2022, amount: 78, quality: 'A' },
      { year: 2021, amount: 82, quality: 'A' },
    ],
    nextDate: '01.11.2024',
  },
};

// Yeni renk paleti ve görseller
// Galeri görselleri
const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=800&q=80',
];
// Uydu görseli
const SATELLITE_IMAGE = 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80';
// Gelişim grafiği görseli
const GROWTH_IMAGE = 'https://www.highcharts.com/samples/graphics/spline-irregular-time.png';

export default function TreeDetailScreen() {
  const { id } = useLocalSearchParams();
  const windowWidth = Dimensions.get('window').width;
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <ScrollView style={styles.container}>
      {/* 1. Şık başlık ve ikon */}
      <View style={styles.titleCard}>
        <MaterialCommunityIcons
          name={TREE_DETAIL.type === 'Zeytin' ? 'food-outline' : TREE_DETAIL.type === 'Portakal' ? 'fruit-citrus' : 'leaf'}
          size={28}
          color={TREE_DETAIL.type === 'Portakal' ? '#FFA726' : '#43a047'}
          style={{ marginRight: 8 }}
        />
        <Text style={styles.treeNameCentered}>{TREE_DETAIL.name}</Text>
      </View>
      <View style={styles.titleUnderline} />

      {/* 2. Galeri ve skor chip */}
      <View style={styles.galleryWrapper}>
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.gallery}>
          {GALLERY_IMAGES.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={styles.galleryImage}
            />
          ))}
        </ScrollView>
        <Chip style={styles.scoreChip} icon="star">
          {TREE_DETAIL.score}
        </Chip>
      </View>

      {/* Section başlıkları */}
      <View style={styles.sectionHeader}>
        <MaterialCommunityIcons name="tree" size={28} color="#1B4332" style={{ marginRight: 8 }} />
        <Text style={styles.sectionMainTitle}>Takip Bilgileri</Text>
      </View>

      {/* Uydu Görüntüsü */}
      <Surface style={styles.satelliteCard} elevation={4}>
        <Image
          source={{ uri: SATELLITE_IMAGE }}
          style={styles.satelliteImage}
        />
        <Text style={styles.sectionTitle}>Uydu Görüntüsü</Text>
      </Surface>

      <Surface style={styles.growthCard} elevation={4}>
        <Image
          source={{ uri: GROWTH_IMAGE }}
          style={styles.growthImage}
          resizeMode="contain"
        />
        <Text style={styles.sectionTitle}>Ağaç Gelişim Grafiği</Text>
      </Surface>

      {/* Blokzincir & Ürün Bilgisi Butonu */}
      <Button
        mode="contained"
        style={styles.blockchainButton}
        labelStyle={styles.blockchainButtonLabel}
        icon="cube"
        onPress={() => setModalVisible(true)}
      >
        Blokzincir & Ürün Bilgisi
      </Button>

      {/* Modal */}
      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <MaterialCommunityIcons name="cube" size={28} color="#2D6A4F" style={{ marginRight: 8 }} />
            <Text style={styles.modalTitle}>Blokzincir & Ürün Bilgisi</Text>
          </View>
          <Surface style={styles.blockchainCard} elevation={4}>
            <Text style={styles.sectionTitle}>Blokzincir Takip Bilgisi</Text>
            <Text style={styles.blockchainLabel}>NFT ID: #1234567890abcdef</Text>
            <Text style={styles.blockchainLabel}>Sahip: 0xA1B2...C3D4</Text>
            <Text style={styles.blockchainLabel}>Son İşlem: 2024-05-01 14:32</Text>
            <Text style={styles.blockchainLabel}>İşlem Hash: 0xF1E2...B3C4</Text>
          </Surface>
          <Surface style={styles.journeyCard} elevation={4}>
            <Text style={styles.sectionTitle}>Ürün Yolculuğu & QR Kod</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.journeyStep}>- Hasat Edildi</Text>
                <Text style={styles.journeyStep}>- İşlendi</Text>
                <Text style={styles.journeyStep}>- Paketlendi</Text>
                <Text style={styles.journeyStep}>- Sevk Edildi</Text>
                <Text style={styles.journeyStep}>- Teslim Edildi</Text>
              </View>
              <Image
                source={{ uri: 'https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=1234567890abcdef' }}
                style={styles.qrImage}
              />
            </View>
          </Surface>
          <Surface style={styles.processCard} elevation={4}>
            <Text style={styles.sectionTitle}>Ürün İşleme & Sevkiyat</Text>
            <Text style={styles.processLabel}>- İşleme Türü: Zeytinyağı</Text>
            <Text style={styles.processLabel}>- İşleme Tarihi: 2024-05-02</Text>
            <Text style={styles.processLabel}>- Sevkiyat Durumu: Yolda</Text>
            <Text style={styles.processLabel}>- Tahmini Teslim: 2024-05-10</Text>
          </Surface>
          <Button
            mode="contained"
            style={styles.closeModalButton}
            labelStyle={styles.closeModalButtonLabel}
            onPress={() => setModalVisible(false)}
          >
            Kapat
          </Button>
        </Modal>
      </Portal>

      {/* 3. Kısa Bilgiler */}
      <View style={styles.quickInfoRow}>
        <View style={styles.quickInfoItem}>
          <MaterialCommunityIcons name="map-marker" size={20} color="#2D6A4F" />
          <Text style={styles.quickInfoText}>{TREE_DETAIL.location}</Text>
        </View>
        <View style={styles.quickInfoItem}>
          <MaterialCommunityIcons name="tree" size={20} color="#2D6A4F" />
          <Text style={styles.quickInfoText}>{TREE_DETAIL.age} yaş</Text>
        </View>
        <View style={styles.quickInfoItem}>
          <MaterialCommunityIcons name="leaf" size={20} color="#2D6A4F" />
          <Text style={styles.quickInfoText}>{TREE_DETAIL.type}</Text>
        </View>
      </View>

      {/* 4. Çiftçi Bilgisi */}
      <Surface style={styles.farmerCard} elevation={2}>
        <View style={styles.farmerContainer}>
          <Image source={{ uri: TREE_DETAIL.farmer.avatar }} style={styles.farmerAvatar} />
          <View style={styles.farmerInfo}>
            <Text style={styles.farmerName}>{TREE_DETAIL.farmer.name}</Text>
            <Text style={styles.farmerExperience}>{TREE_DETAIL.farmer.experience} yıl deneyim</Text>
          </View>
          <Button
            mode="outlined"
            icon="message"
            onPress={() => router.push({ pathname: '/chat/[id]', params: { id: TREE_DETAIL.farmer.id } })}
            style={styles.farmerButton}
            labelStyle={styles.farmerButtonLabel}
          >
            Mesaj Gönder
          </Button>
        </View>
      </Surface>

      {/* 5. Ağaç Detayları */}
      <Surface style={styles.detailsCard} elevation={2}>
        <Text style={styles.sectionTitle}>Ağaç Bilgileri</Text>
        <View style={styles.healthContainer}>
          <Text style={styles.healthTitle}>Ağaç Sağlığı</Text>
          <ProgressBar progress={TREE_DETAIL.details.health} color="#2E7D32" style={styles.healthBar} />
          <Text style={styles.healthScore}>{TREE_DETAIL.details.health * 100}%</Text>
        </View>
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="water" size={24} color="#2E7D32" />
            <Text style={styles.detailLabel}>Sulama</Text>
            <Text style={styles.detailValue}>{TREE_DETAIL.details.irrigation}</Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="shovel" size={24} color="#2E7D32" />
            <Text style={styles.detailLabel}>Toprak</Text>
            <Text style={styles.detailValue}>{TREE_DETAIL.details.soil}</Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="leaf" size={24} color="#2E7D32" />
            <Text style={styles.detailLabel}>Organik</Text>
            <Text style={styles.detailValue}>{TREE_DETAIL.details.organic ? 'Evet' : 'Hayır'}</Text>
          </View>
        </View>
        <View style={styles.maintenanceInfo}>
          <Text style={styles.maintenanceLabel}>Son Bakım: </Text>
          <Text style={styles.maintenanceValue}>{TREE_DETAIL.details.lastMaintenance}</Text>
          <Text style={styles.maintenanceLabel}> | Gelecek Bakım: </Text>
          <Text style={styles.maintenanceValue}>{TREE_DETAIL.details.nextMaintenance}</Text>
        </View>
      </Surface>

      {/* 6. Hasat Bilgileri */}
      <Surface style={styles.harvestCard} elevation={2}>
        <Text style={styles.sectionTitle}>Hasat Bilgileri</Text>
        <View style={styles.harvestStats}>
          <View style={styles.harvestStat}>
            <Text style={styles.harvestStatLabel}>Son Hasat</Text>
            <Text style={styles.harvestStatValue}>{TREE_DETAIL.harvest.lastAmount} kg</Text>
          </View>
          <View style={styles.harvestStat}>
            <Text style={styles.harvestStatLabel}>Ortalama</Text>
            <Text style={styles.harvestStatValue}>{TREE_DETAIL.harvest.averageAmount} kg</Text>
          </View>
          <View style={styles.harvestStat}>
            <Text style={styles.harvestStatLabel}>Sonraki Tahmin</Text>
            <Text style={styles.harvestStatValue}>{TREE_DETAIL.harvest.nextEstimate} kg</Text>
          </View>
        </View>
        <Text style={styles.nextHarvestDate}>Sonraki Hasat: {TREE_DETAIL.harvest.nextDate}</Text>
        <Divider style={styles.divider} />
        <Text style={styles.historyTitle}>Hasat Geçmişi</Text>
        {TREE_DETAIL.harvest.history.map((record, index) => (
          <View key={index} style={styles.historyItem}>
            <Text style={styles.historyYear}>{record.year}</Text>
            <Text style={styles.historyAmount}>{record.amount} kg</Text>
            <Chip style={styles.qualityChip}>{record.quality}</Chip>
          </View>
        ))}
      </Surface>

      {/* 7. En altta sabit bar */}
      <View style={styles.bottomBar}>
        <Text style={styles.bottomBarPrice}>{TREE_DETAIL.price} ₺</Text>
        <Chip style={styles.scoreChip} icon="star">{TREE_DETAIL.score}</Chip>
        <Button
          mode="contained"
          style={styles.bottomBarButton}
          labelStyle={styles.bottomBarButtonLabel}
          icon="handshake"
          onPress={() => router.push({ pathname: '/tree/[id]/rent', params: { id: TREE_DETAIL.id } })}
        >
          Hemen Kirala
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F3',
  },
  titleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  treeNameCentered: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1B4332',
  },
  titleUnderline: {
    height: 2,
    backgroundColor: '#2E7D32',
    marginVertical: 8,
  },
  galleryWrapper: {
    position: 'relative',
    marginBottom: 20,
  },
  gallery: {
    height: 220,
  },
  galleryImage: {
    width: 320,
    height: 220,
    borderRadius: 18,
    marginRight: 12,
  },
  scoreChip: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#2D6A4F',
    color: '#FFF',
    fontWeight: 'bold',
  },
  quickInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  quickInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickInfoText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  farmerCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  farmerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  farmerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  farmerInfo: {
    flex: 1,
  },
  farmerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  farmerExperience: {
    fontSize: 14,
    color: '#666',
  },
  farmerButton: {
    backgroundColor: '#2E7D32',
  },
  farmerButtonLabel: {
    color: '#fff',
  },
  detailsCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B4332',
    marginBottom: 10,
  },
  healthContainer: {
    marginBottom: 16,
  },
  healthTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  healthBar: {
    height: 8,
    borderRadius: 4,
  },
  healthScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  detailItem: {
    width: '48%',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 2,
  },
  maintenanceInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    alignItems: 'center',
  },
  maintenanceLabel: {
    fontSize: 14,
    color: '#666',
  },
  maintenanceValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  harvestCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  harvestStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  harvestStat: {
    alignItems: 'center',
    flex: 1,
  },
  harvestStatLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  harvestStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  nextHarvestDate: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 16,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 12,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  historyYear: {
    fontSize: 16,
    fontWeight: '500',
  },
  historyAmount: {
    fontSize: 16,
  },
  qualityChip: {
    backgroundColor: '#E8F5E9',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  bottomBarPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  bottomBarButton: {
    backgroundColor: '#2E7D32',
  },
  bottomBarButtonLabel: {
    color: '#fff',
  },
  divider: {
    marginVertical: 16,
    height: 1,
    backgroundColor: '#E8F0E3',
  },
  satelliteCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  satelliteImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  growthCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  growthImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  blockchainCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  blockchainLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
  },
  journeyCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  qrImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  processCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  sectionMainTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1B4332',
    marginBottom: 12,
  },
  journeyStep: {
    fontSize: 16,
    color: '#40916C',
  },
  processLabel: {
    fontSize: 16,
    color: '#40916C',
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  blockchainButton: {
    backgroundColor: '#2D6A4F',
  },
  blockchainButtonLabel: {
    color: '#fff',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    padding: 24,
    borderRadius: 18,
    margin: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B4332',
  },
  closeModalButton: {
    backgroundColor: '#2D6A4F',
  },
  closeModalButtonLabel: {
    color: '#fff',
    fontWeight: 'bold',
  },
}); 