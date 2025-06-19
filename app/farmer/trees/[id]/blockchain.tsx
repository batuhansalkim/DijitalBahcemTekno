import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Surface, Button, Chip, IconButton, Divider } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Örnek ağaç verileri
const TREES_DATA = [
  {
    id: '1',
    name: 'Zeytin Ağacı #123',
    type: 'Zeytin',
    treeId: 'TR-123456-ABC',
    nftTokenId: '0x1234567890abcdef',
    smartContractAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    blockchainTransactions: [
      {
        id: '1',
        type: 'NFT_MINT',
        description: 'NFT Oluşturuldu',
        date: '2024-01-15',
        time: '14:30',
        hash: '0xabc123def456...',
        status: 'completed',
        amount: null,
      },
      {
        id: '2',
        type: 'RENTAL_CONTRACT',
        description: 'Kiralama Kontratı Oluşturuldu',
        date: '2024-02-20',
        time: '09:15',
        hash: '0xdef456abc789...',
        status: 'completed',
        amount: null,
      },
      {
        id: '3',
        type: 'RENTAL_PAYMENT',
        description: 'Kira Ödemesi Alındı',
        date: '2024-03-01',
        time: '16:45',
        hash: '0x789abc123def...',
        status: 'completed',
        amount: '2.500 ₺',
      },
      {
        id: '4',
        type: 'HARVEST_RECORD',
        description: 'Hasat Kaydı',
        date: '2024-11-15',
        time: '11:20',
        hash: '0x456def789abc...',
        status: 'completed',
        amount: '120 kg',
      },
    ],
    rentalHistory: [
      {
        id: '1',
        renter: 'Ahmet Yılmaz',
        startDate: '2024-03-01',
        endDate: '2025-03-01',
        amount: '2.500 ₺',
        status: 'active',
        harvestAmount: '120 kg',
      },
    ],
    nftMetadata: {
      name: 'Zeytin Ağacı #123 NFT',
      description: 'Bu NFT, Zeytin Ağacı #123\'ün dijital temsilidir',
      image: 'https://images.unsplash.com/photo-1445264718234-a623be589d37?w=400&h=300&fit=crop',
      attributes: [
        { trait_type: 'Ağaç Türü', value: 'Zeytin' },
        { trait_type: 'Yaş', value: '15 yıl' },
        { trait_type: 'Sağlık', value: '95%' },
        { trait_type: 'Bahçe', value: 'Zeytinlik Bahçesi' },
        { trait_type: 'Nadir', value: 'Yaygın' },
      ],
    },
  },
  {
    id: '2',
    name: 'Portakal Ağacı #45',
    type: 'Portakal',
    treeId: 'TR-789012-DEF',
    nftTokenId: '0xabcdef1234567890',
    smartContractAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    blockchainTransactions: [
      {
        id: '1',
        type: 'NFT_MINT',
        description: 'NFT Oluşturuldu',
        date: '2024-01-10',
        time: '10:20',
        hash: '0x123abc456def...',
        status: 'completed',
        amount: null,
      },
      {
        id: '2',
        type: 'RENTAL_CONTRACT',
        description: 'Kiralama Kontratı Oluşturuldu',
        date: '2024-02-15',
        time: '13:45',
        hash: '0x456def789abc...',
        status: 'completed',
        amount: null,
      },
      {
        id: '3',
        type: 'RENTAL_PAYMENT',
        description: 'Kira Ödemesi Alındı',
        date: '2024-03-01',
        time: '14:30',
        hash: '0x789abc123def...',
        status: 'completed',
        amount: '1.800 ₺',
      },
    ],
    rentalHistory: [
      {
        id: '1',
        renter: 'Fatma Demir',
        startDate: '2024-03-01',
        endDate: '2025-03-01',
        amount: '1.800 ₺',
        status: 'active',
        harvestAmount: '85 kg',
      },
    ],
    nftMetadata: {
      name: 'Portakal Ağacı #45 NFT',
      description: 'Bu NFT, Portakal Ağacı #45\'in dijital temsilidir',
      image: 'https://images.unsplash.com/photo-1590086783191-a0694c7d1e6e?w=400&h=300&fit=crop',
      attributes: [
        { trait_type: 'Ağaç Türü', value: 'Portakal' },
        { trait_type: 'Yaş', value: '8 yıl' },
        { trait_type: 'Sağlık', value: '88%' },
        { trait_type: 'Bahçe', value: 'Karışık Meyve Bahçesi' },
        { trait_type: 'Nadir', value: 'Yaygın' },
      ],
    },
  },
];

