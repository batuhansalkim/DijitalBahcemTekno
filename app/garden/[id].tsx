import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, ImageBackground, Image, ActivityIndicator } from 'react-native';
import { Text, Surface, IconButton, Button, Card, Chip, SegmentedButtons, Divider } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Tip tanımlamaları
interface Tree {
  id: string;
  type: string;
  age: number;
  status: 'Kiralanabilir' | 'Kiralandı';
  health: number;
  lastHarvest: string;
  price: string;
}

interface Farmer {
  id: string;
  name: string;
  avatar: string;
  experience: string;
}

interface Garden {
  id: string;
  name: string;
  location: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  area: string;
  treeCount: number;
  treeTypes: string[];
  images: string[];
  description: string;
  features: string[];
  trees: Tree[];
  farmer: Farmer;
  status: 'Kiralanabilir' | 'Kiralandı';
  price: string;
}

interface Gardens {
  [key: string]: Garden;
}

// API simülasyonu
const API = {
  gardens: {
    'g1': {
      id: 'g1',
      name: 'Ayvalık Zeytinliği',
      location: 'Ayvalık, Balıkesir',
      coordinates: {
        latitude: 39.309196,
        longitude: 26.685394,
      },
      area: '25 dönüm',
      treeCount: 150,
      treeTypes: ['Zeytin'],
      images: [
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80',
      ],
      description: 'Ayvalık\'ın verimli topraklarında yer alan zeytinliğimiz, organik tarım ilkeleriyle işletilmektedir. Modern sulama sistemleri ve düzenli bakım ile ağaçlarımız en iyi şekilde yetiştirilmektedir.',
      features: [
        'Damla Sulama Sistemi',
        'Organik Tarım',
        'RFID Takip',
        'Düzenli İlaçlama',
      ],
      trees: [
        {
          id: 't1',
          type: 'Zeytin',
          age: 25,
          status: 'Kiralanabilir',
          health: 95,
          lastHarvest: '350 kg',
          price: '1.200₺',
        },
        {
          id: 't2',
          type: 'Zeytin',
          age: 30,
          status: 'Kiralandı',
          health: 92,
          lastHarvest: '380 kg',
          price: '1.300₺',
        },
      ],
      farmer: {
        id: 'f1',
        name: 'Ahmet Çiftçi',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
        experience: '15 yıl',
      },
      status: 'Kiralanabilir',
      price: '1.200₺',
    },
    'g2': {
      id: 'g2',
      name: 'Finike Portakal Bahçesi',
      location: 'Finike, Antalya',
      coordinates: {
        latitude: 36.297970,
        longitude: 30.144552,
      },
      area: '15 dönüm',
      treeCount: 200,
      treeTypes: ['Portakal', 'Mandalina'],
      images: [
        'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=800&q=80',
      ],
      description: 'Finike\'nin güneşli ikliminde yetişen portakal ve mandalina ağaçlarımız, yüksek C vitamini içeriğiyle ünlü Finike portakalları üretmektedir. Modern tarım teknikleri ve özenli bakım ile bahçemiz yıl boyu verimli bir şekilde işletilmektedir.',
      features: [
        'Otomatik Sulama',
        'Doğal Gübreleme',
        'Dijital Takip',
        'Düzenli İlaçlama',
      ],
      trees: [
        {
          id: 't3',
          type: 'Portakal',
          age: 15,
          status: 'Kiralanabilir',
          health: 98,
          lastHarvest: '280 kg',
          price: '1.500₺',
        },
        {
          id: 't4',
          type: 'Mandalina',
          age: 12,
          status: 'Kiralanabilir',
          health: 96,
          lastHarvest: '220 kg',
          price: '1.300₺',
        },
      ],
      farmer: {
        id: 'f2',
        name: 'Mehmet Yılmaz',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
        experience: '20 yıl',
      },
      status: 'Kiralanabilir',
      price: '1.500₺',
    },
  } as Gardens,
  getGarden: async (id: string): Promise<Garden | null> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return API.gardens[id] || null;
  }
};

