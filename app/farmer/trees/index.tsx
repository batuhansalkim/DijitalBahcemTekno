import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text, Surface, FAB, Card, Button, Chip, Searchbar } from 'react-native-paper';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
    imageUrl: 'https://images.unsplash.com/photo-1445264718234-a623be589d37?w=400&h=300&fit=crop',
    story: 'Bu 15 yaşındaki zeytin ağacımız, dedemizin 2008\'de diktiği ilk ağaçlardan. Her yıl 120kg zeytin veriyor ve ailemizin gururu. "Barış Ağacı" olarak biliniyor çünkü komşularımızla birlikte hasat ediyoruz.',
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
    imageUrl: 'https://images.unsplash.com/photo-1590086783191-a0694c7d1e6e?w=400&h=300&fit=crop',
    story: 'Bu portakal ağacımız, çocukluğumda diktiğim ilk ağaç. 8 yaşında babamla birlikte dikmiştik. Şimdi 8 yaşında ve her yıl mis kokulu portakallar veriyor. "Çocukluk Ağacı" olarak anılıyor.',
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
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
    story: 'Bu fındık ağacımız, Karadeniz\'in geleneksel fındık yetiştiriciliğinin bir parçası. 12 yıldır ailemizle birlikte büyüyor. Her yıl kaliteli fındıklar veriyor ve bölgemizin en iyi ağaçlarından biri.',
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
      <Surface style={styles.header} elevation={4}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Ağaçlarım 🌳</Text>
          <Text style={styles.subtitle}>{TREES_DATA.length} ağaç</Text>
        </View>
      </Surface>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Ağaç ara..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          inputStyle={{ fontSize: 16, color: '#000' }}
          placeholderTextColor="#666"
        />
      </View>

      <ScrollView style={styles.treeList} showsVerticalScrollIndicator={false}>
        <View style={styles.filters}>
          <View style={styles.filterContainer}>
            {STATUS_FILTERS.map((filter) => (
              <TouchableOpacity
                key={filter.value}
                style={[
                  styles.filterButton,
                  statusFilter === filter.value && styles.filterButtonActive
                ]}
                onPress={() => setStatusFilter(filter.value)}
              >
                <Text style={[
                  styles.filterButtonText,
                  statusFilter === filter.value && styles.filterButtonTextActive
                ]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {filteredTrees.map((tree) => (
          <Surface key={tree.id} style={styles.card} elevation={4}>
            <Image source={{ uri: tree.imageUrl }} style={styles.cardImage} resizeMode="cover" />
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.cardTitle}>{tree.name}</Text>
                  <Text style={styles.gardenName}>{tree.garden}</Text>
                </View>
                <Chip
                  style={[styles.statusChip, { backgroundColor: getStatusColor(tree.status) }]}
                  textStyle={styles.statusText}
                >
                  {getStatusText(tree.status)}
                </Chip>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Tür</Text>
                  <Text style={styles.statValue}>{tree.type}</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Yaş</Text>
                  <Text style={styles.statValue}>{tree.age} yıl</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Sağlık</Text>
                  <Text style={styles.statValue}>{tree.health}%</Text>
                </View>
              </View>

              <View style={styles.harvestInfo}>
                <View style={styles.harvestStat}>
                  <Text style={styles.harvestLabel}>Son Hasat</Text>
                  <Text style={styles.harvestValue}>{tree.lastHarvest}</Text>
                </View>
                <View style={styles.harvestStat}>
                  <Text style={styles.harvestLabel}>Sonraki Hasat</Text>
                  <Text style={styles.harvestValue}>{tree.nextHarvest}</Text>
                </View>
                <View style={styles.harvestStat}>
                  <Text style={styles.harvestLabel}>Yıllık Kira</Text>
                  <Text style={styles.harvestValue}>{tree.rentalPrice} ₺</Text>
                </View>
              </View>

              {tree.story && (
                <View style={styles.storyContainer}>
                  <View style={styles.storyHeader}>
                    <MaterialCommunityIcons name="book-open-variant" size={16} color="#2E7D32" />
                    <Text style={styles.storyTitle}>Ağaç Hikayesi</Text>
                  </View>
                  <Text style={styles.storyText} numberOfLines={3}>
                    {tree.story}
                  </Text>
                </View>
              )}

              <View style={styles.cardActions}>
                <Button
                  mode="outlined"
                  onPress={() => router.push(`/farmer/trees/${tree.id}` as any)}
                  style={styles.actionBtn}
                  textColor="#2E7D32"
                >
                  Detaylar
                </Button>
                <Button
                  mode="contained"
                  onPress={() => router.push(`/farmer/trees/${tree.id}/edit` as any)}
                  style={styles.actionBtnFilled}
                  buttonColor="#2E7D32"
                >
                  Düzenle
                </Button>
              </View>
            </View>
          </Surface>
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
    backgroundColor: '#2E7D32',
    marginBottom: 12,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    color: '#E8F5E9',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 2,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchbar: {
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: '#000',
  },
  treeList: {
    flex: 1,
  },
  filters: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 1,
    minHeight: 48,
  },
  filterButtonActive: {
    backgroundColor: '#2E7D32',
  },
  filterButtonText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
  },
  filterButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardImage: {
    height: 180,
    width: '100%',
  },
  cardContent: {
    padding: 18,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B4332',
    marginBottom: 2,
  },
  gardenName: {
    color: '#666',
    fontSize: 13,
    marginTop: 2,
  },
  statusChip: {
    borderRadius: 12,
    height: 28,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    backgroundColor: '#E8F5E9',
    padding: 10,
    borderRadius: 10,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#40916C',
    fontWeight: '500',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1B4332',
  },
  harvestInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 10,
  },
  harvestStat: {
    alignItems: 'center',
    flex: 1,
  },
  harvestLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  harvestValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1B4332',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 8,
  },
  actionBtn: {
    borderColor: '#2E7D32',
    borderWidth: 1.2,
    borderRadius: 8,
  },
  actionBtnFilled: {
    borderRadius: 8,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#2E7D32',
    borderRadius: 30,
    elevation: 4,
  },
  storyContainer: {
    marginBottom: 14,
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
  },
  storyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  storyTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1B4332',
    marginLeft: 8,
  },
  storyText: {
    color: '#666',
    fontSize: 13,
  },
}); 