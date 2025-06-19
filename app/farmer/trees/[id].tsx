import React from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text, Surface, Button, Chip, IconButton } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Örnek ağaç verileri (gerçek uygulamada API'den gelecek)
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
    expectedHarvest: '150 kg',
    harvestMonth: 'Kasım',
    description: 'Bu zeytin ağacı, dedemizin 2008\'de diktiği ilk ağaçlardan. Her yıl kaliteli zeytin veriyor.',
    story: 'Bu 15 yaşındaki zeytin ağacımız, dedemizin 2008\'de diktiği ilk ağaçlardan. Her yıl 120kg zeytin veriyor ve ailemizin gururu. "Barış Ağacı" olarak biliniyor çünkü komşularımızla birlikte hasat ediyoruz.',
    imageUrl: 'https://images.unsplash.com/photo-1445264718234-a623be589d37?w=400&h=300&fit=crop',
    rfidCode: 'RFID-123456',
    location: { latitude: '40.7128', longitude: '-74.0060' },
    treeId: 'TR-123456-ABC',
    images: [
      'https://images.unsplash.com/photo-1445264718234-a623be589d37?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1590086783191-a0694c7d1e6e?w=400&h=300&fit=crop',
    ],
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
    expectedHarvest: '100 kg',
    harvestMonth: 'Mart',
    description: 'Çocukluğumda diktiğim ilk ağaç. Her yıl mis kokulu portakallar veriyor.',
    story: 'Bu portakal ağacımız, çocukluğumda diktiğim ilk ağaç. 8 yaşında babamla birlikte dikmiştik. Şimdi 8 yaşında ve her yıl mis kokulu portakallar veriyor. "Çocukluk Ağacı" olarak anılıyor.',
    imageUrl: 'https://images.unsplash.com/photo-1590086783191-a0694c7d1e6e?w=400&h=300&fit=crop',
    rfidCode: 'RFID-789012',
    location: { latitude: '40.7589', longitude: '-73.9851' },
    treeId: 'TR-789012-DEF',
    images: [
      'https://images.unsplash.com/photo-1590086783191-a0694c7d1e6e?w=400&h=300&fit=crop',
    ],
  },
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

