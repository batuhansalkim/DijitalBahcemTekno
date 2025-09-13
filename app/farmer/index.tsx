import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Text, Surface, Button, Avatar, List, Divider, IconButton, Chip } from 'react-native-paper';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { fetchWeatherRecommendations, type AISuggestion } from '../services/aiServices';
import AISuggestions from '../components/AISuggestions';

const { width } = Dimensions.get('window');

// Örnek veriler
const FARMER_STATS = {
  totalTrees: 150,
  activeRentals: 45,
  totalIncome: '12.500₺',
  upcomingHarvests: 3,
  totalGardens: 8,
  monthlyGrowth: '+12%',
};

const RECENT_ACTIVITIES = [
  {
    id: '1',
    type: 'rental',
    message: 'Yeni ağaç kiralandı: Zeytin #123',
    time: '2 saat önce',
    icon: 'tree',
    color: '#2D6A4F',
    status: 'success'
  },
  {
    id: '2',
    type: 'harvest',
    message: 'Hasat tamamlandı: Portakal #456',
    time: '1 gün önce',
    icon: 'fruit-citrus',
    color: '#FFA000',
    status: 'completed'
  },
  {
    id: '3',
    type: 'maintenance',
    message: 'Bakım yapıldı: Bahçe #2',
    time: '2 gün önce',
    icon: 'watering-can',
    color: '#1976D2',
    status: 'maintenance'
  },
  {
    id: '4',
    type: 'health',
    message: 'Ağaç sağlığı güncellendi: Fındık #789',
    time: '3 gün önce',
    icon: 'heart-pulse',
    color: '#388E3C',
    status: 'health'
  },
];

const ACTIVE_RENTALS = [
  {
    id: '1',
    treeName: 'Zeytin Ağacı #123',
    renterName: 'Ahmet Yılmaz',
    rentDate: '15.01.2024',
    nextHarvest: 'Kasım 2024',
    health: 95,
    image: 'https://images.unsplash.com/photo-1445264718234-a623be589d37',
    status: 'Sağlıklı'
  },
  {
    id: '2',
    treeName: 'Portakal Ağacı #456',
    renterName: 'Mehmet Demir',
    rentDate: '20.01.2024',
    nextHarvest: 'Aralık 2024',
    health: 87,
    image: 'https://images.unsplash.com/photo-1590086783191-a0694c7d1e6e',
    status: 'Bakım Gerekli'
  },
  {
    id: '3',
    treeName: 'Fındık Ağacı #789',
    renterName: 'Ayşe Kaya',
    rentDate: '25.01.2024',
    nextHarvest: 'Eylül 2024',
    health: 92,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b',
    status: 'Sağlıklı'
  },
];

const QUICK_ACTIONS = [
  {
    id: '1',
    title: 'Yeni Bahçe',
    subtitle: 'Bahçe ekle',
    icon: 'plus-circle',
    color: '#2D6A4F',
    route: '/farmer/gardens/add'
  },
  {
    id: '2',
    title: 'Ağaç Tanımla',
    subtitle: 'RFID ile tanımla',
    icon: 'tree',
    color: '#40916C',
    route: '/farmer/trees/add'
  },
  {
    id: '3',
    title: 'Hasat Takibi',
    subtitle: 'Hasat planla',
    icon: 'fruit-cherries',
    color: '#74C69D',
    route: '/farmer/harvest'
  },
  {
    id: '4',
    title: 'Mesajlar',
    subtitle: 'Kiracılarla iletişim',
    icon: 'message',
    color: '#95D5B2',
    route: '/farmer/messages'
  },
];