export default function GardenDetailScreen() {
  const { id } = useLocalSearchParams();
  const [viewMode, setViewMode] = useState('all');
  const [garden, setGarden] = useState<Garden | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGardenData();
  }, [id]);

  const loadGardenData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await API.getGarden(id as string);
      if (!data) {
        setError('Bahçe bulunamadı');
        return;
      }
      setGarden(data);
    } catch (err) {
      setError('Bahçe bilgileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2D6A4F" />
        <Text style={styles.loadingText}>Bahçe bilgileri yükleniyor...</Text>
      </View>
    );
  }

  if (error || !garden) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons name="alert-circle" size={48} color="#FF5252" />
        <Text style={styles.errorText}>{error}</Text>
        <Button 
          mode="contained" 
          onPress={() => router.back()}
          style={styles.errorButton}
        >
          Geri Dön
        </Button>
      </View>
    );
  }

  const filteredTrees = garden.trees.filter((tree: Tree) => {
    if (viewMode === 'available') return tree.status === 'Kiralanabilir';
    if (viewMode === 'rented') return tree.status === 'Kiralandı';
    return true;
  });

  const renderTree = (tree: Tree) => (
    <Card style={styles.treeCard}>
      <Card.Content>
        <View style={styles.treeHeader}>
          <View>
            <Text style={styles.treeType}>{tree.type}</Text>
            <Text style={styles.treeAge}>{tree.age} yaşında</Text>
          </View>
          <Chip
            style={[
              styles.statusChip,
              tree.status === 'Kiralanabilir' ? styles.availableChip : styles.rentedChip
            ]}
            textStyle={styles.statusChipText}
          >
            {tree.status}
          </Chip>
        </View>

        <View style={styles.treeDetails}>
          <View style={styles.treeDetail}>
            <MaterialCommunityIcons name="heart-pulse" size={20} color="#FFFFFF" />
            <Text style={styles.detailValue}>%{tree.health}</Text>
            <Text style={styles.detailLabel}>Sağlık</Text>
          </View>
          <View style={styles.treeDetail}>
            <MaterialCommunityIcons name="fruit-cherries" size={20} color="#FFFFFF" />
            <Text style={styles.detailValue}>{tree.lastHarvest}</Text>
            <Text style={styles.detailLabel}>Son Hasat</Text>
          </View>
          <View style={styles.treeDetail}>
            <MaterialCommunityIcons name="currency-try" size={20} color="#FFFFFF" />
            <Text style={styles.detailValue}>{tree.price}</Text>
            <Text style={styles.detailLabel}>Yıllık</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* 1. Şık başlık kartı ve ikon */}
        <View style={styles.titleCard}>
          <MaterialCommunityIcons
            name={garden.treeTypes.includes('Portakal') ? 'fruit-citrus' : garden.treeTypes.includes('Zeytin') ? 'leaf' : 'leaf'}
            size={28}
            color={garden.treeTypes.includes('Portakal') ? '#FFA726' : '#43a047'}
            style={{ marginRight: 8 }}
          />
          <Text style={styles.gardenNameCentered}>{garden.name}</Text>
        </View>
        <View style={styles.titleUnderline} />

        {/* 2. Galeri ve Kiralanabilir Chip */}
        <View style={styles.galleryWrapper}>
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.galleryContainer}>
            {garden.images.map((img, idx) => (
              <Image key={idx} source={{ uri: img }} style={styles.galleryImage} />
            ))}
          </ScrollView>
          <Chip style={[styles.statusChip, garden.status === 'Kiralanabilir' ? styles.availableChip : styles.rentedChip]}>
            {garden.status || 'Kiralanabilir'}
          </Chip>
        </View>

        {/* 3. Kısa Bilgiler */}
        <View style={styles.quickInfoRow}>
          <View style={styles.quickInfoItem}>
            <MaterialCommunityIcons name="map-marker" size={20} color="#2D6A4F" />
            <Text style={styles.quickInfoText}>{garden.location}</Text>
          </View>
          <View style={styles.quickInfoItem}>
            <MaterialCommunityIcons name="ruler" size={20} color="#2D6A4F" />
            <Text style={styles.quickInfoText}>{garden.area}</Text>
          </View>
          <View style={styles.quickInfoItem}>
            <MaterialCommunityIcons name="leaf" size={20} color="#2D6A4F" />
            <Text style={styles.quickInfoText}>{garden.treeTypes.length} Tür</Text>
          </View>
        </View>

        {/* 4. Açıklama ve Özellikler */}
        <Surface style={styles.contentCard} elevation={2}>
          <Text style={styles.sectionTitle}>Bahçe Hakkında</Text>
          <Text style={styles.description}>{garden.description}</Text>
          <View style={styles.featuresContainer}>
            {garden.features.map((feature, idx) => (
              <Chip key={idx} style={styles.featureChip}>{feature}</Chip>
            ))}
          </View>
        </Surface>

        {/* 5. Yetiştirilebilecek Ürünler */}
        <Surface style={styles.contentCard} elevation={2}>
          <Text style={styles.sectionTitle}>Bu Bahçede Yetiştirilebilecekler</Text>
          <View style={styles.suggestedProductsContainer}>
            {garden.treeTypes.map((type, idx) => (
              <Chip key={idx} style={styles.suggestedProductChip}>{type}</Chip>
            ))}
          </View>
        </Surface>

        {/* 6. Bahçe Sahibi */}
        <Surface style={styles.contentCard} elevation={2}>
          <Text style={styles.sectionTitle}>Bahçe Sahibi</Text>
          <View style={styles.farmerContainer}>
            <Image source={{ uri: garden.farmer.avatar }} style={styles.farmerAvatar} />
            <View style={styles.farmerInfo}>
              <Text style={styles.farmerName}>{garden.farmer.name}</Text>
              <Text style={styles.farmerExperience}>{garden.farmer.experience} deneyim</Text>
            </View>
            <Button
              mode="outlined"
              onPress={() => router.push({ pathname: '/farmer/[id]', params: { id: garden.farmer.id } })}
              style={styles.farmerButton}
              labelStyle={styles.farmerButtonLabel}
            >
              Mesaj Gönder
            </Button>
          </View>
        </Surface>

        {/* 7. Harita */}
        <Surface style={styles.contentCard} elevation={2}>
          <Text style={styles.sectionTitle}>Konum</Text>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: garden.coordinates.latitude,
                longitude: garden.coordinates.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={garden.coordinates}
                title={garden.name}
                description={garden.location}
              />
            </MapView>
          </View>
        </Surface>
      </ScrollView>
      <View style={styles.bottomBar}>
        <Text style={styles.bottomBarPrice}>{garden.price || 'Fiyat Bilgisi Yok'}</Text>
        
        <Button
          mode="contained"
          style={styles.bottomBarButton}
          labelStyle={styles.bottomBarButtonLabel}
          onPress={() => { /* Kiralama akışı */ }}
          disabled={garden.status !== 'Kiralanabilir'}
        >
          Bahçeyi Kirala
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F3',
  },
  galleryContainer: {
    height: 200,
    marginBottom: 16,
  },
  galleryImage: {
    width: Dimensions.get('window').width,
    height: '100%',
    resizeMode: 'cover',
  },
  headerInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  gardenName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1B4332',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    color: '#40916C',
    marginLeft: 4,
  },
  statusPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availableChip: {
    backgroundColor: '#43a047',
    borderWidth: 0,
  },
  rentedChip: {
    backgroundColor: '#ff7043',
    borderWidth: 0,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D6A4F',
    marginLeft: 8,
  },
  rentButton: {
    backgroundColor: '#2D6A4F',
    marginTop: 16,
    marginBottom: 16,
  },
  rentButtonLabel: {
    color: '#FFF',
  },
  contentCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#FFF',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B4332',
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#40916C',
    marginBottom: 16,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureChip: {
    backgroundColor: 'black',
    marginRight: 6,
    marginBottom: 6,
    
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  farmerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAF7',
    padding: 16,
    borderRadius: 12,
  },
  farmerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  farmerInfo: {
    flex: 1,
  },
  farmerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B4332',
  },
  farmerExperience: {
    fontSize: 14,
    color: '#40916C',
  },
  farmerButton: {
    borderColor: '#2D6A4F',
  },
  farmerButtonLabel: {
    color: '#2D6A4F',
  },
  treeCard: {
    backgroundColor: '#2D6A4F',
    borderRadius: 12,
  },
  treeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  treeType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  treeAge: {
    fontSize: 14,
    color: '#E8F0E3',
    marginTop: 2,
  },
  treeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1B4332',
    padding: 12,
    borderRadius: 8,
  },
  treeDetail: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#E8F0E3',
    marginTop: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  suggestedProductsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestedProductChip: {
    backgroundColor: 'black',
    marginRight: 6,
    marginBottom: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7F3',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#2D6A4F',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7F3',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#FF5252',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorButton: {
    backgroundColor: '#2D6A4F',
  },
  gardenNameCentered: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1B4332',
    marginBottom: 8,
    textAlign: 'center',
  },
  galleryWrapper: {
    position: 'relative',
  },
  statusChip: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#2D6A4F',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    elevation: 2,
  },
  statusChipText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  quickInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 12,
  },
  quickInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7F3',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginHorizontal: 4,
  },
  quickInfoText: {
    fontSize: 14,
    color: '#1B4332',
    marginLeft: 4,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderColor: '#E8F0E3',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  bottomBarPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D6A4F',
  },
  bottomBarButton: {
    backgroundColor: '#2D6A4F',
    borderRadius: 6,
    paddingHorizontal: 18,
    paddingVertical: 8,
    elevation: 0,
  },
  bottomBarButtonLabel: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  titleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  titleUnderline: {
    height: 2,
    backgroundColor: '#E8F0E3',
    marginVertical: 8,
  },
}); 