export default function FarmerTreeDetailScreen() {
  const { id } = useLocalSearchParams();
  const tree = TREES_DATA.find(t => t.id === id);

  if (!tree) {
    return (
      <View style={styles.container}>
        <Text>Ağaç bulunamadı</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Surface style={styles.header} elevation={4}>
          <View style={styles.headerContent}>
            <IconButton 
              icon="arrow-left" 
              onPress={() => router.back()} 
              iconColor="#fff"
              style={styles.backButton}
            />
            <View style={styles.headerText}>
              <Text style={styles.title}>Ağaç Detayları</Text>
              <Text style={styles.subtitle}>{tree.name}</Text>
            </View>
          </View>
        </Surface>

        <View style={styles.content}>
          {/* Ana Görsel */}
          <Surface style={styles.imageSection} elevation={2}>
            <Image source={{ uri: tree.imageUrl }} style={styles.mainImage} resizeMode="cover" />
            <View style={styles.imageOverlay}>
              <Chip
                style={[styles.statusChip, { backgroundColor: getStatusColor(tree.status) }]}
                textStyle={styles.statusText}
              >
                {getStatusText(tree.status)}
              </Chip>
            </View>
          </Surface>

          {/* Temel Bilgiler */}
          <Surface style={styles.section} elevation={2}>
            <Text style={styles.sectionTitle}>Temel Bilgiler</Text>
            
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <MaterialCommunityIcons name="tree" size={20} color="#2E7D32" />
                <Text style={styles.infoLabel}>Tür</Text>
                <Text style={styles.infoValue}>{tree.type}</Text>
              </View>
              
              <View style={styles.infoItem}>
                <MaterialCommunityIcons name="calendar" size={20} color="#2E7D32" />
                <Text style={styles.infoLabel}>Yaş</Text>
                <Text style={styles.infoValue}>{tree.age} yıl</Text>
              </View>
              
              <View style={styles.infoItem}>
                <MaterialCommunityIcons name="heart" size={20} color="#2E7D32" />
                <Text style={styles.infoLabel}>Sağlık</Text>
                <Text style={styles.infoValue}>{tree.health}%</Text>
              </View>
              
              <View style={styles.infoItem}>
                <MaterialCommunityIcons name="flower" size={20} color="#2E7D32" />
                <Text style={styles.infoLabel}>Bahçe</Text>
                <Text style={styles.infoValue}>{tree.garden}</Text>
              </View>
            </View>
          </Surface>

          {/* Hasat Bilgileri */}
          <Surface style={styles.section} elevation={2}>
            <Text style={styles.sectionTitle}>Hasat Bilgileri</Text>
            
            <View style={styles.harvestGrid}>
              <View style={styles.harvestItem}>
                <MaterialCommunityIcons name="scale" size={20} color="#2E7D32" />
                <Text style={styles.harvestLabel}>Son Hasat</Text>
                <Text style={styles.harvestValue}>{tree.lastHarvest}</Text>
              </View>
              
              <View style={styles.harvestItem}>
                <MaterialCommunityIcons name="calendar-clock" size={20} color="#2E7D32" />
                <Text style={styles.harvestLabel}>Sonraki Hasat</Text>
                <Text style={styles.harvestValue}>{tree.nextHarvest}</Text>
              </View>
              
              <View style={styles.harvestItem}>
                <MaterialCommunityIcons name="target" size={20} color="#2E7D32" />
                <Text style={styles.harvestLabel}>Hedef Hasat</Text>
                <Text style={styles.harvestValue}>{tree.expectedHarvest}</Text>
              </View>
              
              <View style={styles.harvestItem}>
                <MaterialCommunityIcons name="currency-try" size={20} color="#2E7D32" />
                <Text style={styles.harvestLabel}>Yıllık Kira</Text>
                <Text style={styles.harvestValue}>{tree.rentalPrice} ₺</Text>
              </View>
            </View>
          </Surface>

          {/* Teknik Bilgiler */}
          <Surface style={styles.section} elevation={2}>
            <Text style={styles.sectionTitle}>Teknik Bilgiler</Text>
            
            <View style={styles.techGrid}>
              <View style={styles.techItem}>
                <MaterialCommunityIcons name="qrcode" size={20} color="#2E7D32" />
                <Text style={styles.techLabel}>Ağaç ID</Text>
                <Text style={styles.techValue}>{tree.treeId}</Text>
              </View>
              
              <View style={styles.techItem}>
                <MaterialCommunityIcons name="credit-card" size={20} color="#2E7D32" />
                <Text style={styles.techLabel}>RFID Kodu</Text>
                <Text style={styles.techValue}>{tree.rfidCode}</Text>
              </View>
              
              <View style={styles.techItem}>
                <MaterialCommunityIcons name="map-marker" size={20} color="#2E7D32" />
                <Text style={styles.techLabel}>Konum</Text>
                <Text style={styles.techValue}>{tree.location.latitude}, {tree.location.longitude}</Text>
              </View>
            </View>
          </Surface>

          {/* Açıklama */}
          {tree.description && (
            <Surface style={styles.section} elevation={2}>
              <Text style={styles.sectionTitle}>Açıklama</Text>
              <Text style={styles.descriptionText}>{tree.description}</Text>
            </Surface>
          )}

          {/* Ağaç Hikayesi */}
          {tree.story && (
            <Surface style={styles.section} elevation={2}>
              <Text style={styles.sectionTitle}>🌳 Ağaç Hikayesi</Text>
              <Text style={styles.storyText}>{tree.story}</Text>
            </Surface>
          )}

          {/* Fotoğraf Galerisi */}
          {tree.images && tree.images.length > 0 && (
            <Surface style={styles.section} elevation={2}>
              <Text style={styles.sectionTitle}>Fotoğraflar</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageGallery}>
                {tree.images.map((image, index) => (
                  <Image key={index} source={{ uri: image }} style={styles.galleryImage} resizeMode="cover" />
                ))}
              </ScrollView>
            </Surface>
          )}

          {/* Aksiyon Butonları */}
          <View style={styles.actionButtons}>
            <Button
              mode="outlined"
              onPress={() => router.push(`/farmer/trees/${tree.id}/edit` as any)}
              style={styles.actionBtn}
              textColor="#2E7D32"
              icon="pencil"
            >
              Düzenle
            </Button>
            
            <Button
              mode="contained"
              onPress={() => router.push(`/farmer/trees/${tree.id}/blockchain` as any)}
              style={styles.actionBtn}
              buttonColor="#2E7D32"
              textColor='#fff'
            >
              Blockchain
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAF8',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#2E7D32',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  content: {
    padding: 16,
  },
  imageSection: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  mainImage: {
    width: '100%',
    height: 250,
  },
  imageOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  statusChip: {
    borderRadius: 12,
    height: 32,
    paddingHorizontal: 12,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B4332',
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  infoItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8FAF8',
    borderRadius: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B4332',
  },
  harvestGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  harvestItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
  },
  harvestLabel: {
    fontSize: 12,
    color: '#2E7D32',
    marginTop: 4,
    marginBottom: 2,
    fontWeight: '500',
  },
  harvestValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B4332',
  },
  techGrid: {
    gap: 12,
  },
  techItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },
  techLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
    flex: 1,
  },
  techValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1B4332',
    fontFamily: 'monospace',
  },
  descriptionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  storyText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  imageGallery: {
    marginTop: 8,
  },
  galleryImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginRight: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 32,
  },
  actionBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 8,
  },
}); 