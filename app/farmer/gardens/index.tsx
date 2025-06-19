import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Surface, FAB, Card, Button, Chip, Searchbar } from 'react-native-paper';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';

// Örnek bahçe verileri
const GARDENS_DATA = [
  {
    id: '1',
    name: 'Zeytinlik Bahçesi',
    location: 'Ayvalık, Balıkesir',
    area: '5.000 m²',
    treeCount: 150,
    treeTypes: ['Zeytin'],
    features: ['Damla Sulama', 'Organik Tarım'],
    coordinates: {
      latitude: 39.3191,
      longitude: 26.6928,
    },
    description: 'Ayvalık\'ın verimli topraklarında, organik tarım ilkeleriyle yönetilen zeytinlik.',
    certificates: ['Organik Tarım', 'İyi Tarım'],
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop',
    rentedTrees: 120,
    availableTrees: 30,
    totalIncome: '45.000',
  },
  {
    id: '2',
    name: 'Karışık Meyve Bahçesi',
    location: 'Finike, Antalya',
    area: '7.500 m²',
    treeCount: 200,
    treeTypes: ['Portakal', 'Elma', 'Armut'],
    features: ['Yağmurlama Sistemi'],
    coordinates: {
      latitude: 36.3017,
      longitude: 30.1453,
    },
    description: 'Finike\'nin bereketli topraklarında portakal, elma ve armut üretimi.',
    certificates: ['İyi Tarım'],
    imageUrl: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=600&h=400&fit=crop',
    rentedTrees: 180,
    availableTrees: 20,
    totalIncome: '72.000',
  },
  {
    id: '3',
    name: 'Fındık Bahçesi',
    location: 'Giresun Merkez',
    area: '10.000 m²',
    treeCount: 300,
    treeTypes: ['Fındık'],
    features: ['Organik Tarım'],
    coordinates: {
      latitude: 40.9128,
      longitude: 38.3895,
    },
    description: 'Karadeniz\'in eşsiz doğasında, organik fındık üretimi yapılan bahçe.',
    certificates: [],
    imageUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&h=400&fit=crop',
    rentedTrees: 250,
    availableTrees: 50,
    totalIncome: '85.000',
  },
];

export default function GardenListScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGardens = GARDENS_DATA.filter((garden) =>
    garden.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    garden.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Surface style={styles.header} elevation={4}>
        <View style={[styles.headerContent, { flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 32 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text variant="headlineMedium" style={[styles.title, { color: '#fff', fontSize: 24, textAlign: 'center', marginRight: 8 }]}>Bahçelerim</Text>
            <MaterialCommunityIcons name="flower" size={28} color="#fff" />
          </View>
          <Text variant="bodyLarge" style={[styles.subtitle, { color: '#fff', fontWeight: 'bold', textAlign: 'center', marginTop: 4 }]}>{GARDENS_DATA.length} bahçe</Text>
        </View>
      </Surface>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Bahçe ara..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={[styles.searchbar, { borderColor: '#000', borderWidth: 1 }]}
          inputStyle={{ color: '#000' }}
          placeholderTextColor="#000"
        />
      </View>

      <ScrollView style={styles.gardenList} contentContainerStyle={{ paddingBottom: 32 }}>
        {filteredGardens.map((garden) => (
          <Surface key={garden.id} style={styles.card} elevation={3}>
            <Image source={{ uri: garden.imageUrl }} style={styles.cardImage} resizeMode="cover" />
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text variant="titleLarge" style={{ color: '#1B4332', fontWeight: 'bold', fontSize: 20 }}>{garden.name}</Text>
                <Text variant="bodyMedium" style={styles.location}>{garden.location}</Text>
              </View>
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Alan</Text>
                  <Text style={styles.statValue}>{garden.area}</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Ağaç</Text>
                  <Text style={styles.statValue}>{garden.treeCount}</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Kiralanan</Text>
                  <Text style={styles.statValue}>{garden.rentedTrees}</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Boş</Text>
                  <Text style={styles.statValue}>{garden.availableTrees}</Text>
                </View>
              </View>
              <View style={styles.treeTypes}>
                {garden.treeTypes.map((type, index) => (
                  <Chip key={index} style={styles.chip} textStyle={{ color: '#000' }}>{type}</Chip>
                ))}
              </View>
              <View style={styles.features}>
                {garden.features.map((feature, index) => (
                  <Chip key={index} style={styles.featureChip} textStyle={{ color: '#000', fontSize: 12 }}>{feature}</Chip>
                ))}
              </View>
              <View style={styles.incomeBox}>
                <Text style={styles.incomeLabel}>Toplam Gelir</Text>
                <Text style={styles.incomeValue}>{garden.totalIncome} ₺</Text>
              </View>
              <Text style={styles.gardenDescription}>{garden.description}</Text>
              <View style={styles.coordRow}>
                <MaterialCommunityIcons name="map-marker" size={18} color="#2E7D32" />
                <Text style={styles.coordText}>{garden.coordinates.latitude}, {garden.coordinates.longitude}</Text>
              </View>
              <MapView
                style={styles.miniMap}
                initialRegion={{
                  latitude: garden.coordinates.latitude,
                  longitude: garden.coordinates.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
                pitchEnabled={false}
                rotateEnabled={false}
                pointerEvents="none"
              >
                <Marker
                  coordinate={{
                    latitude: garden.coordinates.latitude,
                    longitude: garden.coordinates.longitude,
                  }}
                  pinColor="#2E7D32"
                />
              </MapView>
              <View style={styles.cardFooter}>
                <View style={[styles.actions, { justifyContent: 'center', flex: 1 }]}>
                  <Button
                    mode="outlined"
                    onPress={() => router.push(`/farmer/gardens/${garden.id}` as any)}
                    style={styles.actionButton}
                    textColor="#2E7D32"
                  >
                    Detaylar
                  </Button>
                  <Button
                    mode="contained"
                    onPress={() => router.push(`/farmer/gardens/edit/${garden.id}` as any)}
                    style={styles.actionButton}
                    buttonColor="#2E7D32"
                    textColor="#fff"
                  >
                    Düzenle
                  </Button>
                </View>
              </View>
            </View>
          </Surface>
        ))}
      </ScrollView>

      <FAB
        icon="plus"
        label="Yeni Bahçe"
        style={styles.fab}
        onPress={() => router.push('/farmer/gardens/add')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#2E7D32',
    marginBottom: 8,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingBottom: 16,
  },
  headerContent: {
    padding: 16,
  },
  title: {
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#666',
  },
  searchContainer: {
    padding: 16,
    paddingTop: 8,
  },
  searchbar: {
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1,
  },
  gardenList: {
    padding: 16,
  },
  card: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImage: {
    height: 180,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  cardContent: {
    padding: 20,
  },
  cardHeader: {
    marginBottom: 16,
  },
  location: {
    color: '#666',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B4332',
  },
  treeTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    backgroundColor: '#E8F5E9',
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  featureChip: {
    backgroundColor: '#F5F5F5',
  },
  featureText: {
    fontSize: 12,
  },
  incomeBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  incomeLabel: {
    fontSize: 13,
    color: '#2E7D32',
  },
  incomeValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    minWidth: 100,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#2E7D32',
  },
  gardenDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    marginTop: 4,
  },
  coordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  coordText: {
    fontSize: 13,
    color: '#2E7D32',
    marginLeft: 4,
  },
  certRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  certChip: {
    backgroundColor: '#2E7D32',
    height: 28,
    borderRadius: 8,
  },
  miniMap: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 8,
    marginTop: 4,
  },
}); 