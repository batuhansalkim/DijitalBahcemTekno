import React from 'react';
import { View, StyleSheet, ScrollView, Image, Dimensions, Alert } from 'react-native';
import { Text, Surface, Chip, IconButton, Button } from 'react-native-paper';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

// Fake NFT Collection Data
const NFT_COLLECTION = [
  {
    id: '1',
    name: 'Zeytin Ağacı #123',
    image: 'https://images.unsplash.com/photo-1445264718234-a623be589d37',
    tokenId: '0x1234567890abcdef',
    contractAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    mintDate: '2024-01-15',
    rarity: 'Rare',
    attributes: {
      age: '15 yıl',
      location: 'İzmir, Seferihisar',
      health: '95%',
      yield: '320 kg/yıl',
      farmer: 'Ahmet Çiftçi',
      soilType: 'Killi-Tınlı',
      irrigation: 'Damla Sulama'
    },
    blockchainInfo: {
      network: 'Ethereum',
      blockNumber: '18456789',
      gasUsed: '0.002 ETH',
      transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
    }
  },
  {
    id: '2',
    name: 'Portakal Ağacı #456',
    image: 'https://images.unsplash.com/photo-1590086783191-a0694c7d1e6e',
    tokenId: '0xabcdef1234567890',
    contractAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    mintDate: '2024-02-20',
    rarity: 'Common',
    attributes: {
      age: '8 yıl',
      location: 'Antalya, Finike',
      health: '87%',
      yield: '280 kg/yıl',
      farmer: 'Mehmet Yılmaz',
      soilType: 'Kumlu-Tınlı',
      irrigation: 'Yağmurlama'
    },
    blockchainInfo: {
      network: 'Ethereum',
      blockNumber: '18523456',
      gasUsed: '0.002 ETH',
      transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
    }
  },
  {
    id: '3',
    name: 'Fındık Ağacı #789',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b',
    tokenId: '0x7890abcdef123456',
    contractAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    mintDate: '2024-03-10',
    rarity: 'Epic',
    attributes: {
      age: '25 yıl',
      location: 'Giresun, Bulancak',
      health: '92%',
      yield: '450 kg/yıl',
      farmer: 'Ali Demir',
      soilType: 'Organik Zengin',
      irrigation: 'Doğal Yağış'
    },
    blockchainInfo: {
      network: 'Ethereum',
      blockNumber: '18678901',
      gasUsed: '0.002 ETH',
      transactionHash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456'
    }
  }
];