export default function FarmerHomeScreen() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Sağlıklı': return '#2D6A4F';
      case 'Bakım Gerekli': return '#FFA000';
      default: return '#666';
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 90) return '#2D6A4F';
    if (health >= 70) return '#FFA000';
    return '#D32F2F';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#D32F2F';
      case 'medium': return '#FFA000';
      case 'low': return '#2D6A4F';
      default: return '#666';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'maintenance': return 'wrench';
      case 'harvest': return 'fruit-cherries';
      case 'health': return 'heart-pulse';
      case 'weather': return 'weather-cloudy';
      case 'general': return 'lightbulb';
      default: return 'information';
    }
  };

  const [aiLoading, setAiLoading] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      setAiLoading(true);
  
      const ciftci = {
        id: "1",
        ad: "Ahmet Yılmaz",
        email: "ahmet@example.com",
        konum: "Manisa, Türkiye",
      };
  
      const bahce = {
        id: "B1",
        ad: "Zeytinlik",
        bitkiTipi: "Zeytin",
        konum: "Kirklareli, Türkiye",
        kurulusYili: 2020,
        agacKapasitesi: 580,
        ortalamaYillikVerim: "4 ton",
      };
  
      fetchWeatherRecommendations(ciftci, bahce)
        .then((data) => {
          if (isActive) {
            const suggestions: AISuggestion[] =
              data.oneriler?.map((oner: string, index: number) => ({
                id: `weather-${index}`,
                title: `Hava Durumu Önerisi ${index + 1}`,
                description: oner,
                priority: "medium",
                category: "weather",
                actionText: "Detayları Gör",
                icon: "weather-cloudy",
              })) || [];
            setAiSuggestions(suggestions);
          }
        })
        .catch((error) => {
          console.error("Weather API error:", error);
          if (isActive) setAiSuggestions([]);
        })
        .finally(() => {
          if (isActive) setAiLoading(false);
        });
  
      return () => {
        isActive = false;
      };
    }, [])
  );
  

  const handleSuggestionAction = (suggestion: AISuggestion) => {
    // AI önerilerine göre yönlendirme
    if (suggestion.title.toLowerCase().includes('sulama')) {
      router.push('/farmer/gardens' as any);
      return;
    }
    if (suggestion.title.toLowerCase().includes('gübre')) {
      router.push('/farmer/trees' as any);
      return;
    }
    if (suggestion.title.toLowerCase().includes('hastalık') || suggestion.title.toLowerCase().includes('sağlık')) {
      router.push('/farmer/trees' as any);
      return;
    }
    if (suggestion.title.toLowerCase().includes('hasat')) {
      router.push('/farmer/trees' as any);
      return;
    }
    if (suggestion.title.toLowerCase().includes('hava')) {
      router.push('/farmer/gardens' as any);
      return;
    }
    // Varsayılan olarak mesajlar sayfasına yönlendir
    router.push('/farmer/messages' as any);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      {/* Header */}
      <Surface style={styles.header} elevation={0}>
        <View style={styles.headerGradient}>
          <View style={styles.headerContent}>
            <View style={styles.headerText}>
              <Text style={styles.title}>Hoş Geldiniz 👋</Text>
              <Text style={styles.subtitle}>Bahçelerinizi profesyonelce yönetin</Text>
            </View>
          </View>
        </View>
      </Surface>

      {/* İstatistikler */}
      <View style={styles.statsContainer}>
        <Surface style={styles.statsCard} elevation={3}>
          <View style={styles.statItem}>
            <Avatar.Icon icon="tree" size={40} style={styles.statIcon} color="#2D6A4F" />
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>{FARMER_STATS.totalTrees}</Text>
              <Text style={styles.statLabel}>Toplam Ağaç</Text>
            </View>
          </View>
        </Surface>

        <Surface style={styles.statsCard} elevation={3}>
          <View style={styles.statItem}>
            <Avatar.Icon icon="account-group" size={40} style={styles.statIcon} color="#40916C" />
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>{FARMER_STATS.activeRentals}</Text>
              <Text style={styles.statLabel}>Aktif Kiralama</Text>
            </View>
          </View>
        </Surface>

        <Surface style={styles.statsCard} elevation={3}>
          <View style={styles.statItem}>
            <Avatar.Icon icon="fruit-cherries" size={40} style={styles.statIcon} color="#74C69D" />
            <View style={styles.statInfo}>
              <Text style={styles.statNumber}>{FARMER_STATS.upcomingHarvests}</Text>
              <Text style={styles.statLabel}>Yaklaşan Hasat</Text>
            </View>
          </View>
        </Surface>
      </View>


      {/* Gelir Özeti */}
      <Surface style={styles.incomeCard} elevation={3}>
        <View style={styles.incomeHeader}>
          <Text style={styles.incomeTitle}>Aylık Gelir</Text>
          <Chip style={styles.growthChip} textStyle={styles.growthText}>
            {FARMER_STATS.monthlyGrowth}
          </Chip>
        </View>
        <Text style={styles.incomeAmount}>{FARMER_STATS.totalIncome}</Text>
        <Text style={styles.incomeSubtext}>Bu ay toplam kiralama geliri</Text>
      </Surface>

      {/* Hızlı İşlemler */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>
        <View style={styles.quickActionsGrid}>
          {QUICK_ACTIONS.map((action) => (
            <Surface key={action.id} style={styles.actionCard} elevation={2}>
              <IconButton
                icon={action.icon}
                size={32}
                iconColor="#fff"
                style={[styles.actionIcon, { backgroundColor: action.color }]}
                onPress={() => router.push(action.route as any)}
              />
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
            </Surface>
          ))}
        </View>
      </View>
      
      <AISuggestions 
        loading={aiLoading} 
        suggestions={aiSuggestions} 
        onActionPress={handleSuggestionAction}
      />
      {/* Aktif Kiralamalar */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Aktif Kiralamalar</Text>
          <Button 
            mode="text" 
            onPress={() => router.push('/farmer/trees')}
            textColor="#2D6A4F"
          >
            Tümünü Gör
          </Button>
        </View>
        
        {ACTIVE_RENTALS.map((rental) => (
          <Surface key={rental.id} style={styles.rentalCard} elevation={2}>
            <View style={styles.rentalHeader}>
              <Avatar.Image 
                size={50} 
                source={{ uri: rental.image }} 
                style={styles.rentalImage}
              />
              <View style={styles.rentalInfo}>
                <Text style={styles.rentalTreeName}>{rental.treeName}</Text>
                <Text style={styles.rentalRenter}>Kiracı: {rental.renterName}</Text>
                <View style={styles.rentalStatusRow}>
                  <Chip 
                    style={[styles.statusChip, { backgroundColor: getStatusColor(rental.status) }]}
                    textStyle={styles.statusText}
                  >
                    {rental.status}
                  </Chip>
                  <Text style={styles.healthText}>Sağlık: {rental.health}%</Text>
                </View>
              </View>
              <IconButton
                icon="chevron-right"
                size={24}
                iconColor="#666"
                onPress={() => router.push('/farmer/trees')}
              />
            </View>
            <View style={styles.rentalDetails}>
              <View style={styles.rentalDetail}>
                <Text style={styles.detailLabel}>Kiralama Tarihi</Text>
                <Text style={styles.detailValue}>{rental.rentDate}</Text>
              </View>
              <View style={styles.rentalDetail}>
                <Text style={styles.detailLabel}>Sonraki Hasat</Text>
                <Text style={styles.detailValue}>{rental.nextHarvest}</Text>
              </View>
            </View>
          </Surface>
        ))}
      </View>

      {/* Son Aktiviteler */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Son Aktiviteler</Text>
          <Button 
            mode="text" 
            onPress={() => router.push('/farmer/trees')}
            textColor="#2D6A4F"
          >
            Tümünü Gör
          </Button>
        </View>
        
        <Surface style={styles.activitiesCard} elevation={2}>
          {RECENT_ACTIVITIES.map((activity, index) => (
            <React.Fragment key={activity.id}>
              <List.Item
                title={activity.message}
                description={activity.time}
                left={props => (
                  <View style={styles.activityItem}>
                    <View style={styles.activityIconContainer}>
                      <Avatar.Icon
                        {...props}
                        icon={activity.icon}
                        style={[styles.activityIcon, { backgroundColor: activity.color }]}
                        color="#fff"
                      />
                    </View>
                  </View>
                )}
                titleStyle={styles.activityTitle}
                descriptionStyle={styles.activityTime}
              />
              {index < RECENT_ACTIVITIES.length - 1 && <Divider style={styles.divider} />}
            </React.Fragment>
          ))}
        </Surface>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F3',
  },
  header: {
    backgroundColor: '#2D6A4F',
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerGradient: {
    flex: 1,
    backgroundColor: '#2D6A4F',
    borderRadius: 16,
  },
  headerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    alignItems: 'center',
    textAlign: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statsCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    backgroundColor: '#E8F5E9',
    marginBottom: 8,
  },
  statInfo: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B4332',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  incomeCard: {
    margin: 16,
    marginTop: 0,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  incomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  incomeTitle: {
    fontSize: 16,
    color: '#666',
  },
  growthChip: {
    backgroundColor: '#E8F5E9',
  },
  growthText: {
    color: '#2D6A4F',
    fontSize: 12,
    fontWeight: 'bold',
  },
  incomeAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D6A4F',
    marginBottom: 4,
  },
  incomeSubtext: {
    fontSize: 14,
    color: '#666',
  },
  quickActionsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B4332',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: (width - 44) / 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  actionIcon: {
    marginBottom: 8,
    borderRadius: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1B4332',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  rentalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  rentalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rentalImage: {
    marginRight: 12,
    borderRadius: 8,
  },
  rentalInfo: {
    flex: 1,
  },
  rentalTreeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B4332',
    marginBottom: 2,
  },
  rentalRenter: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  rentalStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
    minHeight: 32,
  },
  statusChip: {
    height: 32,
    borderRadius: 16,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
  },
  statusText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: 'bold',
    lineHeight: 18,
  },
  healthText: {
    fontSize: 12,
    color: '#666',
  },
  rentalDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rentalDetail: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1B4332',
  },
  activitiesCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  activityItem: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  activityIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    marginLeft: 18,
    backgroundColor: '#E8F5E9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  activityIcon: {
    margin: 0,
  },
  activityTitle: {
    fontSize: 14,
    color: '#1B4332',
    fontWeight: '500',
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
  },
  divider: {
    marginHorizontal: 16,
  },
}); 