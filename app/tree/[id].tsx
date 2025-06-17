import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Dimensions, Modal } from 'react-native';
import { Text, Surface, Button, Divider, IconButton, ProgressBar, Chip } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';

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
  treeId: 'TR-AYV-001-39.309196-26.685179',
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
  const [showMap, setShowMap] = useState(false);

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
        <Button
          mode="contained"
          style={styles.blockchainButton}
          labelStyle={styles.blockchainButtonLabel}
          icon="cube"
          onPress={() => router.push({ pathname: '/tree/[id]/blockchain', params: { id: TREE_DETAIL.id } })}
        >
          Blokzincir
        </Button>
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

      {/* 3.5. Konum ve Ağaç ID Bilgileri */}
      <Surface style={styles.locationCard} elevation={2}>
        <View style={styles.locationHeader}>
          <MaterialCommunityIcons name="map-marker" size={28} color="#2D6A4F" />
          <Text style={styles.sectionTitle}>Konum Bilgileri</Text>
        </View>
        <View style={styles.locationGrid}>
          <View style={styles.locationItem}>
            <MaterialCommunityIcons name="qrcode" size={24} color="#2E7D32" />
            <Text style={styles.locationLabel}>Ağaç ID</Text>
            <Text style={styles.locationValue}>{TREE_DETAIL.treeId}</Text>
          </View>
          <View style={styles.locationItem}>
            <MaterialCommunityIcons name="crosshairs-gps" size={24} color="#2E7D32" />
            <Text style={styles.locationLabel}>Koordinatlar</Text>
            <Text style={styles.locationValue}>
              {TREE_DETAIL.coordinates.latitude.toFixed(6)}, {TREE_DETAIL.coordinates.longitude.toFixed(6)}
            </Text>
          </View>
        </View>
        <Button
          mode="outlined"
          icon="map"
          onPress={() => setShowMap(true)}
          style={styles.mapButton}
          labelStyle={styles.mapButtonLabel}
        >
          Haritada Göster
        </Button>
      </Surface>

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
          <View style={styles.maintenanceCard}>
            <View style={styles.maintenanceItem}>
              <MaterialCommunityIcons name="calendar-check" size={24} color="#2E7D32" />
              <View style={styles.maintenanceTextContainer}>
                <Text style={styles.maintenanceLabel}>Son Bakım</Text>
                <Text style={styles.maintenanceValue}>{TREE_DETAIL.details.lastMaintenance}</Text>
              </View>
            </View>
            <View style={styles.maintenanceDivider} />
            <View style={styles.maintenanceItem}>
              <MaterialCommunityIcons name="calendar-clock" size={24} color="#FF6B35" />
              <View style={styles.maintenanceTextContainer}>
                <Text style={styles.maintenanceLabel}>Gelecek Bakım</Text>
                <Text style={styles.maintenanceValue}>{TREE_DETAIL.details.nextMaintenance}</Text>
              </View>
            </View>
          </View>
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
            <Chip 
              style={[
                styles.qualityChip,
                record.quality === 'A+' ? styles.qualityChipAPlus : 
                record.quality === 'A' ? styles.qualityChipA :
                record.quality === 'B' ? styles.qualityChipB :
                styles.qualityChipC
              ]}
              textStyle={styles.qualityChipText}
            >
              {record.quality}
            </Chip>
          </View>
        ))}
      </Surface>

      {/* 7. Gelişim grafiği kartı */}
      <Surface style={styles.growthCard} elevation={4}>
        <View style={styles.growthHeader}>
          <MaterialCommunityIcons name="chart-line" size={28} color="#2D6A4F" />
          <Text style={styles.sectionTitle}>Ağaç Gelişim Takibi</Text>
        </View>
        
        {/* Gelişim İstatistikleri */}
        <View style={styles.growthStats}>
          <View style={styles.growthStat}>
            <Text style={styles.growthStatLabel}>Boy</Text>
            <Text style={styles.growthStatValue}>4.2m</Text>
            <Text style={styles.growthStatChange}>+0.3m</Text>
          </View>
          <View style={styles.growthStat}>
            <Text style={styles.growthStatLabel}>Çap</Text>
            <Text style={styles.growthStatValue}>45cm</Text>
            <Text style={styles.growthStatChange}>+2cm</Text>
          </View>
          <View style={styles.growthStat}>
            <Text style={styles.growthStatLabel}>Yaş</Text>
            <Text style={styles.growthStatValue}>25</Text>
            <Text style={styles.growthStatChange}>+1 yıl</Text>
          </View>
        </View>

        {/* Basit Grafik */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Son 12 Ay Gelişim</Text>
          <View style={styles.chart}>
            <View style={styles.chartBar}>
              <View style={[styles.bar, { height: 60 }]} />
              <Text style={styles.barLabel}>Oca</Text>
            </View>
            <View style={styles.chartBar}>
              <View style={[styles.bar, { height: 65 }]} />
              <Text style={styles.barLabel}>Şub</Text>
            </View>
            <View style={styles.chartBar}>
              <View style={[styles.bar, { height: 70 }]} />
              <Text style={styles.barLabel}>Mar</Text>
            </View>
            <View style={styles.chartBar}>
              <View style={[styles.bar, { height: 75 }]} />
              <Text style={styles.barLabel}>Nis</Text>
            </View>
            <View style={styles.chartBar}>
              <View style={[styles.bar, { height: 80 }]} />
              <Text style={styles.barLabel}>May</Text>
            </View>
            <View style={styles.chartBar}>
              <View style={[styles.bar, { height: 85 }]} />
              <Text style={styles.barLabel}>Haz</Text>
            </View>
            <View style={styles.chartBar}>
              <View style={[styles.bar, { height: 90 }]} />
              <Text style={styles.barLabel}>Tem</Text>
            </View>
            <View style={styles.chartBar}>
              <View style={[styles.bar, { height: 95 }]} />
              <Text style={styles.barLabel}>Ağu</Text>
            </View>
            <View style={styles.chartBar}>
              <View style={[styles.bar, { height: 100 }]} />
              <Text style={styles.barLabel}>Eyl</Text>
            </View>
            <View style={styles.chartBar}>
              <View style={[styles.bar, { height: 105 }]} />
              <Text style={styles.barLabel}>Eki</Text>
            </View>
            <View style={styles.chartBar}>
              <View style={[styles.bar, { height: 110 }]} />
              <Text style={styles.barLabel}>Kas</Text>
            </View>
            <View style={styles.chartBar}>
              <View style={[styles.bar, { height: 115, backgroundColor: '#2D6A4F' }]} />
              <Text style={styles.barLabel}>Ara</Text>
            </View>
          </View>
        </View>

        {/* Gelişim Notları */}
        <View style={styles.growthNotes}>
          <Text style={styles.growthNotesTitle}>Son Gelişim Notları</Text>
          <View style={styles.noteItem}>
            <MaterialCommunityIcons name="leaf" size={20} color="#2D6A4F" />
            <Text style={styles.noteText}>Yaprak gelişimi normal seviyede</Text>
          </View>
          <View style={styles.noteItem}>
            <MaterialCommunityIcons name="water" size={20} color="#2D6A4F" />
            <Text style={styles.noteText}>Sulama programı başarılı</Text>
          </View>
          <View style={styles.noteItem}>
            <MaterialCommunityIcons name="thermometer" size={20} color="#2D6A4F" />
            <Text style={styles.noteText}>Hava koşulları uygun</Text>
          </View>
        </View>

        <Button
          mode="contained"
          icon="chart-line"
          onPress={() => router.push({ pathname: '/tree/[id]/growth-details', params: { id: TREE_DETAIL.id } })}
          style={styles.growthDetailsButton}
          labelStyle={styles.growthDetailsButtonLabel}
        >
          Detaylı Gelişim Raporu
        </Button>
      </Surface>

      {/* 8. Kiralama Bölümü */}
      <Surface style={styles.rentalCard} elevation={4}>
        <View style={styles.rentalHeader}>
          <MaterialCommunityIcons name="handshake" size={32} color="#2D6A4F" />
          <Text style={styles.rentalTitle}>Ağaç Kiralama</Text>
        </View>
        <View style={styles.rentalInfo}>
          <View style={styles.priceSection}>
            <Text style={styles.priceLabel}>Yıllık Kiralama Fiyatı</Text>
            <Text style={styles.priceValue}>{TREE_DETAIL.price} ₺</Text>
            <Text style={styles.priceNote}>* Ürün işleme ücreti dahil değildir</Text>
          </View>
          <View style={styles.ratingSection}>
            <Text style={styles.ratingText}>Çiftçi Puanı</Text>
            <Chip style={styles.scoreChip} icon="star">
              {TREE_DETAIL.score}
            </Chip>
          </View>
        </View>
        <Button
          mode="contained"
          style={styles.rentButton}
          labelStyle={styles.rentButtonLabel}
          contentStyle={styles.rentButtonContent}
          icon="handshake"
          onPress={() => router.push({ pathname: '/tree/[id]/rent', params: { id: TREE_DETAIL.id } })}
        >
          Hemen Kirala
        </Button>
      </Surface>

      {showMap && (
        <Modal
          visible={showMap}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowMap(false)}
        >
          <View style={styles.mapModal}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: TREE_DETAIL.coordinates.latitude,
                longitude: TREE_DETAIL.coordinates.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker
                coordinate={{
                  latitude: TREE_DETAIL.coordinates.latitude,
                  longitude: TREE_DETAIL.coordinates.longitude,
                }}
                title={TREE_DETAIL.name}
                description={TREE_DETAIL.location}
              />
            </MapView>
            <Button
              mode="contained"
              style={styles.closeButton}
              labelStyle={styles.closeButtonLabel}
              onPress={() => setShowMap(false)}
            >
              Kapat
            </Button>
          </View>
        </Modal>
      )}
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
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E8F5E9',
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
    color:"black"
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
    color:"black"
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
    color:"black"
  },
  maintenanceInfo: {
    marginTop: 16,
    alignItems: 'center',
  },
  maintenanceCard: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  maintenanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  maintenanceTextContainer: {
    marginLeft: 12,
  },
  maintenanceLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  maintenanceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B4332',
    marginTop: 2,
  },
  maintenanceDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E8F5E9',
    marginHorizontal: 16,
  },
  qualityChip: {
    backgroundColor: '#E8F5E9',
  },
  qualityChipAPlus: {
    backgroundColor: '#4CAF50',
  },
  qualityChipA: {
    backgroundColor: '#8BC34A',
  },
  qualityChipB: {
    backgroundColor: '#FFC107',
  },
  qualityChipC: {
    backgroundColor: '#FF5722',
  },
  qualityChipText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
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
    color:"black"
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 12,
    color:"black"
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
    color:"black"
  },
  historyAmount: {
    fontSize: 16,
    color:"black"
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
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  growthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  growthStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    paddingVertical: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  growthStat: {
    alignItems: 'center',
  },
  growthStatLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  growthStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B4332',
  },
  growthStatChange: {
    fontSize: 12,
    color: '#2D6A4F',
    fontWeight: '500',
  },
  chartContainer: {
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B4332',
    marginBottom: 16,
    textAlign: 'center',
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    paddingHorizontal: 8,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 20,
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 12,
    color: '#666',
  },
  growthNotes: {
    marginBottom: 20,
  },
  growthNotesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B4332',
    marginBottom: 12,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
    paddingVertical: 4,
  },
  noteText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  growthDetailsButton: {
    backgroundColor: '#2D6A4F',
  },
  growthDetailsButtonLabel: {
    color: 'white',
    fontWeight: '600',
  },
  blockchainCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  blockchainButton: {
    backgroundColor: '#2D6A4F',
    height: 40,
    borderRadius: 20,
    elevation: 2,
  },
  blockchainButtonLabel: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  growthDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  rentButton: {
    backgroundColor: '#2D6A4F',
    height: 56,
  },
  rentButtonContent: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rentButtonLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  rentalCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#fff',
  },
  rentalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8F5E9',
  },
  rentalTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1B4332',
  },
  rentalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  priceSection: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D6A4F',
    marginBottom: 4,
  },
  priceNote: {
    fontSize: 12,
    color: '#999',
  },
  ratingSection: {
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  locationCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  locationGrid: {
    gap: 16,
    marginBottom: 20,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
  },
  locationLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
    marginRight: 8,
    fontWeight: '500',
  },
  locationValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D6A4F',
    flex: 1,
  },
  mapButton: {
    borderColor: '#2D6A4F',
  },
  mapButtonLabel: {
    color: '#2D6A4F',
    fontWeight: '600',
  },
  mapModal: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  map: {
    width: '100%',
    height: '50%',
  },
  closeButton: {
    backgroundColor: '#2D6A4F',
    height: 56,
  },
  closeButtonLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
}); 