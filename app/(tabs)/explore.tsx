import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text, Searchbar, Card, Button, Surface, IconButton } from 'react-native-paper';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getRecommendations } from "../services/aiServices";

//////////////////////
// Type Definitions //
//////////////////////

type Farmer = {
  id: string;
  name: string;
  avatar: string;
};

type GardenItem = {
  id: string;
  name: string;
  type?: string;
  crop_type?: string;
  location?: string;
  treeCount?: number;
  price?: number;
  score?: number;
  image?: string;
  farmer?: Farmer;
};

export type ExploreItem = GardenItem;

//////////////////////
// Component        //
//////////////////////

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMainType, setSelectedMainType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [apiItems, setApiItems] = useState<ExploreItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getRecommendations("C0001", "hybrid", 20);
        console.log("API Response:", data);

        if (data && data.recommendations) {
          const mappedItems: ExploreItem[] = data.recommendations.map((rec: any) => ({
            id: rec.garden_id,
            name: `${rec.crop_type} (${rec.variety})`,
            type: rec.crop_type,
            crop_type: rec.crop_type,
            location: rec.location,
            treeCount: Math.round(rec.metadata?.area_decare || 0), // dummy treeCount
            price: 1000, // backend’de yok → şimdilik dummy
            score: rec.stable ? 5 : 4, // stable alanını score’a çevirdim
            image: "https://via.placeholder.com/150",
            farmer: {
              id: rec.owner_id,
              name: `Çiftçi ${rec.owner_id}`,
              avatar: "https://via.placeholder.com/50"
            }
          }));
          console.log("Mapped Items:", mappedItems);
          setApiItems(mappedItems);
        }
      } catch (e) {
        console.error("API Fetch Error:", e);
      }
    };
    fetchData();
  }, []);

  const getFilteredItems = (): ExploreItem[] => {
    return apiItems.filter((item: ExploreItem) => {
      const matchesSearch =
        (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        !selectedCategory ||
        selectedCategory === 'Hepsi' ||
        item.type === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  };

  const handleItemPress = (item: ExploreItem) => {
    router.push(`/garden/${item.id}`);
  };

  const renderGardenCard = (garden: GardenItem) => (
    <Card key={garden.id} style={styles.treeCard} onPress={() => handleItemPress(garden)}>
      <Card.Cover source={{ uri: garden.image }} style={styles.treeImage} />
      <View style={styles.scoreContainer}>
        <IconButton icon="star" size={16} iconColor="#FFD700" style={styles.starIcon} />
        <Text style={styles.scoreText}>{garden.score}</Text>
      </View>
      <Card.Content>
        <Text style={styles.treeName}>{garden.name}</Text>
        <Text style={styles.treeLocation}>{garden.location}</Text>
        <View style={styles.treeDetails}>
          {garden.farmer && (
            <View style={styles.farmerInfo}>
              <Image source={{ uri: garden.farmer.avatar }} style={styles.farmerAvatar} />
              <Text style={styles.farmerName}>{garden.farmer.name}</Text>
            </View>
          )}
          {garden.price && <Text style={styles.treePrice}>{garden.price} ₺/yıl</Text>}
        </View>
      </Card.Content>
      <Card.Actions>
        <Button
          mode="outlined"
          onPress={() => handleItemPress(garden)}
          style={styles.detailsButton}
          labelStyle={{ color: '#2D6A4F', fontWeight: '600' }}
        >
          Detaylar
        </Button>
        <Button
          mode="contained"
          onPress={() => router.push(`/garden/${garden.id}/rent`)}
          style={styles.rentButton}
          labelStyle={{ color: '#FFFFFF', fontWeight: '600' }}
        >
          Kirala
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.searchContainer} elevation={2}>
        <Searchbar
          placeholder="Bahçe veya konum ara..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          placeholderTextColor="#40916C"
        />
        <TouchableOpacity style={styles.filterButton} onPress={() => setIsFilterVisible(!isFilterVisible)}>
          <View style={styles.filterButtonContent}>
            <MaterialCommunityIcons name="filter-variant" size={24} color="#2D6A4F" />
            <Text style={styles.filterButtonText}>Filtrele</Text>
            {(selectedMainType || selectedCategory) && <View style={styles.activeFilterBadge} />}
            <MaterialCommunityIcons name={isFilterVisible ? 'chevron-up' : 'chevron-down'} size={24} color="#2D6A4F" />
          </View>
        </TouchableOpacity>
      </Surface>

      {/* Liste */}
      <View style={styles.treeList}>
        {getFilteredItems().map((item: ExploreItem) => renderGardenCard(item))}
      </View>
    </ScrollView>
  );
}

//////////////////////
// Styles           //
//////////////////////

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7F3' },
  searchContainer: { padding: 16, backgroundColor: '#fff', marginBottom: 8, borderBottomColor: '#E8F0E3', borderBottomWidth: 1 },
  searchBar: { marginBottom: 16, elevation: 0, backgroundColor: '#F5F7F3', borderWidth: 1, borderColor: '#E8F0E3' },
  filterButton: { paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#E8F0E3' },
  filterButtonContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  filterButtonText: { fontSize: 16, color: '#2D6A4F', fontWeight: '600' },
  activeFilterBadge: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#2D6A4F', marginLeft: 4 },
  treeList: { padding: 16 },
  treeCard: { marginBottom: 16, borderRadius: 12, overflow: 'hidden', backgroundColor: '#FFFFFF', borderColor: '#E8F0E3', borderWidth: 1 },
  treeImage: { height: 200 },
  scoreContainer: { position: 'absolute', top: 8, right: 8, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: 16, paddingHorizontal: 8, borderWidth: 1, borderColor: '#2E7D32' },
  starIcon: { margin: 0 },
  scoreText: { fontWeight: 'bold', marginRight: 4, color: '#2E7D32' },
  treeName: { fontSize: 18, fontWeight: 'bold', marginBottom: 4, color: '#1B4332' },
  treeLocation: { fontSize: 14, color: '#40916C', marginBottom: 8 },
  treeDetails: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#E8F0E3' },
  farmerInfo: { flexDirection: 'row', alignItems: 'center' },
  farmerAvatar: { width: 24, height: 24, borderRadius: 12, marginRight: 8, borderWidth: 1, borderColor: '#E8F0E3' },
  farmerName: { fontSize: 14, color: '#40916C' },
  treePrice: { fontSize: 16, fontWeight: 'bold', color: '#2D6A4F' },
  detailsButton: { flex: 1, marginRight: 8, borderColor: '#2D6A4F', borderWidth: 2 },
  rentButton: { flex: 1, backgroundColor: '#2D6A4F' },
});
