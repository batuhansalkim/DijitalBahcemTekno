import React from 'react';
import { View, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { Text, Surface, Button, Divider, IconButton, ProgressBar, Chip } from 'react-native-paper';
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

export default function TreeDetailScreen() {
  const { id } = useLocalSearchParams();
  const windowWidth = Dimensions.get('window').width;

  return (
    <ScrollView style={styles.container}>
      {/* Fotoğraf Galerisi */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.gallery}
      >
        {TREE_DETAIL.images.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image }}
            style={[styles.galleryImage, { width: windowWidth }]}
          />
        ))}
      </ScrollView>

      {/* Temel Bilgiler */}
      <Surface style={styles.infoContainer} elevation={2}>
        <View style={styles.header}>
          <View>
            <Text style={styles.name}>{TREE_DETAIL.name}</Text>
            <Text style={styles.location}>{TREE_DETAIL.location}</Text>
          </View>
          <View style={styles.scoreContainer}>
            <IconButton icon="star" size={20} iconColor="#FFD700" />
            <Text style={styles.score}>{TREE_DETAIL.score}</Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Çiftçi Bilgileri */}
        <View style={styles.farmerContainer}>
          <View style={styles.farmerInfo}>
            <Image
              source={{ uri: TREE_DETAIL.farmer.avatar }}
              style={styles.farmerAvatar}
            />
            <View>
              <Text style={styles.farmerName}>{TREE_DETAIL.farmer.name}</Text>
              <Text style={styles.farmerExperience}>
                {TREE_DETAIL.farmer.experience} yıl deneyim
              </Text>
            </View>
          </View>
          <Button
            mode="outlined"
            icon="message"
            onPress={() => router.push({
              pathname: '/chat/[id]',
              params: { id: TREE_DETAIL.farmer.id }
            })}
          >
            Mesaj Gönder
          </Button>
        </View>
      </Surface>

      {/* Ağaç Detayları */}
      <Surface style={styles.detailsContainer} elevation={2}>
        <Text style={styles.sectionTitle}>Ağaç Bilgileri</Text>
        
        <View style={styles.healthContainer}>
          <View style={styles.healthHeader}>
            <Text style={styles.healthTitle}>Ağaç Sağlığı</Text>
            <Text style={styles.healthScore}>{TREE_DETAIL.details.health * 100}%</Text>
          </View>
          <ProgressBar
            progress={TREE_DETAIL.details.health}
            color="#2E7D32"
            style={styles.healthBar}
          />
        </View>

        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="tree" size={24} color="#2E7D32" />
            <Text style={styles.detailLabel}>Yaş</Text>
            <Text style={styles.detailValue}>{TREE_DETAIL.age} yıl</Text>
          </View>
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

      {/* Hasat Bilgileri */}
      <Surface style={styles.harvestContainer} elevation={2}>
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

        <Text style={styles.nextHarvestDate}>
          Sonraki Hasat: {TREE_DETAIL.harvest.nextDate}
        </Text>

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

      {/* Kiralama Butonu */}
      <Surface style={styles.rentContainer} elevation={2}>
        <View style={styles.rentInfo}>
          <Text style={styles.rentLabel}>Yıllık Kiralama Bedeli</Text>
          <Text style={styles.rentPrice}>{TREE_DETAIL.price} ₺</Text>
        </View>
        <Button
          mode="contained"
          icon="handshake"
          onPress={() => router.push({
            pathname: '/tree/[id]/rent',
            params: { id: TREE_DETAIL.id }
          })}
          style={styles.rentButton}
          contentStyle={styles.rentButtonContent}
        >
          Hemen Kirala
        </Button>
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  gallery: {
    height: 300,
  },
  galleryImage: {
    height: 300,
    resizeMode: 'cover',
  },
  infoContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9C4',
    borderRadius: 16,
    padding: 4,
  },
  score: {
    fontWeight: 'bold',
    marginRight: 8,
  },
  divider: {
    marginVertical: 16,
  },
  farmerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  farmerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  farmerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  farmerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  farmerExperience: {
    fontSize: 14,
    color: '#666',
  },
  detailsContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  healthContainer: {
    marginBottom: 16,
  },
  healthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  healthTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  healthScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  healthBar: {
    height: 8,
    borderRadius: 4,
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
  harvestContainer: {
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
  rentContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  rentInfo: {
    marginBottom: 16,
  },
  rentLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  rentPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  rentButton: {
    backgroundColor: '#2E7D32',
  },
  rentButtonContent: {
    height: 48,
  },
}); 