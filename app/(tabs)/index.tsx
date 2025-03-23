import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, Card, Button, ProgressBar, IconButton, Avatar, Chip } from 'react-native-paper';
import { router } from 'expo-router';

// Örnek kullanıcı verileri
const USER_DATA = {
  name: 'Mehmet',
  rentedTrees: 3,
  totalHarvest: '850 kg',
  totalEarnings: '12.500₺',
  nextHarvest: '15 Ekim 2024',
};

// Kiralanan ağaçlar
const RENTED_TREES = [
  {
    id: '1',
    name: 'Zeytin Ağacı',
    location: 'Ayvalık, Balıkesir',
    farmer: 'Ahmet Çiftçi',
    farmerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    image: 'https://images.unsplash.com/photo-1445264718234-a623be589d37',
    health: 95,
    nextHarvest: '15 Ekim 2024',
    lastHarvest: '320 kg',
    rentalDate: '01.01.2024',
  },
  {
    id: '2',
    name: 'Portakal Ağacı',
    location: 'Finike, Antalya',
    farmer: 'Mehmet Yılmaz',
    farmerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
    image: 'https://images.unsplash.com/photo-1590086783191-a0694c7d1e6e',
    health: 92,
    nextHarvest: '1 Aralık 2024',
    lastHarvest: '280 kg',
    rentalDate: '15.01.2024',
  },
];

