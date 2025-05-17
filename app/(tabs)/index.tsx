import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, Card, Button, ProgressBar, IconButton, Avatar, Chip } from 'react-native-paper';
import { router } from 'expo-router';

// Örnek kullanıcı verileri
const USER_DATA = {
  name: 'Mehmet',
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
    category: 'Meyve Ağacı',
    harvestTime: 'Kasım - Şubat',
    type: 'tree',
  },
  {
    id: '4',
    name: 'Fındık Ağacı',
    location: 'Giresun',
    price: '800₺',
    image: 'https://images.unsplash.com/photo-1509983165097-0c31a863e3f3',
    rating: 4.5,
    category: 'Kuruyemiş',
    harvestTime: 'Ağustos - Eylül',
    type: 'tree',
  },
];

const FEATURED_GARDENS = [
  {
    id: '5',
    name: 'Ege Bahçesi',
    location: 'İzmir, Urla',
    price: '2500₺',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae',
    rating: 4.9,
    category: 'Zeytin Bahçesi',
    size: '2 Dönüm',
    type: 'garden',
  },
  {
    id: '6',
    name: 'Akdeniz Bahçesi',
    location: 'Antalya, Finike',
    price: '3000₺',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae',
    rating: 4.7,
    category: 'Narenciye Bahçesi',
    size: '3 Dönüm',
    type: 'garden',
  },
];

const CATEGORIES = [
  {
    id: '1',
    name: 'Meyve Ağaçları',
    icon: 'fruit-cherries',
    color: '#E8F3E8',
  },
  {
    id: '2',
    name: 'Zeytin Ağaçları',
    icon: 'olive',
    color: '#F0F7F0',
  },
  {
    id: '3',
    name: 'Kuruyemiş',
    icon: 'nut',
    color: '#E8F3E8',
  },
  {
    id: '4',
    name: 'Narenciye',
    icon: 'fruit-citrus',
    color: '#F0F7F0',
  },
];

