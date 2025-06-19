import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { Text, Surface, Button, Chip, Divider, IconButton } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';

// Demo veri
const GARDEN = {
  id: '1',
  name: 'Ayvalık Zeytinliği',
  location: 'Ayvalık, Balıkesir',
  coordinates: { latitude: 39.309196, longitude: 26.685394 },
  area: '25 dönüm',
  treeCount: 150,
  treeTypes: ['Zeytin'],
  images: [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80',
  ],
  description: 'Ayvalık\'ın verimli topraklarında, organik tarım ilkeleriyle yönetilen zeytinlik.',
  features: ['Damla Sulama Sistemi', 'Organik Tarım', 'RFID Takip', 'Düzenli İlaçlama'],
  status: 'Aktif',
  totalIncome: '45.000₺',
  lastYearIncome: '12.000₺',
  maintenanceHistory: [
    { date: '2024-03-01', type: 'Sulama', note: 'Damlama sistemi kontrol edildi.' },
    { date: '2024-02-15', type: 'Gübreleme', note: 'Organik gübre uygulandı.' },
    { date: '2024-01-20', type: 'Budama', note: 'Kış budaması yapıldı.' },
  ],
  treeStats: {
    healthy: 140,
    maintenance: 8,
    disease: 2,
  },
};

const { width } = Dimensions.get('window');

export default function FarmerGardenDetailScreen() {
  const { id } = useLocalSearchParams();
  // Gerçek uygulamada id ile veri çekilecek
  const garden = GARDEN;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Başlık ve galeri */}
        <Surface style={styles.header} elevation={4}>
          <View style={styles.headerContent}>
            <IconButton 
              icon="arrow-left" 
              onPress={() => router.push('/farmer/gardens' as any)} 
              style={styles.backBtn}
              iconColor="#fff"
            />
            <MaterialCommunityIcons name="flower" size={28} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.headerTitle}>{garden.name}</Text>
          </View>
          <Text style={styles.headerSubtitle}>{garden.location} • {garden.area}</Text>
        </Surface>
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.gallery}>
          {garden.images.map((img, idx) => (
            <Image key={idx} source={{ uri: img }} style={styles.galleryImage} />
          ))}
        </ScrollView>

        {/* Gelir ve istatistikler */}
        <View style={styles.statsRow}>
          <Surface style={styles.statBox} elevation={2}>
            <Text style={styles.statLabel}>Toplam Gelir</Text>
            <Text style={styles.statValue}>{garden.totalIncome}</Text>
          </Surface>
          <Surface style={styles.statBox} elevation={2}>
            <Text style={styles.statLabel}>Geçen Yıl</Text>
            <Text style={styles.statValue}>{garden.lastYearIncome}</Text>
          </Surface>
          <Surface style={styles.statBox} elevation={2}>
            <Text style={styles.statLabel}>Ağaç</Text>
            <Text style={styles.statValue}>{garden.treeCount}</Text>
          </Surface>
        </View>

        {/* Ağaç sağlık istatistikleri (grafik yerine chip) */}
        <View style={styles.treeStatsRow}>
          <Chip style={[styles.treeStatChip, { backgroundColor: '#4CAF50' }]} textStyle={{ color: '#000' }}>Sağlıklı: {garden.treeStats.healthy}</Chip>
          <Chip style={[styles.treeStatChip, { backgroundColor: '#FFC107' }]} textStyle={{ color: '#000' }}>Bakım: {garden.treeStats.maintenance}</Chip>
          <Chip style={[styles.treeStatChip, { backgroundColor: '#BBDEFB' }]} textStyle={{ color: '#000' }}>Hastalık: {garden.treeStats.disease}</Chip>
        </View>

        {/* Açıklama ve özellikler */}
        <Surface style={styles.section} elevation={2}>
          <Text style={styles.sectionTitle}>Bahçe Açıklaması</Text>
          <Text style={styles.description}>{garden.description}</Text>
          <View style={styles.featuresRow}>
            {garden.features.filter(f => f !== 'RFID Takip').map((f, i) => (
              <Chip key={i} style={styles.featureChip} textStyle={{ color: '#000' }}>{f}</Chip>
            ))}
          </View>
        </Surface>

        {/* Bakım geçmişi */}
        <Surface style={styles.section} elevation={2}>
          <Text style={styles.sectionTitle}>Bakım Geçmişi</Text>
          {garden.maintenanceHistory.map((m, i) => (
            <View key={i} style={styles.maintenanceRow}>
              <MaterialCommunityIcons name="calendar" size={18} color="#2E7D32" style={{ marginRight: 6 }} />
              <Text style={styles.maintenanceDate}>{m.date}</Text>
              <Text style={styles.maintenanceType}>{m.type}</Text>
              <Text style={styles.maintenanceNote}>{m.note}</Text>
            </View>
          ))}
        </Surface>

        {/* Harita */}
        <Surface style={styles.section} elevation={2}>
          <Text style={styles.sectionTitle}>Konum</Text>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: garden.coordinates.latitude,
              longitude: garden.coordinates.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
            pitchEnabled={false}
            rotateEnabled={false}
            pointerEvents="none"
          >
            <Marker coordinate={garden.coordinates} pinColor="#2E7D32" />
          </MapView>
        </Surface>

        {/* Yönetim butonları */}
        <View style={styles.actionRow}>
          <Button
            mode="contained"
            style={styles.actionBtn}
            buttonColor="#2E7D32"
            textColor="#fff"
            onPress={() => router.push(`/farmer/gardens/edit/${garden.id}` as any)}
          >
            Düzenle
          </Button>
          <Button
            mode="outlined"
            style={styles.actionBtn}
            textColor="#F44336"
            onPress={() => {/* Silme işlemi */}}
          >
            Sil
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7F3' },
  header: { backgroundColor: '#2E7D32', paddingTop: 40, paddingBottom: 20, paddingHorizontal: 16, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, marginBottom: 8 },
  headerContent: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, justifyContent: 'center' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  headerSubtitle: { color: '#fff', opacity: 0.9, fontSize: 14, textAlign: 'center' },
  backBtn: { position: 'absolute', left: 0, top: 0, zIndex: 2, backgroundColor: 'transparent' },
  gallery: { height: 180, marginBottom: 12 },
  galleryImage: { width: width - 32, height: 180, borderRadius: 16, marginRight: 12 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, marginBottom: 12, paddingHorizontal: 8 },
  statBox: { flex: 1, backgroundColor: '#fff', borderRadius: 12, alignItems: 'center', padding: 12 },
  statLabel: { fontSize: 12, color: '#666', marginBottom: 2 },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#1B4332' },
  treeStatsRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 12 },
  treeStatChip: { height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 13 },
  section: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1B4332', marginBottom: 12 },
  description: { fontSize: 14, color: '#333', marginBottom: 8 },
  featuresRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  featureChip: { backgroundColor: '#E8F5E9', marginBottom: 4 },
  maintenanceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' },
  maintenanceDate: { fontSize: 13, color: '#2E7D32', marginRight: 8 },
  maintenanceType: { fontSize: 13, color: '#666', marginRight: 8, fontWeight: 'bold' },
  maintenanceNote: { fontSize: 13, color: '#333' },
  map: { width: '100%', height: 140, borderRadius: 12, marginTop: 8 },
  actionRow: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginVertical: 24 },
  actionBtn: { flex: 1, borderRadius: 12, paddingVertical: 8 },
}); 