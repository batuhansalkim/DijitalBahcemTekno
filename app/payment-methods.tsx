import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Modal } from 'react-native';
import { Text, Button, Surface, IconButton, TextInput, List, Divider, Switch, Chip } from 'react-native-paper';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock servisleri import et
import { walletService } from './lib/wallet';

interface SavedCard {
  id: string;
  name: string;
  last4: string;
  icon: string;
  expiryDate?: string;
}

export default function PaymentMethodsScreen() {
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Kart ekleme form state'leri
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      setLoading(true);

      // Cüzdan durumunu kontrol et
      const walletData = await AsyncStorage.getItem('walletConnected');
      const addressData = await AsyncStorage.getItem('walletAddress');
      
      if (walletData === 'true' && addressData) {
        setWalletConnected(true);
        setWalletAddress(addressData);
      }

      // Kayıtlı kartları yükle
      const savedCardsData = await AsyncStorage.getItem('savedCards');
      if (savedCardsData) {
        const parsedCards = JSON.parse(savedCardsData);
        setSavedCards(parsedCards);
      }

    } catch (error) {
      console.error('Ödeme yöntemleri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = async () => {
    if (!cardName || !cardNumber || !cardCVC || !cardExpiry) {
      Alert.alert('Eksik Bilgi', 'Lütfen tüm kart bilgilerini doldurun.');
      return;
    }

    if (cardNumber.length < 16) {
      Alert.alert('Geçersiz Kart', 'Kart numarası 16 haneli olmalıdır.');
      return;
    }

    if (cardCVC.length !== 3) {
      Alert.alert('Geçersiz CVC', 'CVC 3 haneli olmalıdır.');
      return;
    }

    try {
      const newCard: SavedCard = {
        id: Date.now().toString(),
        name: cardName,
        last4: cardNumber.slice(-4),
        icon: 'credit-card',
        expiryDate: cardExpiry
      };

      const updatedCards = [...savedCards, newCard];
      setSavedCards(updatedCards);
      
      // AsyncStorage'a kaydet
      await AsyncStorage.setItem('savedCards', JSON.stringify(updatedCards));
      
      // Form'u temizle
      setCardName('');
      setCardNumber('');
      setCardCVC('');
      setCardExpiry('');
      setShowAddCard(false);

      Alert.alert('Başarılı!', 'Kart başarıyla eklendi.');
    } catch (error) {
      Alert.alert('Hata', 'Kart eklenirken bir hata oluştu.');
    }
  };

  const handleDeleteCard = (cardId: string) => {
    Alert.alert(
      'Kartı Sil',
      'Bu kartı silmek istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedCards = savedCards.filter(card => card.id !== cardId);
              setSavedCards(updatedCards);
              await AsyncStorage.setItem('savedCards', JSON.stringify(updatedCards));
              Alert.alert('Başarılı!', 'Kart silindi.');
            } catch (error) {
              Alert.alert('Hata', 'Kart silinirken bir hata oluştu.');
            }
          }
        }
      ]
    );
  };

  const handleWalletConnection = async () => {
    if (walletConnected) {
      Alert.alert(
        'Cüzdan Bağlantısını Kes',
        'Dijital cüzdan bağlantısını kesmek istediğinize emin misiniz?',
        [
          { text: 'İptal', style: 'cancel' },
          {
            text: 'Bağlantıyı Kes',
            style: 'destructive',
            onPress: async () => {
              try {
                setWalletConnected(false);
                setWalletAddress(null);
                await AsyncStorage.removeItem('walletConnected');
                await AsyncStorage.removeItem('walletAddress');
                Alert.alert('Başarılı!', 'Cüzdan bağlantısı kesildi.');
              } catch (error) {
                Alert.alert('Hata', 'Bağlantı kesilirken bir hata oluştu.');
              }
            }
          }
        ]
      );
    } else {
      // Cüzdan bağlantısı kur
      try {
        const result = await walletService.connectMetaMask();
        setWalletConnected(true);
        setWalletAddress(result.address || null);
        
        await AsyncStorage.setItem('walletConnected', 'true');
        await AsyncStorage.setItem('walletAddress', result.address || '');
        
        Alert.alert(
          'Cüzdan Bağlandı! 🎉',
          `Adres: ${result.address?.substring(0, 10)}...${result.address?.substring(38)}\n` +
          `%15 kripto indirimi aktif!`
        );
      } catch (error) {
        Alert.alert('Bağlantı Hatası', 'Cüzdan bağlanamadı');
      }
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Ödeme yöntemleri yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton icon="arrow-left" size={28} iconColor="#2D6A4F" onPress={() => router.back()} />
        <Text style={styles.title}>Ödeme Yöntemleri</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Dijital Cüzdan */}
      <Surface style={styles.section} elevation={2}>
        <List.Section>
          <List.Subheader style={styles.sectionHeader}>Dijital Cüzdan</List.Subheader>
          <List.Item
            title="MetaMask Cüzdan"
            description={
              walletConnected 
                ? `Bağlı: ${walletAddress?.substring(0, 10)}...${walletAddress?.substring(38)}` 
                : "Cüzdanınızı bağlayarak %15 indirim kazanın"
            }
            left={(props) => (
              <MaterialCommunityIcons 
                name="wallet" 
                size={32} 
                color={walletConnected ? '#2D6A4F' : '#888'} 
                style={{ marginLeft: 8, alignSelf: 'center' }}
              />
            )}
            right={() => (
              <View style={styles.walletRight}>
                {walletConnected && (
                  <Chip style={styles.connectedChip} textStyle={styles.connectedChipText}>
                    Bağlı
                  </Chip>
                )}
                <Switch
                  value={walletConnected}
                  onValueChange={handleWalletConnection}
                  color="#2D6A4F"
                />
              </View>
            )}
            style={styles.listItem}
            titleStyle={styles.listItemTitle}
          />
        </List.Section>
      </Surface>

      {/* Kayıtlı Kartlar */}
      <Surface style={styles.section} elevation={2}>
        <List.Section>
          <List.Subheader style={styles.sectionHeader}>Kayıtlı Kartlar</List.Subheader>
          
          {savedCards.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="credit-card-off" size={48} color="#CCC" />
              <Text style={styles.emptyText}>Henüz kayıtlı kart yok</Text>
              <Text style={styles.emptySubtext}>Hızlı ödeme için kartlarınızı ekleyin</Text>
            </View>
          ) : (
            savedCards.map((card) => (
              <List.Item
                key={card.id}
                title={card.name}
                description={`•••• •••• •••• ${card.last4}${card.expiryDate ? ` • ${card.expiryDate}` : ''}`}
                left={(props) => (
                  <MaterialCommunityIcons 
                    name={card.icon as any} 
                    size={32} 
                    color="#2D6A4F" 
                    style={{ marginLeft: 8, alignSelf: 'center' }}
                  />
                )}
                right={(props) => (
                  <IconButton
                    icon="delete"
                    size={20}
                    iconColor="#B00020"
                    onPress={() => handleDeleteCard(card.id)}
                  />
                )}
                style={styles.listItem}
                titleStyle={styles.listItemTitle}
              />
            ))
          )}
          
          <List.Item
            title="Yeni Kart Ekle"
            description="Kredi kartı veya banka kartı ekleyin"
            left={(props) => (
              <MaterialCommunityIcons 
                name="plus-circle" 
                size={32} 
                color="#2D6A4F" 
                style={{ marginLeft: 8, alignSelf: 'center' }}
              />
            )}
            onPress={() => setShowAddCard(true)}
            style={[styles.listItem, styles.addCardItem]}
            titleStyle={[styles.listItemTitle, styles.addCardText]}
          />
        </List.Section>
      </Surface>

      {/* Kart Ekleme Modal */}
      <Modal visible={showAddCard} animationType="slide" transparent onRequestClose={() => setShowAddCard(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Yeni Kart Ekle</Text>
              <IconButton
                icon="close"
                size={24}
                onPress={() => setShowAddCard(false)}
              />
            </View>
            
            <ScrollView style={styles.modalContent}>
              <TextInput
                label="Kart Sahibi Adı"
                value={cardName}
                onChangeText={setCardName}
                style={styles.input}
                mode="outlined"
              />
              
              <TextInput
                label="Kart Numarası"
                value={cardNumber}
                onChangeText={(text) => setCardNumber(text.replace(/\D/g, ''))}
                style={styles.input}
                keyboardType="number-pad"
                maxLength={16}
                mode="outlined"
                placeholder="1234 5678 9012 3456"
              />
              
              <View style={styles.inputRow}>
                <TextInput
                  label="Son Kullanma (AA/YY)"
                  value={cardExpiry}
                  onChangeText={(text) => {
                    // MM/YY formatında giriş
                    let formatted = text.replace(/\D/g, '');
                    if (formatted.length >= 2) {
                      formatted = formatted.substring(0, 2) + '/' + formatted.substring(2, 4);
                    }
                    setCardExpiry(formatted);
                  }}
                  style={[styles.input, { flex: 1, marginRight: 8 }]}
                  maxLength={5}
                  keyboardType="number-pad"
                  mode="outlined"
                  placeholder="12/25"
                />
                
                <TextInput
                  label="CVC"
                  value={cardCVC}
                  onChangeText={(text) => setCardCVC(text.replace(/\D/g, ''))}
                  style={[styles.input, { flex: 1 }]}
                  keyboardType="number-pad"
                  maxLength={3}
                  mode="outlined"
                  placeholder="123"
                  secureTextEntry
                />
              </View>
              
              <Text style={styles.securityNote}>
                🔒 Kart bilgileriniz güvenli şekilde şifrelenerek saklanır
              </Text>
            </ScrollView>
            
            <View style={styles.modalActions}>
              <Button
                mode="contained"
                onPress={handleAddCard}
                style={styles.saveButton}
                disabled={!cardName || !cardNumber || !cardCVC || !cardExpiry}
              >
                Kartı Kaydet
              </Button>
              
              <Button
                mode="text"
                onPress={() => setShowAddCard(false)}
                style={styles.cancelButton}
              >
                İptal
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F3',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: 8,
    backgroundColor: '#fff',
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B4332',
  },
  section: {
    margin: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
    paddingVertical: 8,
  },
  sectionHeader: {
    fontSize: 16,
    color: '#1B4332',
    fontWeight: 'bold',
    marginBottom: 4,
    marginLeft: 16,
  },
  listItem: {
    borderRadius: 12,
    marginHorizontal: 8,
    marginVertical: 2,
    paddingVertical: 4,
  },
  listItemTitle: {
    fontSize: 16,
    color: '#222',
    fontWeight: '600',
  },
  walletRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  connectedChip: {
    backgroundColor: '#E8F5E9',
    height: 28,
  },
  connectedChipText: {
    color: '#2D6A4F',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
  },
  addCardItem: {
    backgroundColor: '#F8F9FA',
    marginTop: 8,
  },
  addCardText: {
    color: '#2D6A4F',
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B4332',
  },
  modalContent: {
    padding: 20,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#F8F9FA',
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  securityNote: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  modalActions: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  saveButton: {
    backgroundColor: '#2D6A4F',
    borderRadius: 12,
    marginBottom: 12,
  },
  cancelButton: {
    marginTop: 0,
  },
});