const getTransactionIcon = (type: string) => {
  switch (type) {
    case 'NFT_MINT':
      return 'nft';
    case 'RENTAL_CONTRACT':
      return 'file-document';
    case 'RENTAL_PAYMENT':
      return 'cash';
    case 'HARVEST_RECORD':
      return 'basket';
    default:
      return 'blockchain';
  }
};

const getTransactionColor = (type: string) => {
  switch (type) {
    case 'NFT_MINT':
      return '#9C27B0';
    case 'RENTAL_CONTRACT':
      return '#2196F3';
    case 'RENTAL_PAYMENT':
      return '#4CAF50';
    case 'HARVEST_RECORD':
      return '#FF9800';
    default:
      return '#757575';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return '#4CAF50';
    case 'pending':
      return '#FFC107';
    case 'failed':
      return '#F44336';
    case 'active':
      return '#4CAF50';
    case 'expired':
      return '#757575';
    default:
      return '#757575';
  }
};

export default function BlockchainScreen() {
  const { id } = useLocalSearchParams();
  const tree = TREES_DATA.find(t => t.id === id);
  const [selectedTab, setSelectedTab] = useState('transactions');

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
              <Text style={styles.title}>Blockchain</Text>
              <Text style={styles.subtitle}>{tree.name}</Text>
            </View>
          </View>
        </Surface>

        <View style={styles.content}>
          {/* NFT Bilgileri */}
          <Surface style={styles.section} elevation={2}>
            <Text style={styles.sectionTitle}>🪙 NFT Bilgileri</Text>
            
            <View style={styles.nftInfo}>
              <View style={styles.nftItem}>
                <MaterialCommunityIcons name="qrcode" size={20} color="#9C27B0" />
                <Text style={styles.nftLabel}>Token ID</Text>
                <Text style={styles.nftValue}>0x123456...cdef</Text>
              </View>
              
              <View style={styles.nftItem}>
                <MaterialCommunityIcons name="file-document" size={20} color="#2196F3" />
                <Text style={styles.nftLabel}>Akıllı Kontrat</Text>
                <Text style={styles.nftValue}>0x742d35...4d8b6</Text>
              </View>
              
              <View style={styles.nftItem}>
                <MaterialCommunityIcons name="tree" size={20} color="#2E7D32" />
                <Text style={styles.nftLabel}>Ağaç ID</Text>
                <Text style={styles.nftValue}>{tree.treeId}</Text>
              </View>
            </View>
          </Surface>

          {/* Tab Butonları */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tabButton, selectedTab === 'transactions' && styles.tabButtonActive]}
              onPress={() => setSelectedTab('transactions')}
            >
              <MaterialCommunityIcons 
                name="file-document" 
                size={20} 
                color={selectedTab === 'transactions' ? '#fff' : '#2E7D32'} 
              />
              <Text style={[styles.tabText, selectedTab === 'transactions' && styles.tabTextActive]}>
                İşlemler
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.tabButton, selectedTab === 'rentals' && styles.tabButtonActive]}
              onPress={() => setSelectedTab('rentals')}
            >
              <MaterialCommunityIcons 
                name="calendar-clock" 
                size={20} 
                color={selectedTab === 'rentals' ? '#fff' : '#2E7D32'} 
              />
              <Text style={[styles.tabText, selectedTab === 'rentals' && styles.tabTextActive]}>
                Kiralama Geçmişi
              </Text>
            </TouchableOpacity>
          </View>

          {/* İşlemler Tab */}
          {selectedTab === 'transactions' && (
            <Surface style={styles.section} elevation={2}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Blockchain İşlemleri</Text>
                <Chip style={styles.transactionCountChip}>
                  {tree.blockchainTransactions.length} İşlem
                </Chip>
              </View>
              
              {tree.blockchainTransactions.map((transaction, index) => (
                <View key={transaction.id}>
                  <View style={styles.transactionItem}>
                    <View style={[styles.transactionIcon, { backgroundColor: `${getTransactionColor(transaction.type)}15` }]}>
                      <MaterialCommunityIcons 
                        name={getTransactionIcon(transaction.type) as any} 
                        size={24} 
                        color={getTransactionColor(transaction.type)} 
                      />
                    </View>
                    
                    <View style={styles.transactionContent}>
                      <View style={styles.transactionHeader}>
                        <Text style={styles.transactionTitle} numberOfLines={1} ellipsizeMode="tail">{transaction.description}</Text>
                        {transaction.amount && (
                          <Text style={styles.transactionAmount}>{transaction.amount}</Text>
                        )}
                      </View>
                      <Text style={styles.transactionDate}>
                        📅 {transaction.date} • 🕐 {transaction.time}
                      </Text>
                      <Text style={styles.transactionHash}>
                        🔗 {transaction.hash}
                      </Text>
                    </View>
                  </View>
                  {index < tree.blockchainTransactions.length - 1 && <Divider style={styles.divider} />}
                </View>
              ))}
            </Surface>
          )}

          {/* Kiralama Geçmişi Tab */}
          {selectedTab === 'rentals' && (
            <Surface style={styles.section} elevation={2}>
              <Text style={styles.sectionTitle}>Kiralama Geçmişi</Text>
              
              {tree.rentalHistory.map((rental, index) => (
                <View key={rental.id}>
                  <View style={styles.rentalItem}>
                    <View style={styles.rentalIcon}>
                      <MaterialCommunityIcons name="account" size={24} color="#2E7D32" />
                    </View>
                    
                    <View style={styles.rentalContent}>
                      <Text style={styles.rentalTitle}>{rental.renter}</Text>
                      <Text style={styles.rentalDate}>
                        {rental.startDate} - {rental.endDate}
                      </Text>
                      <Text style={styles.rentalHarvest}>
                        Hasat: {rental.harvestAmount}
                      </Text>
                    </View>
                    
                    <View style={styles.rentalRight}>
                      <Text style={styles.rentalAmount}>{rental.amount}</Text>
                      
                    </View>
                  </View>
                  {index < tree.rentalHistory.length - 1 && <Divider style={styles.divider} />}
                </View>
              ))}
            </Surface>
          )}

          {/* NFT Metadata */}
          <Surface style={styles.section} elevation={2}>
            <Text style={styles.sectionTitle}>NFT Özellikleri</Text>
            
            <View style={styles.attributesGrid}>
              {tree.nftMetadata.attributes.map((attr, index) => (
                <View key={index} style={styles.attributeItem}>
                  <Text style={styles.attributeLabel}>{attr.trait_type}</Text>
                  <Text style={styles.attributeValue}>{attr.value}</Text>
                </View>
              ))}
            </View>
          </Surface>

          {/* Aksiyon Butonları */}
          <View style={styles.actionButtons}>
            <Button
              mode="outlined"
              onPress={() => router.push(`/blockchain-transactions`)}
              style={styles.actionBtn}
              textColor="#2E7D32"
            >
              Tüm İşlemler
            </Button>
            
            <Button
              mode="contained"
              onPress={() => router.push(`/nft-collection`)}
              style={styles.actionBtn}
              buttonColor="#2E7D32"
              textColor='#fff'
            >
              NFT Koleksiyonu
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
  nftInfo: {
    gap: 16,
  },
  nftItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAF8',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  nftLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
    flex: 1,
    fontWeight: '500',
  },
  nftValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1B4332',
    fontFamily: 'monospace',
    textAlign: 'right',
    flexShrink: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  tabButtonActive: {
    backgroundColor: '#2E7D32',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2E7D32',
  },
  tabTextActive: {
    color: '#fff',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  transactionContent: {
    flex: 1,
    marginRight: 12,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
    gap: 8,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
    minWidth: 0,
    marginRight: 8,
    flexShrink: 1,
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'right',
  },
  transactionDate: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  transactionHash: {
    fontSize: 11,
    color: '#888',
    fontFamily: 'monospace',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  transactionStatus: {
    alignItems: 'flex-end',
  },
  divider: {
    marginVertical: 8,
    backgroundColor: '#e0e0e0',
    height: 1,
  },
  rentalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  rentalIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rentalContent: {
    flex: 1,
  },
  rentalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B4332',
    marginBottom: 4,
  },
  rentalDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  rentalHarvest: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '500',
  },
  rentalRight: {
    alignItems: 'flex-end',
  },
  rentalAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  attributesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  attributeItem: {
    flex: 1,
    minWidth: '45%',
    padding: 12,
    backgroundColor: '#F8FAF8',
    borderRadius: 12,
    alignItems: 'center',
  },
  attributeLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  attributeValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1B4332',
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  transactionCountChip: {
    borderRadius: 16,
    height: 28,
    paddingHorizontal: 12,
    backgroundColor: '#e8f5e8',
  },
  statusChip: {
    borderRadius: 12,
    height: 24,
    paddingHorizontal: 8,
    minWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  statusText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 10,
  },
}); 