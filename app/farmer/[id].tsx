import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Avatar, Surface, IconButton, Button, ProgressBar, Card, Chip } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';

// Örnek çiftçi verisi
const FARMER_DATA = {
  id: '1',
  name: 'Ahmet Çiftçi',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
  experience: '15 yıl',
  location: 'Ayvalık, Balıkesir',
  about: 'Üç nesildir zeytincilik yapan ailemizle birlikte organik tarım ilkeleriyle ağaçlarımızı özenle yetiştiriyoruz.',
  specialties: ['Zeytin', 'Narenciye', 'Organik Tarım'],
  rating: 4.8,
  reviewCount: 127,
  treeCount: 250,
  customerCount: 180,
  certifications: ['Organik Tarım', 'İyi Tarım'],
  statistics: {
    totalHarvest: '12.5 ton',
    activeRentals: 145,
    completedRentals: 890,
    satisfactionRate: 98,
  }
};

// Örnek bahçe verileri
const GARDEN_DATA = [
  {
    id: '1',
    name: 'Ayvalık Zeytinliği',
    location: 'Ayvalık, Balıkesir',
    treeCount: 150,
    area: '25 dönüm',
    treeTypes: ['Zeytin'],
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578',
  },
  {
    id: '2',
    name: 'Finike Portakal Bahçesi',
    location: 'Finike, Antalya',
    treeCount: 100,
    area: '15 dönüm',
    treeTypes: ['Portakal', 'Mandalina'],
    image: 'https://images.unsplash.com/photo-1590086783191-a0694c7d1e6e',
  }
];

export default function FarmerProfileScreen() {
  const { id } = useLocalSearchParams();

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Surface style={styles.header} elevation={2}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => router.back()}
        />
        <Text style={styles.headerTitle}>Çiftçi Profili</Text>
      </Surface>

      {/* Profil Bilgileri */}
      <Surface style={styles.profileCard} elevation={1}>
        <View style={styles.profileHeader}>
          <Avatar.Image
            source={{ uri: FARMER_DATA.avatar }}
            size={80}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{FARMER_DATA.name}</Text>
            <Text style={styles.location}>{FARMER_DATA.location}</Text>
            <View style={styles.ratingContainer}>
              <IconButton icon="star" size={16} iconColor="#FFD700" />
              <Text style={styles.rating}>{FARMER_DATA.rating}</Text>
              <Text style={styles.reviewCount}>({FARMER_DATA.reviewCount} değerlendirme)</Text>
            </View>
          </View>
        </View>

        <Text style={styles.about}>{FARMER_DATA.about}</Text>

        <View style={styles.specialtiesContainer}>
          {FARMER_DATA.specialties.map((specialty, index) => (
            <Chip key={index} style={styles.chip}>{specialty}</Chip>
          ))}
        </View>
      </Surface>

      {/* İstatistikler */}
      <Surface style={styles.statsCard} elevation={1}>
        <Text style={styles.sectionTitle}>İstatistikler</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{FARMER_DATA.statistics.activeRentals}</Text>
            <Text style={styles.statLabel}>Aktif Kiralama</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{FARMER_DATA.statistics.totalHarvest}</Text>
            <Text style={styles.statLabel}>Toplam Hasat</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{FARMER_DATA.treeCount}</Text>
            <Text style={styles.statLabel}>Ağaç Sayısı</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>%{FARMER_DATA.statistics.satisfactionRate}</Text>
            <Text style={styles.statLabel}>Memnuniyet</Text>
          </View>
        </View>
      </Surface>

      {/* Sertifikalar */}
      <Surface style={styles.certificationsCard} elevation={1}>
        <Text style={styles.sectionTitle}>Sertifikalar</Text>
        <View style={styles.certificatesContainer}>
          {FARMER_DATA.certifications.map((cert, index) => (
            <Chip key={index} style={styles.certChip} icon="check-circle">
              {cert}
            </Chip>
          ))}
        </View>
      </Surface>

      {/* Bahçeler */}
      <Text style={[styles.sectionTitle, styles.gardensTitle]}>Bahçeler</Text>
      {GARDEN_DATA.map(garden => (
        <Card
          key={garden.id}
          style={styles.gardenCard}
          onPress={() => router.push({
            pathname: '/garden/[id]' as const,
            params: { id: garden.id }
          })}
        >
          <Card.Cover source={{ uri: garden.image }} style={styles.gardenImage} />
          <Card.Content style={styles.gardenContent}>
            <Text style={styles.gardenName}>{garden.name}</Text>
            <Text style={styles.gardenLocation}>{garden.location}</Text>
            <View style={styles.gardenDetails}>
              <Text style={styles.gardenStat}>{garden.treeCount} ağaç</Text>
              <Text style={styles.gardenStat}>{garden.area}</Text>
            </View>
            <View style={styles.treeTypesContainer}>
              {garden.treeTypes.map((type, index) => (
                <Chip key={index} style={styles.treeTypeChip}>{type}</Chip>
              ))}
            </View>
          </Card.Content>
        </Card>
      ))}

      {/* İletişim Butonu */}
      <Button
        mode="contained"
        icon="message"
        style={styles.messageButton}
        onPress={() => router.push({
          pathname: '/chat/[id]' as const,
          params: { id: FARMER_DATA.id }
        })}
      >
        Mesaj Gönder
      </Button>
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
  profileCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  profileHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: '#666',
  },
  about: {
    fontSize: 14,
    lineHeight: 20,
    color: '#444',
    marginBottom: 16,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#E8F5E9',
  },
  statsCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  certificationsCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
  },
  certificatesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  certChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#E8F5E9',
  },
  gardensTitle: {
    marginHorizontal: 16,
  },
  gardenCard: {
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gardenImage: {
    height: 150,
  },
  gardenContent: {
    padding: 16,
  },
  gardenName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  gardenLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  gardenDetails: {
    flexDirection: 'row',
    marginTop: 8,
  },
  gardenStat: {
    fontSize: 14,
    color: '#2E7D32',
    marginRight: 16,
  },
  treeTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  treeTypeChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#E8F5E9',
  },
  messageButton: {
    margin: 16,
    marginTop: 0,
    backgroundColor: '#2E7D32',
  },
}); 