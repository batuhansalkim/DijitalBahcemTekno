import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Animated } from 'react-native';
import { Text, Searchbar, Chip, Card, Button, Surface, IconButton } from 'react-native-paper';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Ana seçim tipleri
const MAIN_TYPES = ['Ağaçlar', 'Bahçeler'];

// Ağaç kategorileri
const TREE_TYPES = ['Hepsi', 'Zeytin', 'Portakal', 'Fındık', 'Elma', 'Armut', 'Ceviz'];

// Bahçe kategorileri
const GARDEN_TYPES = ['Hepsi', 'Zeytin Bahçesi', 'Meyve Bahçesi', 'Karma Bahçe', 'Organik Bahçe'];

// Örnek bahçe verileri
const SAMPLE_GARDENS = [
  {
    id: 'g1',
    name: 'Ege Zeytin Bahçesi',
    type: 'Zeytin Bahçesi',
    location: 'Ayvalık, Balıkesir',
    size: '2.5 Dönüm',
    price: 5000,
    score: 4.9,
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae',
    farmer: {
      id: '1',
      name: 'Ahmet Çiftçi',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
    },
    treeCount: 120,
  },
  {
    id: 'g2',
    name: 'Akdeniz Meyve Bahçesi',
    type: 'Meyve Bahçesi',
    location: 'Finike, Antalya',
    size: '1.8 Dönüm',
    price: 4200,
    score: 4.7,
    image: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e',
    farmer: {
      id: '2',
      name: 'Mehmet Yılmaz',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
    },
    treeCount: 85,
  },
];

