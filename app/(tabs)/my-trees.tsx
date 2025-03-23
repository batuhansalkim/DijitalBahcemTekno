import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Button, ProgressBar } from 'react-native-paper';

// Örnek veri
const SAMPLE_MY_TREES = [
  {
    id: '1',
    name: 'Zeytin Ağacı #123',
    location: 'İzmir, Seferihisar',
    farmer: 'Ahmet Çiftçi',
    status: 'Sağlıklı',
    health: 0.9,
    nextHarvest: '2024 Kasım',
    image: 'https://images.unsplash.com/photo-1445264718234-a623be589d37',
  },
  {
    id: '2',
    name: 'Portakal Ağacı #456',
    location: 'Antalya, Finike',
    farmer: 'Mehmet Yılmaz',
    status: 'Bakım Gerekiyor',
    health: 0.7,
    nextHarvest: '2024 Aralık',
    image: 'https://images.unsplash.com/photo-1590086783191-a0694c7d1e6e',
  },
];

interface TreeItem {
  id: string;
  name: string;
  location: string;
  farmer: string;
  status: string;
  health: number;
  nextHarvest: string;
  image: string;
}

export default function MyTreesScreen() {
  const renderTreeCard = ({ item }: { item: TreeItem }) => (
    <Card style={styles.treeCard}>
      <Card.Cover source={{ uri: item.image }} />
      <Card.Content>
        <Text style={styles.treeName}>{item.name}</Text>
        <Text style={styles.treeLocation}>{item.location}</Text>
        <Text style={styles.farmerName}>Çiftçi: {item.farmer}</Text>
        
        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Durum: </Text>
          <Text style={[
            styles.statusValue,
            { color: item.health > 0.8 ? '#2E7D32' : '#FFA000' }
          ]}>
            {item.status}
          </Text>
        </View>

        <View style={styles.healthContainer}>
          <Text style={styles.healthLabel}>Ağaç Sağlığı:</Text>
          <ProgressBar
            progress={item.health}
            color={item.health > 0.8 ? '#2E7D32' : '#FFA000'}
            style={styles.healthBar}
          />
        </View>

        <Text style={styles.harvestInfo}>
          Sonraki Hasat: {item.nextHarvest}
        </Text>
      </Card.Content>
      <Card.Actions>
        <Button mode="contained" onPress={() => {}}>
          Detaylar
        </Button>
        <Button mode="outlined" onPress={() => {}}>
          Mesaj Gönder
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ağaçlarım</Text>
        <Text style={styles.subtitle}>
          Toplam {SAMPLE_MY_TREES.length} ağaç kiralıyorsunuz
        </Text>
      </View>

      <FlatList
        data={SAMPLE_MY_TREES}
        renderItem={renderTreeCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.treeList}
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
    padding: 20,
    backgroundColor: '#2E7D32',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  treeList: {
    padding: 16,
  },
  treeCard: {
    marginBottom: 16,
  },
  treeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  treeLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  farmerName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: '#666',
  },
  statusValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  healthContainer: {
    marginBottom: 8,
  },
  healthLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  healthBar: {
    height: 8,
    borderRadius: 4,
  },
  harvestInfo: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: 'bold',
    marginTop: 8,
  },
}); 