// Öne çıkan ağaçlar
const FEATURED_TREES = [
  {
    id: '3',
    name: 'Mandalina Ağacı',
    location: 'Bodrum, Muğla',
    price: '950₺',
    image: 'https://images.unsplash.com/photo-1587411768638-ec71f8e33b78',
    rating: 4.8,
  },
  {
    id: '4',
    name: 'Fındık Ağacı',
    location: 'Giresun',
    price: '800₺',
    image: 'https://images.unsplash.com/photo-1509983165097-0c31a863e3f3',
    rating: 4.5,
  },
];

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Hoşgeldin Kartı */}
      <Surface style={styles.welcomeCard} elevation={2}>
        <View style={styles.welcomeHeader}>
          <View>
            <Text style={styles.welcomeText}>Hoş geldin,</Text>
            <Text style={styles.userName}>{USER_DATA.name}</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{USER_DATA.rentedTrees}</Text>
            <Text style={styles.statLabel}>Kiralı Ağaç</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{USER_DATA.totalHarvest}</Text>
            <Text style={styles.statLabel}>Toplam Hasat</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{USER_DATA.totalEarnings}</Text>
            <Text style={styles.statLabel}>Toplam Kazanç</Text>
          </View>
        </View>
      </Surface>

      {/* Kiralanan Ağaçlar */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kiralanan Ağaçlarım</Text>
        {RENTED_TREES.map(tree => (
          <Card
            key={tree.id}
            style={styles.treeCard}
            onPress={() => router.push({
              pathname: '/tree/[id]' as const,
              params: { id: tree.id }
            })}
          >
            <Card.Cover source={{ uri: tree.image }} style={styles.treeImage} />
            <Card.Content>
              <View style={styles.treeHeader}>
                <View>
                  <Text style={styles.treeName}>{tree.name}</Text>
                  <Text style={styles.treeLocation}>{tree.location}</Text>
                </View>
                <View style={styles.farmerInfo}>
                  <Avatar.Image 
                    source={{ uri: tree.farmerAvatar }} 
                    size={24} 
                    style={styles.farmerAvatar}
                  />
                  <Text style={styles.farmerName}>{tree.farmer}</Text>
                </View>
              </View>

              <View style={styles.treeStats}>
                <View style={styles.treeStat}>
                  <Text style={styles.treeStatLabel}>Sağlık</Text>
                  <View style={styles.healthBar}>
                    <ProgressBar 
                      progress={tree.health / 100} 
                      color="#2E7D32"
                      style={styles.progressBar}
                    />
                    <Text style={styles.healthText}>%{tree.health}</Text>
                  </View>
                </View>

                <View style={styles.treeStat}>
                  <Text style={styles.treeStatLabel}>Son Hasat</Text>
                  <Text style={styles.treeStatValue}>{tree.lastHarvest}</Text>
                </View>

                <View style={styles.treeStat}>
                  <Text style={styles.treeStatLabel}>Sonraki Hasat</Text>
                  <Text style={styles.treeStatValue}>{tree.nextHarvest}</Text>
                </View>
              </View>

              <View style={styles.rentalInfo}>
                <Chip icon="calendar" style={styles.rentalDate}>
                  Kiralama: {tree.rentalDate}
                </Chip>
                <IconButton 
                  icon="message"
                  size={20}
                  onPress={() => router.push({
                    pathname: '/chat/[id]' as const,
                    params: { id: tree.id }
                  })}
                />
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>

      {/* Öne Çıkan Ağaçlar */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Öne Çıkan Ağaçlar</Text>
          <Button 
            mode="text" 
            onPress={() => router.push('/explore')}
          >
            Tümünü Gör
          </Button>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.featuredScroll}
        >
          {FEATURED_TREES.map(tree => (
            <Card
              key={tree.id}
              style={styles.featuredCard}
              onPress={() => router.push({
                pathname: '/tree/[id]' as const,
                params: { id: tree.id }
              })}
            >
              <Card.Cover source={{ uri: tree.image }} style={styles.featuredImage} />
              <Card.Content>
                <Text style={styles.featuredName}>{tree.name}</Text>
                <Text style={styles.featuredLocation}>{tree.location}</Text>
                <View style={styles.featuredFooter}>
                  <View style={styles.ratingContainer}>
                    <IconButton icon="star" size={16} iconColor="#FFD700" />
                    <Text style={styles.rating}>{tree.rating}</Text>
                  </View>
                  <Text style={styles.featuredPrice}>{tree.price}/yıl</Text>
                </View>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  welcomeCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#F4F9F4',
    shadowColor: "#2E7D32",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: '500',
  },
  userName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1B4D1B',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statItem: {
    backgroundColor: '#E8F3E8',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B4D1B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#2E7D32',
    marginTop: 4,
    fontWeight: '500',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B4D1B',
    marginBottom: 16,
  },
  treeCard: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: "#2E7D32",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  treeImage: {
    height: 220,
  },
  treeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 16,
    marginBottom: 20,
  },
  treeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B4D1B',
  },
  treeLocation: {
    fontSize: 14,
    color: '#2E7D32',
    marginTop: 4,
    fontWeight: '500',
  },
  farmerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F3E8',
    padding: 8,
    borderRadius: 20,
  },
  farmerAvatar: {
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  farmerName: {
    fontSize: 14,
    color: '#1B4D1B',
    fontWeight: '500',
  },
  treeStats: {
    marginBottom: 20,
    backgroundColor: '#F4F9F4',
    padding: 16,
    borderRadius: 12,
  },
  treeStat: {
    marginBottom: 16,
  },
  treeStatLabel: {
    fontSize: 13,
    color: '#2E7D32',
    marginBottom: 6,
    fontWeight: '500',
  },
  treeStatValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1B4D1B',
  },
  healthBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F3E8',
    padding: 8,
    borderRadius: 8,
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
  },
  healthText: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1B4D1B',
  },
  rentalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  rentalDate: {
    backgroundColor: '#E8F3E8',
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  featuredScroll: {
    marginLeft: -16,
    paddingLeft: 16,
    paddingBottom: 8,
  },
  featuredCard: {
    width: 260,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: "#2E7D32",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  featuredImage: {
    height: 160,
  },
  featuredName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B4D1B',
    marginTop: 12,
  },
  featuredLocation: {
    fontSize: 13,
    color: '#2E7D32',
    marginTop: 4,
    fontWeight: '500',
  },
  featuredFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8F3E8',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F9F4',
    padding: 4,
    borderRadius: 12,
  },
  rating: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: -4,
    color: '#2E7D32',
  },
  featuredPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B4D1B',
  },
});
