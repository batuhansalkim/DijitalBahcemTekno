import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Surface, FAB, Card, Button, Chip, Searchbar } from 'react-native-paper';
import { router } from 'expo-router';

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
    lastUpdated: '2 saat önce',
    imageUrl: 'https://example.com/garden1.jpg',
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
    lastUpdated: '1 gün önce',
    imageUrl: 'https://example.com/garden2.jpg',
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
    lastUpdated: '3 gün önce',
    imageUrl: 'https://example.com/garden3.jpg',
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
      <Surface style={styles.header} elevation={2}>
        <View style={styles.headerContent}>
          <Text variant="headlineMedium" style={styles.title}>
            Bahçelerim
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            {GARDENS_DATA.length} bahçe
          </Text>
        </View>
      </Surface>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Bahçe ara..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>

      <ScrollView style={styles.gardenList}>
        {filteredGardens.map((garden) => (
          <Card
            key={garden.id}
            style={styles.card}
            onPress={() => router.push(`/garden/${garden.id}`)}
          >
            <Card.Cover source={{ uri: garden.imageUrl }} style={styles.cardImage} />
            <Card.Content style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text variant="titleLarge">{garden.name}</Text>
                <Text variant="bodyMedium" style={styles.location}>
                  {garden.location}
                </Text>
              </View>

              <View style={styles.stats}>
                <View style={styles.stat}>
                  <Text variant="labelMedium">Alan</Text>
                  <Text variant="titleMedium">{garden.area}</Text>
                </View>
                <View style={styles.stat}>
                  <Text variant="labelMedium">Toplam Ağaç</Text>
                  <Text variant="titleMedium">{garden.treeCount}</Text>
                </View>
                <View style={styles.stat}>
                  <Text variant="labelMedium">Kiralanan</Text>
                  <Text variant="titleMedium">{garden.rentedTrees}</Text>
                </View>
              </View>

              <View style={styles.treeTypes}>
                {garden.treeTypes.map((type, index) => (
                  <Chip key={index} style={styles.chip}>
                    {type}
                  </Chip>
                ))}
              </View>

              <View style={styles.features}>
                {garden.features.map((feature, index) => (
                  <Chip key={index} style={styles.featureChip} textStyle={styles.featureText}>
                    {feature}
                  </Chip>
                ))}
              </View>

              <View style={styles.income}>
                <Text variant="labelMedium">Toplam Gelir</Text>
                <Text variant="headlineSmall" style={styles.incomeText}>
                  {garden.totalIncome} ₺
                </Text>
              </View>

              <View style={styles.cardFooter}>
                <Text variant="bodySmall" style={styles.lastUpdated}>
                  Son güncelleme: {garden.lastUpdated}
                </Text>
                <View style={styles.actions}>
                  <Button
                    mode="outlined"
                    onPress={() => router.push(`/garden/${garden.id}`)}
                    style={styles.actionButton}
                  >
                    Detaylar
                  </Button>
                  <Button
                    mode="contained"
                    onPress={() => router.push(`/garden/${garden.id}/trees`)}
                    style={styles.actionButton}
                  >
                    Ağaçlar
                  </Button>
                </View>
              </View>
            </Card.Content>
          </Card>
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
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  gardenList: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardImage: {
    height: 200,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    marginBottom: 16,
  },
  location: {
    color: '#666',
    marginTop: 4,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
  },
  stat: {
    alignItems: 'center',
  },
  treeTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
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
  income: {
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  incomeText: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastUpdated: {
    color: '#666',
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
}); 