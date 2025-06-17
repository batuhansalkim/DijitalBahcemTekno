import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Linking, Alert } from 'react-native';
import { Text, Surface, Chip, IconButton, Searchbar, Button, Divider } from 'react-native-paper';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

// Fake Blockchain Transactions
const BLOCKCHAIN_TRANSACTIONS = [
  {
    id: '1',
    type: 'NFT_MINT',
    description: 'Zeytin Ağacı #123 NFT oluşturuldu',
    amount: '0.05 ETH',
    date: '2024-01-15 14:30:22',
    status: 'confirmed',
    txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    gasUsed: '0.002 ETH',
    blockNumber: '18456789',
    network: 'Ethereum',
    from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    to: '0xContractAddress1234567890abcdef1234567890abcdef',
    treeId: '1',
    treeName: 'Zeytin Ağacı #123'
  },
  {
    id: '2',
    type: 'RENTAL_CONTRACT',
    description: 'Ağaç kiralama sözleşmesi oluşturuldu',
    amount: '0.1 ETH',
    date: '2024-01-15 14:32:15',
    status: 'confirmed',
    txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    gasUsed: '0.003 ETH',
    blockNumber: '18456790',
    network: 'Ethereum',
    from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    to: '0xContractAddress1234567890abcdef1234567890abcdef',
    treeId: '1',
    treeName: 'Zeytin Ağacı #123'
  },
  {
    id: '3',
    type: 'NFT_MINT',
    description: 'Portakal Ağacı #456 NFT oluşturuldu',
    amount: '0.05 ETH',
    date: '2024-02-20 09:15:45',
    status: 'confirmed',
    txHash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
    gasUsed: '0.002 ETH',
    blockNumber: '18523456',
    network: 'Ethereum',
    from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    to: '0xContractAddress1234567890abcdef1234567890abcdef',
    treeId: '2',
    treeName: 'Portakal Ağacı #456'
  },
  {
    id: '4',
    type: 'HARVEST_UPDATE',
    description: 'Hasat verisi blockchain\'e kaydedildi',
    amount: '0.01 ETH',
    date: '2024-02-25 16:45:30',
    status: 'confirmed',
    txHash: '0x4567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123',
    gasUsed: '0.001 ETH',
    blockNumber: '18567890',
    network: 'Ethereum',
    from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    to: '0xContractAddress1234567890abcdef1234567890abcdef',
    treeId: '1',
    treeName: 'Zeytin Ağacı #123'
  },
  {
    id: '5',
    type: 'NFT_MINT',
    description: 'Fındık Ağacı #789 NFT oluşturuldu',
    amount: '0.05 ETH',
    date: '2024-03-10 11:20:18',
    status: 'confirmed',
    txHash: '0xdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abc',
    gasUsed: '0.002 ETH',
    blockNumber: '18678901',
    network: 'Ethereum',
    from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    to: '0xContractAddress1234567890abcdef1234567890abcdef',
    treeId: '3',
    treeName: 'Fındık Ağacı #789'
  },
  {
    id: '6',
    type: 'TREE_HEALTH_UPDATE',
    description: 'Ağaç sağlık verisi güncellendi',
    amount: '0.005 ETH',
    date: '2024-03-15 10:30:45',
    status: 'confirmed',
    txHash: '0xabc123def456789abc123def456789abc123def456789abc123def456789abc',
    gasUsed: '0.001 ETH',
    blockNumber: '18712345',
    network: 'Ethereum',
    from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    to: '0xContractAddress1234567890abcdef1234567890abcdef',
    treeId: '2',
    treeName: 'Portakal Ağacı #456'
  }
];

const TRANSACTION_TYPES = ['Tümü', 'NFT_MINT', 'RENTAL_CONTRACT', 'HARVEST_UPDATE', 'TREE_HEALTH_UPDATE'];