const RENTAL_OPTIONS = [
  {
    id: '1',
    title: 'Ağaç Kirala',
    description: 'Kendi ağacınızı seçin, hasadınızı alın',
    icon: 'tree',
    color: '#E8F3E8',
    route: '/explore',
  },
  {
    id: '2',
    title: 'Bahçe Kirala',
    description: 'Özel bahçenizi oluşturun',
    icon: 'flower',
    color: '#F0F7F0',
    route: '/gardens',
  },
];

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Hoşgeldin Kartı */}
      <Surface style={styles.welcomeCard} elevation={2}>
        <View style={styles.welcomeHeader}>
          <View style={styles.welcomeTextContainer}>
            <Text style={styles.welcomeText}>Hoş Geldiniz</Text>
            <Text style={styles.userName}>{USER_DATA.name}</Text>
            <Text style={styles.welcomeSubtext}>Sürdürülebilir tarımın bir parçası olun, kendi ağacınızı veya bahçenizi kiralayın</Text>
          </View>
          <View style={styles.welcomeImageContainer}>
            <IconButton
              icon="tree"
              size={40}
              iconColor="#2E7D32"
              style={styles.welcomeIcon}
            />
          </View>
        </View>
      </Surface>

      {/* Kiralama Seçenekleri */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kiralama Seçenekleri</Text>
        <View style={styles.rentalOptionsGrid}>
          {RENTAL_OPTIONS.map(option => (
            <Card
              key={option.id}
              style={[styles.rentalOptionCard, { backgroundColor: option.color }]}
              onPress={() => router.push(option.route)}
            >
              <Card.Content style={styles.rentalOptionContent}>
                <IconButton
                  icon={option.icon}
                  size={40}
                  iconColor="#2E7D32"
                  style={styles.rentalOptionIcon}
                />
                <Text style={styles.rentalOptionTitle}>{option.title}</Text>
                <Text style={styles.rentalOptionDescription}>{option.description}</Text>
                <Button 
                  mode="contained" 
                  style={styles.rentalOptionButton}
                  onPress={() => router.push(option.route)}
                >
                  Keşfet
                </Button>
              </Card.Content>
            </Card>
          ))}
        </View>
      </View>

      {/* Kategoriler */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kategoriler</Text>
        <View style={styles.categoriesGrid}>
          {CATEGORIES.map(category => (
            <Card
              key={category.id}
              style={[styles.categoryCard, { backgroundColor: category.color }]}
              onPress={() => router.push({
                pathname: '/explore' as const,
                params: { category: category.id }
              })}
            >
              <Card.Content style={styles.categoryContent}>
                <IconButton
                  icon={category.icon}
                  size={32}
                  iconColor="#2E7D32"
                  style={styles.categoryIcon}
                />
                <Text style={styles.categoryName}>{category.name}</Text>
              </Card.Content>
            </Card>
          ))}
        </View>
      </View>

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
            style={styles.seeAllButton}
            labelStyle={styles.seeAllButtonLabel}
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
              <View style={styles.featuredOverlay}>
                <View style={styles.featuredCategory}>
                  <Text style={styles.featuredCategoryText}>{tree.category}</Text>
                </View>
              </View>
              <Card.Content style={styles.featuredContent}>
                <View style={styles.featuredHeader}>
                  <View>
                    <Text style={styles.featuredName}>{tree.name}</Text>
                    <Text style={styles.featuredLocation}>{tree.location}</Text>
                  </View>
                  <View style={styles.ratingContainer}>
                    <IconButton icon="star" size={16} iconColor="#FFD700" />
                    <Text style={styles.rating}>{tree.rating}</Text>
                  </View>
                </View>
                <View style={styles.featuredInfo}>
                  <View style={styles.featuredInfoItem}>
                    <IconButton icon="calendar" size={16} iconColor="#2E7D32" />
                    <Text style={styles.featuredInfoText}>{tree.harvestTime}</Text>
                  </View>
                  <Text style={styles.featuredPrice}>{tree.price}/yıl</Text>
                </View>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      </View>

      {/* Öne Çıkan Bahçeler */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Öne Çıkan Bahçeler</Text>
          <Button 
            mode="text" 
            onPress={() => router.push('/gardens')}
            style={styles.seeAllButton}
            labelStyle={styles.seeAllButtonLabel}
          >
            Tümünü Gör
          </Button>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.featuredScroll}
        >
          {FEATURED_GARDENS.map(garden => (
            <Card
              key={garden.id}
              style={styles.featuredCard}
              onPress={() => router.push({
                pathname: '/garden/[id]' as const,
                params: { id: garden.id }
              })}
            >
              <Card.Cover source={{ uri: garden.image }} style={styles.featuredImage} />
              <View style={styles.featuredOverlay}>
                <View style={styles.featuredCategory}>
                  <Text style={styles.featuredCategoryText}>{garden.category}</Text>
                </View>
              </View>
              <Card.Content style={styles.featuredContent}>
                <View style={styles.featuredHeader}>
                  <View>
                    <Text style={styles.featuredName}>{garden.name}</Text>
                    <Text style={styles.featuredLocation}>{garden.location}</Text>
                  </View>
                  <View style={styles.ratingContainer}>
                    <IconButton icon="star" size={16} iconColor="#FFD700" />
                    <Text style={styles.rating}>{garden.rating}</Text>
                  </View>
                </View>
                <View style={styles.featuredInfo}>
                  <View style={styles.featuredInfoItem}>
                    <IconButton icon="ruler" size={16} iconColor="#2E7D32" />
                    <Text style={styles.featuredInfoText}>{garden.size}</Text>
                  </View>
                  <Text style={styles.featuredPrice}>{garden.price}/yıl</Text>
                </View>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      </View>

      {/* Bilgilendirme Banner */}
      <View style={styles.section}>
        <Card style={styles.infoBanner}>
          <Card.Content style={styles.infoBannerContent}>
            <View style={styles.infoBannerTextContainer}>
              <Text style={styles.infoBannerTitle}>Dijital Bahçe ile Tanışın</Text>
              <Text style={styles.infoBannerText}>
                Sürdürülebilir tarımın bir parçası olun. Tek bir ağaç veya tüm bir bahçe kiralayarak kendi ürünlerinizi yetiştirin.
              </Text>
            </View>
            <Button 
              mode="contained" 
              style={styles.infoBannerButton}
              onPress={() => router.push('/explore')}
            >
              Keşfet
            </Button>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8F5',
  },
  welcomeCard: {
    margin: 20,
    padding: 28,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    shadowColor: "#2E7D32",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(46, 125, 50, 0.08)',
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeTextContainer: {
    flex: 1,
    marginRight: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: '500',
    letterSpacing: 0.3,
    opacity: 0.9,
    marginBottom: 8,
  },
  userName: {
    fontSize: 34,
    fontWeight: '700',
    color: '#0A3D0A',
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  welcomeSubtext: {
    fontSize: 15,
    color: '#2E7D32',
    lineHeight: 22,
    opacity: 0.8,
    letterSpacing: 0.2,
  },
  welcomeImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F8F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(46, 125, 50, 0.08)',
  },
  welcomeIcon: {
    margin: 0,
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0A3D0A',
    letterSpacing: -0.5,
  },
  seeAllButton: {
    marginLeft: 'auto',
  },
  seeAllButtonLabel: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '600',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
    marginTop: 8,
  },
  categoryCard: {
    width: '45%',
    margin: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(46, 125, 50, 0.08)',
  },
  categoryContent: {
    padding: 16,
    alignItems: 'center',
  },
  categoryIcon: {
    margin: 0,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0A3D0A',
    textAlign: 'center',
  },
  featuredScroll: {
    marginLeft: -20,
    paddingLeft: 20,
    paddingBottom: 16,
  },
  featuredCard: {
    width: 300,
    marginRight: 20,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: "#2E7D32",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(46, 125, 50, 0.08)',
  },
  featuredImage: {
    height: 200,
  },
  featuredOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
  featuredCategory: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(46, 125, 50, 0.1)',
  },
  featuredCategoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2E7D32',
  },
  featuredContent: {
    padding: 20,
  },
  featuredHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  featuredName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0A3D0A',
    letterSpacing: -0.5,
  },
  featuredLocation: {
    fontSize: 14,
    color: '#2E7D32',
    marginTop: 4,
    fontWeight: '500',
    letterSpacing: 0.2,
    opacity: 0.9,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F8F5',
    padding: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(46, 125, 50, 0.08)',
  },
  rating: {
    fontSize: 15,
    fontWeight: '700',
    marginLeft: -4,
    color: '#0A3D0A',
    letterSpacing: -0.3,
  },
  featuredInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(46, 125, 50, 0.08)',
  },
  featuredInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredInfoText: {
    fontSize: 14,
    color: '#2E7D32',
    marginLeft: -8,
    fontWeight: '500',
  },
  featuredPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0A3D0A',
    letterSpacing: -0.5,
  },
  infoBanner: {
    marginBottom: 20,
    borderRadius: 24,
    backgroundColor: '#E8F3E8',
    borderWidth: 1,
    borderColor: 'rgba(46, 125, 50, 0.08)',
  },
  infoBannerContent: {
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoBannerTextContainer: {
    flex: 1,
    marginRight: 20,
  },
  infoBannerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0A3D0A',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  infoBannerText: {
    fontSize: 15,
    color: '#2E7D32',
    lineHeight: 22,
    opacity: 0.9,
  },
  infoBannerButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    paddingHorizontal: 20,
  },
  treeCard: {
    marginBottom: 28,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: "#2E7D32",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(46, 125, 50, 0.08)',
  },
  treeImage: {
    height: 260,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  treeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 24,
    marginBottom: 28,
    paddingHorizontal: 24,
  },
  treeName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0A3D0A',
    letterSpacing: -0.5,
  },
  treeLocation: {
    fontSize: 14,
    color: '#2E7D32',
    marginTop: 8,
    fontWeight: '500',
    letterSpacing: 0.2,
    opacity: 0.9,
  },
  farmerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F8F5',
    padding: 12,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(46, 125, 50, 0.08)',
  },
  farmerAvatar: {
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  farmerName: {
    fontSize: 13,
    color: '#0A3D0A',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  treeStats: {
    marginHorizontal: 24,
    marginBottom: 28,
    backgroundColor: '#F5F8F5',
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(46, 125, 50, 0.08)',
  },
  treeStat: {
    marginBottom: 22,
  },
  treeStatLabel: {
    fontSize: 13,
    color: '#2E7D32',
    marginBottom: 10,
    fontWeight: '500',
    letterSpacing: 0.2,
    opacity: 0.9,
  },
  treeStatValue: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0A3D0A',
    letterSpacing: -0.3,
  },
  healthBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(46, 125, 50, 0.08)',
  },
  progressBar: {
    flex: 1,
    height: 12,
    borderRadius: 6,
  },
  healthText: {
    marginLeft: 18,
    fontSize: 16,
    fontWeight: '700',
    color: '#0A3D0A',
    letterSpacing: -0.3,
  },
  rentalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  rentalDate: {
    backgroundColor: '#F5F8F5',
    borderWidth: 1,
    borderColor: 'rgba(46, 125, 50, 0.08)',
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  rentalOptionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  rentalOptionCard: {
    width: '48%',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(46, 125, 50, 0.08)',
    overflow: 'hidden',
  },
  rentalOptionContent: {
    padding: 20,
    alignItems: 'center',
  },
  rentalOptionIcon: {
    margin: 0,
    marginBottom: 12,
  },
  rentalOptionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0A3D0A',
    marginBottom: 8,
    textAlign: 'center',
  },
  rentalOptionDescription: {
    fontSize: 14,
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.9,
  },
  rentalOptionButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    paddingHorizontal: 20,
  },
});
