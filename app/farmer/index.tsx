import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, Avatar, List, Divider } from 'react-native-paper';
import { router } from 'expo-router';

// Örnek veriler
const FARMER_STATS = {
  totalTrees: 150,
  activeRentals: 45,
  totalIncome: '12.500₺',
  upcomingHarvests: 3,
};

const RECENT_ACTIVITIES = [
  {
    id: '1',
    type: 'rental',
    message: 'Yeni ağaç kiralandı: Zeytin #123',
    time: '2 saat önce',
    icon: 'tree',
  },
  {
    id: '2',
    type: 'harvest',
    message: 'Hasat tamamlandı: Portakal #456',
    time: '1 gün önce',
    icon: 'fruit-citrus',
  },
  {
    id: '3',
    type: 'maintenance',
    message: 'Bakım yapıldı: Bahçe #2',
    time: '2 gün önce',
    icon: 'watering-can',
  },
];

const ACTIVE_RENTALS = [
  {
    id: '1',
    treeName: 'Zeytin Ağacı #123',
    renterName: 'Ahmet Yılmaz',
    rentDate: '15.01.2024',
    nextHarvest: 'Kasım 2024',
  },
  {
    id: '2',
    treeName: 'Portakal Ağacı #456',
    renterName: 'Mehmet Demir',
    rentDate: '20.01.2024',
    nextHarvest: 'Aralık 2024',
  },
];

export default function FarmerHomeScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Başlık */}
      <View style={styles.header}>
        <Text style={styles.title}>Hoş Geldiniz 👋</Text>
        <Text style={styles.subtitle}>Bahçelerinizi yönetin</Text>
      </View>

      {/* İstatistikler */}
      <View style={styles.statsContainer}>
        <Card style={styles.statsCard}>
          <Card.Content>
            <Text style={styles.statsNumber}>{FARMER_STATS.totalTrees}</Text>
            <Text style={styles.statsLabel}>Toplam Ağaç</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statsCard}>
          <Card.Content>
            <Text style={styles.statsNumber}>{FARMER_STATS.activeRentals}</Text>
            <Text style={styles.statsLabel}>Aktif Kiralama</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statsCard}>
          <Card.Content>
            <Text style={styles.statsNumber}>{FARMER_STATS.upcomingHarvests}</Text>
            <Text style={styles.statsLabel}>Yaklaşan Hasat</Text>
          </Card.Content>
        </Card>
      </View>

      {/* Hızlı İşlemler */}
      <View style={styles.quickActions}>
        <Button
          mode="contained"
          icon="plus"
          onPress={() => router.push('/farmer/gardens/add')}
          style={styles.actionButton}
        >
          Yeni Bahçe Ekle
        </Button>
        <Button
          mode="contained"
          icon="tree"
          onPress={() => router.push('/farmer/trees/add')}
          style={styles.actionButton}
        >
          Ağaç Tanımla
        </Button>
      </View>

      {/* Aktif Kiralamalar */}
      <Card style={styles.section}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Aktif Kiralamalar</Text>
          {ACTIVE_RENTALS.map((rental, index) => (
            <React.Fragment key={rental.id}>
              <List.Item
                title={rental.treeName}
                description={`Kiracı: ${rental.renterName}\nSonraki Hasat: ${rental.nextHarvest}`}
                left={props => (
                  <Avatar.Icon {...props} icon="tree" style={styles.listIcon} />
                )}
                right={props => (
                  <Button
                    mode="text"
                    onPress={() => router.push(`/farmer/trees/${rental.id}`)}
                  >
                    Detay
                  </Button>
                )}
              />
              {index < ACTIVE_RENTALS.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </Card.Content>
      </Card>

      {/* Son Aktiviteler */}
      <Card style={styles.section}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Son Aktiviteler</Text>
          {RECENT_ACTIVITIES.map((activity, index) => (
            <React.Fragment key={activity.id}>
              <List.Item
                title={activity.message}
                description={activity.time}
                left={props => (
                  <Avatar.Icon
                    {...props}
                    icon={activity.icon}
                    style={styles.listIcon}
                  />
                )}
              />
              {index < RECENT_ACTIVITIES.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  statsCard: {
    flex: 1,
    marginHorizontal: 4,
  },
  statsNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
  },
  statsLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 0,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: '#2E7D32',
  },
  section: {
    margin: 16,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  listIcon: {
    backgroundColor: '#2E7D32',
  },
}); 