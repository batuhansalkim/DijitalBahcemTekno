import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Searchbar, Chip, Card, Button, Surface, IconButton } from 'react-native-paper';
import { router } from 'expo-router';

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

const TREE_TYPES = ['Hepsi', 'Zeytin', 'Portakal', 'Fındık', 'Elma', 'Armut', 'Ceviz'];

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('Hepsi');

  const filteredTrees = SAMPLE_TREES.filter(tree => {
    const matchesSearch = tree.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tree.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'Hepsi' || tree.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleTreePress = (treeId: string) => {
    router.push(`/tree/${treeId}`);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Arama ve Filtreler */}
      <Surface style={styles.searchContainer} elevation={2}>
        <Searchbar
          placeholder="Ağaç veya konum ara..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
        >
          {TREE_TYPES.map(type => (
            <Chip
              key={type}
              selected={selectedType === type}
              onPress={() => setSelectedType(type)}
              style={styles.filterChip}
              showSelectedOverlay
            >
              {type}
            </Chip>
          ))}
        </ScrollView>
      </Surface>

      {/* Ağaç Listesi */}
      <View style={styles.treeList}>
        {filteredTrees.map(tree => (
          <Card
            key={tree.id}
            style={styles.treeCard}
            onPress={() => handleTreePress(tree.id)}
          >
            <Card.Cover source={{ uri: tree.image }} style={styles.treeImage} />
            <View style={styles.scoreContainer}>
              <IconButton
                icon="star"
                size={16}
                iconColor="#FFD700"
                style={styles.starIcon}
              />
              <Text style={styles.scoreText}>{tree.score}</Text>
            </View>
            <Card.Content>
              <Text style={styles.treeName}>{tree.name}</Text>
              <Text style={styles.treeLocation}>{tree.location}</Text>
              <View style={styles.treeDetails}>
                <View style={styles.farmerInfo}>
                  <Image
                    source={{ uri: tree.farmer.avatar }}
                    style={styles.farmerAvatar}
                  />
                  <Text style={styles.farmerName}>{tree.farmer.name}</Text>
                </View>
                <Text style={styles.treePrice}>{tree.price} ₺/yıl</Text>
              </View>
            </Card.Content>
            <Card.Actions>
              <Button
                mode="outlined"
                onPress={() => router.push(`/tree/${tree.id}`)}
                style={styles.detailsButton}
              >
                Detaylar
              </Button>
              <Button
                mode="contained"
                onPress={() => router.push(`/tree/${tree.id}/rent`)}
                style={styles.rentButton}
              >
                Kirala
              </Button>
            </Card.Actions>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  searchBar: {
    marginBottom: 12,
    elevation: 0,
    backgroundColor: '#F5F5F5',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingBottom: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  treeList: {
    padding: 16,
  },
  treeCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    paddingHorizontal: 8,
  },
  starIcon: {
    margin: 0,
  },
  scoreText: {
    fontWeight: 'bold',
    marginRight: 4,
  },
  treeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  treeLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  treeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
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
  },
  farmerName: {
    fontSize: 14,
    color: '#666',
  },
  treePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  detailsButton: {
    flex: 1,
    marginRight: 8,
  },
  rentButton: {
    flex: 1,
    backgroundColor: '#2E7D32',
  },
});
