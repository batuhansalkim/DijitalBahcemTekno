import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Surface, FAB, Card, Button, Chip, Searchbar, SegmentedButtons } from 'react-native-paper';
import { router } from 'expo-router';

// Örnek ağaç verileri
const TREES_DATA = [
  {
    id: '1',
    name: 'Zeytin Ağacı #123',
    type: 'Zeytin',
    age: 15,
    health: 95,
    status: 'available',
    garden: 'Zeytinlik Bahçesi',
    lastHarvest: '120 kg',
    nextHarvest: '2024 Kasım',
    rentalPrice: '2.500',
    imageUrl: 'https://example.com/tree1.jpg',
  },
  {
    id: '2',
    name: 'Portakal Ağacı #45',
    type: 'Portakal',
    age: 8,
    health: 88,
    status: 'rented',
    garden: 'Karışık Meyve Bahçesi',
    lastHarvest: '85 kg',
    nextHarvest: '2024 Mart',
    rentalPrice: '1.800',
    imageUrl: 'https://example.com/tree2.jpg',
  },
  {
    id: '3',
    name: 'Fındık Ağacı #78',
    type: 'Fındık',
    age: 12,
    health: 92,
    status: 'maintenance',
    garden: 'Fındık Bahçesi',
    lastHarvest: '30 kg',
    nextHarvest: '2024 Ağustos',
    rentalPrice: '1.200',
    imageUrl: 'https://example.com/tree3.jpg',
  },
];

const STATUS_FILTERS = [
  { value: 'all', label: 'Tümü' },
  { value: 'available', label: 'Kiralanabilir' },
  { value: 'rented', label: 'Kirada' },
  { value: 'maintenance', label: 'Bakımda' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'available':
      return '#4CAF50';
    case 'rented':
      return '#2196F3';
    case 'maintenance':
      return '#FFC107';
    default:
      return '#757575';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'available':
      return 'Kiralanabilir';
    case 'rented':
      return 'Kirada';
    case 'maintenance':
      return 'Bakımda';
    default:
      return status;
  }
};

export default function TreeListScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredTrees = TREES_DATA.filter((tree) => {
    const matchesSearch = tree.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tree.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tree.garden.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || tree.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <View style={styles.container}>
      <Surface style={styles.header} elevation={2}>
        <View style={styles.headerContent}>
          <Text variant="headlineMedium" style={styles.title}>
            Ağaçlarım
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            {TREES_DATA.length} ağaç
          </Text>
        </View>
      </Surface>

      <View style={styles.filters}>
        <Searchbar
          placeholder="Ağaç ara..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />

        <SegmentedButtons
          value={statusFilter}
          onValueChange={setStatusFilter}
          buttons={STATUS_FILTERS}
          style={styles.statusFilter}
        />
      </View>

      <ScrollView style={styles.treeList}>
        {filteredTrees.map((tree) => (
          <Card
            key={tree.id}
            style={styles.card}
            onPress={() => router.push(`/tree/${tree.id}`)}
          >
            <Card.Cover source={{ uri: tree.imageUrl }} style={styles.cardImage} />
            <Card.Content style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View>
                  <Text variant="titleLarge">{tree.name}</Text>
                  <Text variant="bodyMedium" style={styles.gardenName}>
                    {tree.garden}
                  </Text>
                </View>
                <Chip
                  style={[styles.statusChip, { backgroundColor: getStatusColor(tree.status) }]}
                  textStyle={styles.statusText}
                >
                  {getStatusText(tree.status)}
                </Chip>
              </View>

              <View style={styles.stats}>
                <View style={styles.stat}>
                  <Text variant="labelMedium">Tür</Text>
                  <Text variant="titleMedium">{tree.type}</Text>
                </View>
                <View style={styles.stat}>
                  <Text variant="labelMedium">Yaş</Text>
                  <Text variant="titleMedium">{tree.age} yıl</Text>
                </View>
                <View style={styles.stat}>
                  <Text variant="labelMedium">Sağlık</Text>
                  <Text variant="titleMedium">{tree.health}%</Text>
                </View>
              </View>

              <View style={styles.harvestInfo}>
                <View style={styles.harvestStat}>
                  <Text variant="labelMedium">Son Hasat</Text>
                  <Text variant="titleMedium">{tree.lastHarvest}</Text>
                </View>
                <View style={styles.harvestStat}>
                  <Text variant="labelMedium">Sonraki Hasat</Text>
                  <Text variant="titleMedium">{tree.nextHarvest}</Text>
                </View>
                <View style={styles.harvestStat}>
                  <Text variant="labelMedium">Yıllık Kira</Text>
                  <Text variant="titleMedium">{tree.rentalPrice} ₺</Text>
                </View>
              </View>

              <View style={styles.cardActions}>
                <Button
                  mode="outlined"
                  onPress={() => router.push(`/tree/${tree.id}`)}
                >
                  Detaylar
                </Button>
                <Button
                  mode="contained"
                  onPress={() => router.push(`/tree/${tree.id}/edit`)}
                >
                  Düzenle
                </Button>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <FAB
        icon="plus"
        label="Yeni Ağaç"
        style={styles.fab}
        onPress={() => router.push('/farmer/trees/add')}
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
  filters: {
    padding: 16,
    gap: 12,
  },
  searchbar: {
    backgroundColor: '#fff',
  },
  statusFilter: {
    backgroundColor: '#fff',
  },
  treeList: {
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  gardenName: {
    color: '#666',
    marginTop: 4,
  },
  statusChip: {
    borderRadius: 4,
  },
  statusText: {
    color: '#fff',
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
  harvestInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  harvestStat: {
    alignItems: 'center',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#2E7D32',
  },
}); 