export default function BlockchainTransactionsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('Tümü');

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'NFT_MINT': return '#2D6A4F';
      case 'RENTAL_CONTRACT': return '#40916C';
      case 'HARVEST_UPDATE': return '#74C69D';
      case 'TREE_HEALTH_UPDATE': return '#95D5B2';
      default: return '#666';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'NFT_MINT': return 'nfc';
      case 'RENTAL_CONTRACT': return 'file-document';
      case 'HARVEST_UPDATE': return 'fruit-cherries';
      case 'TREE_HEALTH_UPDATE': return 'heart-pulse';
      default: return 'block-helper';
    }
  };

  const openBlockchainExplorer = async (txHash: string, network: string) => {
    try {
      // Demo amaçlı - gerçek blockchain explorer yerine bilgilendirme göster
      Alert.alert(
        'Blockchain Explorer',
        `Bu işlem test ağında (Testnet) gerçekleşmiştir.\n\nİşlem Hash: ${txHash.substring(0, 20)}...\nAğ: ${network} Testnet\n\nGerçek blockchain explorer'da görüntülemek için:\n1. Ana ağa (Mainnet) geçiş yapın\n2. İşlem hash'ini kopyalayın\n3. Etherscan.io adresine gidin`,
        [
          { text: 'Hash\'i Kopyala', onPress: () => {
            // Hash'i kopyalama işlemi (gerçek uygulamada Clipboard API kullanılır)
            Alert.alert('Kopyalandı', 'İşlem hash\'i panoya kopyalandı!');
          }},
          { text: 'Tamam' }
        ]
      );
    } catch (error) {
      Alert.alert(
        'Hata',
        'İşlem detayları gösterilirken bir hata oluştu.',
        [{ text: 'Tamam' }]
      );
    }
  };

  const showTransactionDetails = (tx: any) => {
    Alert.alert(
      'İşlem Detayları',
      `İşlem Hash: ${tx.txHash}\n\nAğ: ${tx.network} (Testnet)\nBlok: ${tx.blockNumber}\nGas: ${tx.gasUsed}\n\nBu işlem test ağında gerçekleşmiştir. Gerçek blockchain explorer'da görüntülemek istiyor musunuz?`,
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Detayları Göster', 
          onPress: () => openBlockchainExplorer(tx.txHash, tx.network)
        }
      ]
    );
  };

  const filteredTransactions = BLOCKCHAIN_TRANSACTIONS.filter(tx => {
    const matchesSearch = tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tx.treeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'Tümü' || tx.type === selectedType;
    return matchesSearch && matchesType;
  });

  const totalGasUsed = filteredTransactions.reduce((sum, tx) => {
    return sum + parseFloat(tx.gasUsed.split(' ')[0]);
  }, 0);

  const totalAmount = filteredTransactions.reduce((sum, tx) => {
    return sum + parseFloat(tx.amount.split(' ')[0]);
  }, 0);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Surface style={styles.header} elevation={4}>
        <View style={styles.headerContent}>
          <IconButton
            icon="arrow-left"
            size={24}
            iconColor="#fff"
            onPress={() => router.back()}
          />
          <Text style={styles.headerTitle}>Blockchain İşlemleri</Text>
          <View style={styles.headerStats}>
            <Text style={styles.statText}>{filteredTransactions.length} işlem</Text>
          </View>
        </View>
      </Surface>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Search and Filters */}
        <Surface style={styles.searchCard} elevation={2}>
          <Searchbar
            placeholder="İşlem veya ağaç adı ara..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            iconColor="#2D6A4F"
          />
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
            contentContainerStyle={styles.filterContainer}
          >
            {TRANSACTION_TYPES.map((type) => (
              <Chip
                key={type}
                selected={selectedType === type}
                onPress={() => setSelectedType(type)}
                style={[
                  styles.filterChip,
                  selectedType === type && styles.selectedFilterChip
                ]}
                textStyle={[
                  styles.filterChipText,
                  selectedType === type && styles.selectedFilterChipText
                ]}
              >
                {type}
              </Chip>
            ))}
          </ScrollView>
        </Surface>

        {/* Summary Stats */}
        <Surface style={styles.statsCard} elevation={2}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{filteredTransactions.length}</Text>
              <Text style={styles.statLabel}>Toplam İşlem</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totalAmount.toFixed(3)}</Text>
              <Text style={styles.statLabel}>Toplam ETH</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totalGasUsed.toFixed(3)}</Text>
              <Text style={styles.statLabel}>Toplam Gas</Text>
            </View>
          </View>
        </Surface>

        {/* Transactions List */}
        {filteredTransactions.map((tx) => (
          <Surface key={tx.id} style={styles.txCard} elevation={3}>
            <View style={styles.txHeader}>
              <View style={styles.txTypeContainer}>
                <IconButton
                  icon={getTypeIcon(tx.type)}
                  size={20}
                  iconColor={getTypeColor(tx.type)}
                  style={styles.txIcon}
                />
                <View style={styles.txTypeInfo}>
                  <Text style={styles.txType}>{tx.type}</Text>
                  <Text style={styles.txDescription}>{tx.description}</Text>
                </View>
              </View>
              <Chip style={styles.txStatus} textStyle={styles.txStatusText}>
                {tx.status}
              </Chip>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.txDetails}>
              <View style={styles.txDetailRow}>
                <Text style={styles.txDetailLabel}>Miktar:</Text>
                <Text style={styles.txDetailValue}>{tx.amount}</Text>
              </View>
              <View style={styles.txDetailRow}>
                <Text style={styles.txDetailLabel}>Gas:</Text>
                <Text style={styles.txDetailValue}>{tx.gasUsed}</Text>
              </View>
              <View style={styles.txDetailRow}>
                <Text style={styles.txDetailLabel}>Blok:</Text>
                <Text style={styles.txDetailValue}>{tx.blockNumber}</Text>
              </View>
              <View style={styles.txDetailRow}>
                <Text style={styles.txDetailLabel}>Ağaç:</Text>
                <Text style={styles.txDetailValue}>{tx.treeName}</Text>
              </View>
              <View style={styles.txDetailRow}>
                <Text style={styles.txDetailLabel}>Tarih:</Text>
                <Text style={styles.txDetailValue}>{tx.date}</Text>
              </View>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.txHashContainer}>
              <Text style={styles.txHashLabel}>Transaction Hash:</Text>
              <Text style={styles.txHash}>{tx.txHash}</Text>
            </View>

            <View style={styles.txActions}>
              <Button 
                mode="outlined" 
                style={styles.actionButton}
                onPress={() => router.push({
                  pathname: '/tree/[id]' as const,
                  params: { id: tx.treeId }
                })}
              >
                Ağaç Detayları
              </Button>
              <Button 
                mode="contained" 
                style={styles.actionButton}
                onPress={() => showTransactionDetails(tx)}
              >
                Blockchain'de Görüntüle
              </Button>
            </View>
          </Surface>
        ))}

        {filteredTransactions.length === 0 && (
          <Surface style={styles.emptyCard} elevation={2}>
            <Text style={styles.emptyText}>İşlem bulunamadı</Text>
            <Text style={styles.emptySubtext}>Arama kriterlerinizi değiştirmeyi deneyin</Text>
          </Surface>
        )}
      </ScrollView>
    </View>
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
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerStats: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  searchCard: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
  },
  searchBar: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 16,
  },
  filterScroll: {
    marginHorizontal: -16,
  },
  filterContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedFilterChip: {
    backgroundColor: '#2D6A4F',
    borderColor: '#2D6A4F',
  },
  filterChipText: {
    color: '#666',
    fontSize: 12,
  },
  selectedFilterChipText: {
    color: '#fff',
    fontSize: 12,
  },
  statsCard: {
    margin: 16,
    marginTop: 8,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#fff',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D6A4F',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  txCard: {
    margin: 16,
    marginTop: 8,
    borderRadius: 16,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  txHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
  },
  txTypeContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  txIcon: {
    margin: 0,
    marginRight: 12,
  },
  txTypeInfo: {
    flex: 1,
  },
  txType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1B4332',
    marginBottom: 4,
  },
  txDescription: {
    fontSize: 14,
    color: '#666',
  },
  txStatus: {
    backgroundColor: '#E8F5E9',
  },
  txStatusText: {
    color: '#2D6A4F',
    fontSize: 10,
    fontWeight: 'bold',
  },
  divider: {
    marginHorizontal: 16,
  },
  txDetails: {
    padding: 16,
  },
  txDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  txDetailLabel: {
    fontSize: 14,
    color: '#666',
  },
  txDetailValue: {
    fontSize: 14,
    color: '#1B4332',
    fontWeight: '500',
  },
  txHashContainer: {
    padding: 16,
    backgroundColor: '#F8F9FA',
  },
  txHashLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  txHash: {
    fontSize: 11,
    color: '#1B4332',
    fontFamily: 'monospace',
  },
  txActions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  emptyCard: {
    margin: 16,
    padding: 40,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
}); 