// Örnek ağaç verileri
const SAMPLE_TREES = [
  {
    id: '1',
    name: 'Zeytin Ağacı',
    type: 'Zeytin',
    location: 'Ayvalık, Balıkesir',
    age: 25,
    price: 1200,
    score: 4.8,
    image: 'https://images.unsplash.com/photo-1445264618000-f1e069c5920f',
    farmer: {
      id: '1',
      name: 'Ahmet Çiftçi',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
    },
  },
  {
    id: '2',
    name: 'Portakal Ağacı',
    type: 'Portakal',
    location: 'Finike, Antalya',
    age: 8,
    price: 800,
    score: 4.5,
    image: 'https://images.unsplash.com/photo-1524593166156-312f362cada0',
    farmer: {
      id: '2',
      name: 'Mehmet Yılmaz',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
    },
  },
  {
    id: '3',
    name: 'Fındık Ağacı',
    type: 'Fındık',
    location: 'Giresun',
    age: 15,
    price: 900,
    score: 4.6,
    image: 'https://images.unsplash.com/photo-1504387432042-8aca549e4729',
    farmer: {
      id: '3',
      name: 'Ayşe Demir',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    },
  },
];

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMainType, setSelectedMainType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // Filtreleme fonksiyonu
  const getFilteredItems = () => {
    const allItems = [...SAMPLE_TREES, ...SAMPLE_GARDENS];
    return allItems.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Eğer filtre seçili değilse tüm öğeleri göster
      if (!selectedMainType) return matchesSearch;

      // Ana tip kontrolü
      const isTree = !('treeCount' in item);
      const matchesMainType = 
        (selectedMainType === 'Ağaçlar' && isTree) ||
        (selectedMainType === 'Bahçeler' && !isTree);

      // Kategori kontrolü
      const matchesCategory = !selectedCategory || selectedCategory === 'Hepsi' || item.type === selectedCategory;

      return matchesSearch && matchesMainType && matchesCategory;
    });
  };

  const handleItemPress = (item: any) => {
    if ('treeCount' in item) {
      // Bahçe detay sayfasına yönlendir
      router.push(`/garden/${item.id}`);
    } else {
      // Ağaç detay sayfasına yönlendir
      router.push(`/tree/${item.id}`);
    }
  };

  const renderGardenCard = (garden: any) => (
    <Card
      key={garden.id}
      style={styles.treeCard}
      onPress={() => handleItemPress(garden)}
    >
      <Card.Cover source={{ uri: garden.image }} style={styles.treeImage} />
      <View style={styles.scoreContainer}>
        <IconButton
          icon="star"
          size={16}
          iconColor="#FFD700"
          style={styles.starIcon}
        />
        <Text style={styles.scoreText}>{garden.score}</Text>
      </View>
      <Card.Content>
        <Text style={styles.treeName}>{garden.name}</Text>
        <Text style={styles.treeLocation}>{garden.location}</Text>
        <View style={styles.gardenDetails}>
          <Text style={styles.gardenInfo}>{garden.size} • {garden.treeCount} Ağaç</Text>
        </View>
        <View style={styles.treeDetails}>
          <View style={styles.farmerInfo}>
            <Image
              source={{ uri: garden.farmer.avatar }}
              style={styles.farmerAvatar}
            />
            <Text style={styles.farmerName}>{garden.farmer.name}</Text>
          </View>
          <Text style={styles.treePrice}>{garden.price} ₺/yıl</Text>
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
        {/* Arama Çubuğu */}
        <Searchbar
          placeholder="Ağaç, bahçe veya konum ara..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          theme={{
            colors: {
              onSurfaceVariant: '#2D6A4F',
              onSurface: '#1B4332',
              elevation: {
                level3: '#E8F0E3'
              }
            }
          }}
          style={styles.searchBar}
          placeholderTextColor="#40916C"
        />

        {/* Filtre Butonu */}
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setIsFilterVisible(!isFilterVisible)}
        >
          <View style={styles.filterButtonContent}>
            <MaterialCommunityIcons 
              name="filter-variant" 
              size={24} 
              color="#2D6A4F" 
            />
            <Text style={styles.filterButtonText}>Filtrele</Text>
            {(selectedMainType || selectedCategory) && (
              <View style={styles.activeFilterBadge} />
            )}
            <MaterialCommunityIcons 
              name={isFilterVisible ? "chevron-up" : "chevron-down"} 
              size={24} 
              color="#2D6A4F" 
            />
          </View>
        </TouchableOpacity>

        {/* Filtreler Panel */}
        {isFilterVisible && (
          <View style={styles.filtersWrapper}>
            {/* Filtre Başlığı */}
            <View style={styles.filterHeaderContainer}>
              <Text style={styles.filterTitle}>Filtreler</Text>
              {(selectedMainType || selectedCategory) && (
                <Button
                  mode="text"
                  onPress={() => {
                    setSelectedMainType('');
                    setSelectedCategory('');
                  }}
                  textColor="#2D6A4F"
                  style={styles.clearButton}
                >
                  Temizle
                </Button>
              )}
            </View>

            {/* Filtre Seçenekleri */}
            <View style={styles.filterOptionsContainer}>
              {/* Ana Tip Seçimi */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Tür</Text>
                <View style={styles.filterOptionsRow}>
                  {MAIN_TYPES.map(type => (
                    <Chip
                      key={type}
                      selected={selectedMainType === type}
                      onPress={() => {
                        setSelectedMainType(type);
                        setSelectedCategory('');
                      }}
                      style={[
                        styles.mainTypeChip,
                        selectedMainType === type && styles.selectedChip
                      ]}
                      textStyle={{ 
                        color: selectedMainType === type ? '#FFFFFF' : '#2D6A4F',
                        fontWeight: '600'
                      }}
                      showSelectedOverlay
                    >
                      {type}
                    </Chip>
                  ))}
                </View>
              </View>

              {/* Kategori Seçimi - Sadece ana tip seçiliyse göster */}
              {selectedMainType && (
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>Kategori</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filterOptionsRow}
                  >
                    {(selectedMainType === 'Ağaçlar' ? TREE_TYPES : GARDEN_TYPES).map(type => (
                      <Chip
                        key={type}
                        selected={selectedCategory === type}
                        onPress={() => setSelectedCategory(type)}
                        style={[
                          styles.categoryChip,
                          selectedCategory === type && styles.selectedChip
                        ]}
                        textStyle={{ 
                          color: selectedCategory === type ? '#FFFFFF' : '#2D6A4F',
                          fontWeight: '600'
                        }}
                        showSelectedOverlay
                      >
                        {type}
                      </Chip>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          </View>
        )}
      </Surface>

      {/* Liste */}
      <View style={styles.treeList}>
        {getFilteredItems().map(item => (
          'treeCount' in item ? renderGardenCard(item) : (
            <Card
              key={item.id}
              style={styles.treeCard}
              onPress={() => handleItemPress(item)}
            >
              <Card.Cover source={{ uri: item.image }} style={styles.treeImage} />
              <View style={styles.scoreContainer}>
                <IconButton
                  icon="star"
                  size={16}
                  iconColor="#FFD700"
                  style={styles.starIcon}
                />
                <Text style={styles.scoreText}>{item.score}</Text>
              </View>
              <Card.Content>
                <Text style={styles.treeName}>{item.name}</Text>
                <Text style={styles.treeLocation}>{item.location}</Text>
                <View style={styles.treeDetails}>
                  <View style={styles.farmerInfo}>
                    <Image
                      source={{ uri: item.farmer.avatar }}
                      style={styles.farmerAvatar}
                    />
                    <Text style={styles.farmerName}>{item.farmer.name}</Text>
                  </View>
                  <Text style={styles.treePrice}>{item.price} ₺/yıl</Text>
                </View>
              </Card.Content>
              <Card.Actions>
                <Button
                  mode="outlined"
                  onPress={() => handleItemPress(item)}
                  style={styles.detailsButton}
                  labelStyle={{ color: '#2D6A4F', fontWeight: '600' }}
                >
                  Detaylar
                </Button>
                <Button
                  mode="contained"
                  onPress={() => router.push(`/tree/${item.id}/rent`)}
                  style={styles.rentButton}
                  labelStyle={{ color: '#FFFFFF', fontWeight: '600' }}
                >
                  Kirala
                </Button>
              </Card.Actions>
            </Card>
          )
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F3',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
    borderBottomColor: '#E8F0E3',
    borderBottomWidth: 1,
  },
  searchBar: {
    marginBottom: 16,
    elevation: 0,
    backgroundColor: '#F5F7F3',
    borderWidth: 1,
    borderColor: '#E8F0E3',
  },
  filterButton: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8F0E3',
  },
  filterButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  filterButtonText: {
    fontSize: 16,
    color: '#2D6A4F',
    fontWeight: '600',
  },
  activeFilterBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2D6A4F',
    marginLeft: 4,
  },
  filtersWrapper: {
    backgroundColor: '#FFFFFF',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8F0E3',
  },
  filterHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B4332',
  },
  clearButton: {
    marginVertical: -8,
  },
  filterOptionsContainer: {
    gap: 16,
  },
  filterSection: {
    gap: 8,
  },
  filterSectionTitle: {
    fontSize: 14,
    color: '#40916C',
    fontWeight: '500',
  },
  filterOptionsRow: {
    flexDirection: 'row',
  },
  mainTypeChip: {
    marginRight: 8,
    backgroundColor: '#E8F0E3',
    borderWidth: 1,
    borderColor: '#2D6A4F',
  },
  categoryChip: {
    marginRight: 8,
    backgroundColor: '#E8F0E3',
    borderWidth: 1,
    borderColor: '#2D6A4F',
  },
  selectedChip: {
    backgroundColor: '#2D6A4F',
  },
  treeList: {
    padding: 16,
  },
  treeCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderColor: '#E8F0E3',
    borderWidth: 1,
  },
  treeImage: {
    height: 200,
  },
  scoreContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#2E7D32',
  },
  starIcon: {
    margin: 0,
  },
  scoreText: {
    fontWeight: 'bold',
    marginRight: 4,
    color: '#2E7D32',
  },
  treeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1B4332',
  },
  treeLocation: {
    fontSize: 14,
    color: '#40916C',
    marginBottom: 8,
  },
  gardenDetails: {
    marginBottom: 8,
  },
  gardenInfo: {
    fontSize: 14,
    color: '#40916C',
    fontWeight: '500',
  },
  treeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E8F0E3',
  },
  farmerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  farmerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E8F0E3',
  },
  farmerName: {
    fontSize: 14,
    color: '#40916C',
  },
  treePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D6A4F',
  },
  detailsButton: {
    flex: 1,
    marginRight: 8,
    borderColor: '#2D6A4F',
    borderWidth: 2,
  },
  rentButton: {
    flex: 1,
    backgroundColor: '#2D6A4F',
  },
});