export default function NFTCollectionScreen() {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Epic': return '#FFD700';
      case 'Rare': return '#C0C0C0';
      case 'Common': return '#CD7F32';
      default: return '#999';
    }
  };

  const getRarityTextColor = (rarity: string) => {
    return rarity === 'Epic' ? '#000' : '#fff';
  };

  const openBlockchainExplorer = async (txHash: string, network: string, nftName: string) => {
    try {
      // Demo amaçlı - gerçek blockchain explorer yerine bilgilendirme göster
      Alert.alert(
        'NFT Blockchain Explorer',
        `Bu NFT test ağında (Testnet) oluşturulmuştur.\n\nNFT: ${nftName}\nİşlem Hash: ${txHash.substring(0, 20)}...\nAğ: ${network} Testnet\n\nGerçek blockchain explorer'da görüntülemek için:\n1. Ana ağa (Mainnet) geçiş yapın\n2. İşlem hash'ini kopyalayın\n3. Etherscan.io adresine gidin`,
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
        'NFT detayları gösterilirken bir hata oluştu.',
        [{ text: 'Tamam' }]
      );
    }
  };

  const showNFTDetails = (nft: any) => {
    Alert.alert(
      'NFT Blockchain Detayları',
      `NFT: ${nft.name}\nToken ID: ${nft.tokenId}\n\nAğ: ${nft.blockchainInfo.network} (Testnet)\nBlok: ${nft.blockchainInfo.blockNumber}\nGas: ${nft.blockchainInfo.gasUsed}\n\nBu NFT test ağında oluşturulmuştur. Blockchain explorer'da görüntülemek istiyor musunuz?`,
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Detayları Göster', 
          onPress: () => openBlockchainExplorer(nft.blockchainInfo.transactionHash, nft.blockchainInfo.network, nft.name)
        }
      ]
    );
  };

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
          <Text style={styles.headerTitle}>NFT Koleksiyonum</Text>
          <View style={styles.headerStats}>
            <Text style={styles.statText}>{NFT_COLLECTION.length} NFT</Text>
          </View>
        </View>
      </Surface>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Collection Stats */}
        <Surface style={styles.statsCard} elevation={2}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{NFT_COLLECTION.length}</Text>
              <Text style={styles.statLabel}>Toplam NFT</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Farklı Tür</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>1</Text>
              <Text style={styles.statLabel}>Epic</Text>
            </View>
          </View>
        </Surface>

        {/* NFT List */}
        {NFT_COLLECTION.map((nft) => (
          <Surface key={nft.id} style={styles.nftCard} elevation={3}>
            <View style={styles.nftHeader}>
              <Image source={{ uri: nft.image }} style={styles.nftImage} />
              <View style={styles.nftHeaderInfo}>
                <Text style={styles.nftName}>{nft.name}</Text>
                <Chip 
                  style={[
                    styles.rarityChip,
                    { backgroundColor: getRarityColor(nft.rarity) }
                  ]}
                  textStyle={[
                    styles.rarityText,
                    { color: getRarityTextColor(nft.rarity) }
                  ]}
                >
                  {nft.rarity}
                </Chip>
              </View>
            </View>

            <View style={styles.nftDetails}>
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Ağaç Özellikleri</Text>
                <View style={styles.attributesGrid}>
                  <View style={styles.attributeItem}>
                    <Text style={styles.attributeLabel}>Yaş</Text>
                    <Text style={styles.attributeValue}>{nft.attributes.age}</Text>
                  </View>
                  <View style={styles.attributeItem}>
                    <Text style={styles.attributeLabel}>Sağlık</Text>
                    <Text style={styles.attributeValue}>{nft.attributes.health}</Text>
                  </View>
                  <View style={styles.attributeItem}>
                    <Text style={styles.attributeLabel}>Verim</Text>
                    <Text style={styles.attributeValue}>{nft.attributes.yield}</Text>
                  </View>
                  <View style={styles.attributeItem}>
                    <Text style={styles.attributeLabel}>Konum</Text>
                    <Text style={styles.attributeValue}>{nft.attributes.location}</Text>
                  </View>
                  <View style={styles.attributeItem}>
                    <Text style={styles.attributeLabel}>Çiftçi</Text>
                    <Text style={styles.attributeValue}>{nft.attributes.farmer}</Text>
                  </View>
                  <View style={styles.attributeItem}>
                    <Text style={styles.attributeLabel}>Toprak</Text>
                    <Text style={styles.attributeValue}>{nft.attributes.soilType}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Blockchain Bilgileri</Text>
                <View style={styles.blockchainInfo}>
                  <View style={styles.blockchainItem}>
                    <Text style={styles.blockchainLabel}>Token ID</Text>
                    <Text style={styles.blockchainValue}>{nft.tokenId}</Text>
                  </View>
                  <View style={styles.blockchainItem}>
                    <Text style={styles.blockchainLabel}>Ağ</Text>
                    <Text style={styles.blockchainValue}>{nft.blockchainInfo.network}</Text>
                  </View>
                  <View style={styles.blockchainItem}>
                    <Text style={styles.blockchainLabel}>Blok No</Text>
                    <Text style={styles.blockchainValue}>{nft.blockchainInfo.blockNumber}</Text>
                  </View>
                  <View style={styles.blockchainItem}>
                    <Text style={styles.blockchainLabel}>Gas Kullanımı</Text>
                    <Text style={styles.blockchainValue}>{nft.blockchainInfo.gasUsed}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.nftActions}>
              <Button 
                mode="outlined" 
                style={styles.actionButton}
                onPress={() => router.push({
                  pathname: '/tree/[id]' as const,
                  params: { id: nft.id }
                })}
              >
                Ağaç Detayları
              </Button>
              <Button 
                mode="contained" 
                style={styles.actionButton}
                onPress={() => showNFTDetails(nft)}
              >
                Blockchain'de Görüntüle
              </Button>
            </View>
          </Surface>
        ))}
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
  statsCard: {
    margin: 16,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D6A4F',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  nftCard: {
    margin: 16,
    marginTop: 8,
    borderRadius: 16,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  nftHeader: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  nftImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  nftHeaderInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nftName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B4332',
    marginBottom: 8,
  },
  rarityChip: {
    alignSelf: 'flex-start',
  },
  rarityText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  nftDetails: {
    padding: 16,
  },
  detailSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B4332',
    marginBottom: 12,
  },
  attributesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  attributeItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
  },
  attributeLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  attributeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1B4332',
  },
  blockchainInfo: {
    gap: 8,
  },
  blockchainItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  blockchainLabel: {
    fontSize: 14,
    color: '#666',
  },
  blockchainValue: {
    fontSize: 14,
    color: '#1B4332',
    fontWeight: '500',
    fontFamily: 'monospace',
  },
  nftActions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  actionButton: {
    flex: 1,
  },
}); 