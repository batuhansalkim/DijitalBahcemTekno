import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, Surface, IconButton, Button, Card, Chip, SegmentedButtons } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';

// Örnek bahçe verisi
const GARDEN_DATA = {
  id: '1',
  name: 'Ayvalık Zeytinliği',
  location: 'Ayvalık, Balıkesir',
  coordinates: {
    latitude: 39.309196,
    longitude: 26.685394,
  },
  area: '25 dönüm',
  treeCount: 150,
  treeTypes: ['Zeytin'],
  images: [
    'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578',
    'https://images.unsplash.com/photo-1578594641333-4a65c7e3d4e7',
  ],
  description: 'Ayvalık\'ın verimli topraklarında yer alan zeytinliğimiz, organik tarım ilkeleriyle işletilmektedir. Modern sulama sistemleri ve düzenli bakım ile ağaçlarımız en iyi şekilde yetiştirilmektedir.',
  features: [
    'Damla Sulama Sistemi',
    'Organik Tarım',
    'RFID Takip',
    'Düzenli İlaçlama',
  ],
  trees: [
    {
      id: '1',
      type: 'Zeytin',
      age: 25,
      status: 'Kiralanabilir',
      health: 95,
      lastHarvest: '350 kg',
      price: '1.200₺',
    },
    {
      id: '2',
      type: 'Zeytin',
      age: 30,
      status: 'Kiralandı',
      health: 92,
      lastHarvest: '380 kg',
      price: '1.300₺',
    },
    {
      id: '3',
      type: 'Zeytin',
      age: 20,
      status: 'Kiralanabilir',
      health: 98,
      lastHarvest: '320 kg',
      price: '1.100₺',
    },
  ],
  farmer: {
    id: '1',
    name: 'Ahmet Çiftçi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    experience: '15 yıl',
  },
};

export default function GardenDetailScreen() {
  const { id } = useLocalSearchParams();
  const [viewMode, setViewMode] = useState('all'); // 'all' | 'available' | 'rented'

  const filteredTrees = GARDEN_DATA.trees.filter(tree => {
    if (viewMode === 'available') return tree.status === 'Kiralanabilir';
    if (viewMode === 'rented') return tree.status === 'Kiralandı';
    return true;
  });

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Surface style={styles.header} elevation={2}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => router.back()}
        />
        <Text style={styles.headerTitle}>Bahçe Detayı</Text>
      </Surface>

      {/* Harita */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: GARDEN_DATA.coordinates.latitude,
            longitude: GARDEN_DATA.coordinates.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={GARDEN_DATA.coordinates}
            title={GARDEN_DATA.name}
            description={GARDEN_DATA.location}
          />
        </MapView>
      </View>

      {/* Bahçe Bilgileri */}
      <Surface style={styles.infoCard} elevation={1}>
        <Text style={styles.gardenName}>{GARDEN_DATA.name}</Text>
        <Text style={styles.location}>{GARDEN_DATA.location}</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <IconButton icon="tree" size={24} iconColor="#2E7D32" />
            <Text style={styles.statValue}>{GARDEN_DATA.treeCount}</Text>
            <Text style={styles.statLabel}>Ağaç</Text>
          </View>
          <View style={styles.statItem}>
            <IconButton icon="ruler" size={24} iconColor="#2E7D32" />
            <Text style={styles.statValue}>{GARDEN_DATA.area}</Text>
            <Text style={styles.statLabel}>Alan</Text>
          </View>
        </View>

        <Text style={styles.description}>{GARDEN_DATA.description}</Text>

        <Text style={styles.sectionTitle}>Özellikler</Text>
        <View style={styles.featuresContainer}>
          {GARDEN_DATA.features.map((feature, index) => (
            <Chip key={index} style={styles.featureChip} icon="check">
              {feature}
            </Chip>
          ))}
        </View>
      </Surface>

      {/* Çiftçi Bilgisi */}
      <Surface style={styles.farmerCard} elevation={1}>
        <Text style={styles.sectionTitle}>Bahçe Sahibi</Text>
        <Button
          mode="outlined"
          icon="account"
          onPress={() => router.push({
            pathname: '/farmer/[id]' as const,
            params: { id: GARDEN_DATA.farmer.id }
          })}
        >
          {GARDEN_DATA.farmer.name} ({GARDEN_DATA.farmer.experience})
        </Button>
      </Surface>

      {/* Ağaçlar */}
      <Surface style={styles.treesCard} elevation={1}>
        <Text style={styles.sectionTitle}>Ağaçlar</Text>
        
        <SegmentedButtons
          value={viewMode}
          onValueChange={setViewMode}
          buttons={[
            { value: 'all', label: 'Tümü' },
            { value: 'available', label: 'Kiralanabilir' },
            { value: 'rented', label: 'Kiralandı' },
          ]}
          style={styles.segmentedButtons}
        />

        {filteredTrees.map(tree => (
          <Card
            key={tree.id}
            style={styles.treeCard}
            onPress={() => router.push({
              pathname: '/tree/[id]' as const,
              params: { id: tree.id }
            })}
          >
            <Card.Content>
              <View style={styles.treeHeader}>
                <View>
                  <Text style={styles.treeType}>{tree.type}</Text>
                  <Text style={styles.treeAge}>{tree.age} yaşında</Text>
                </View>
                <Chip
                  style={[
                    styles.statusChip,
                    tree.status === 'Kiralanabilir' ? styles.availableChip : styles.rentedChip
                  ]}
                >
                  {tree.status}
                </Chip>
              </View>

              <View style={styles.treeDetails}>
                <View style={styles.treeDetail}>
                  <Text style={styles.detailLabel}>Sağlık</Text>
                  <Text style={styles.detailValue}>%{tree.health}</Text>
                </View>
                <View style={styles.treeDetail}>
                  <Text style={styles.detailLabel}>Son Hasat</Text>
                  <Text style={styles.detailValue}>{tree.lastHarvest}</Text>
                </View>
                <View style={styles.treeDetail}>
                  <Text style={styles.detailLabel}>Yıllık</Text>
                  <Text style={styles.detailValue}>{tree.price}</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        ))}
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  mapContainer: {
    height: 200,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  infoCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
  },
  gardenName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#444',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#E8F5E9',
  },
  farmerCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
  },
  treesCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  treeCard: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  treeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  treeType: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  treeAge: {
    fontSize: 14,
    color: '#666',
  },
  statusChip: {
    borderRadius: 16,
  },
  availableChip: {
    backgroundColor: '#E8F5E9',
  },
  rentedChip: {
    backgroundColor: '#FFE0B2',
  },
  treeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  treeDetail: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
}); 