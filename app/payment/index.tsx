import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Modal, Image } from 'react-native';
import { Text, Button, Card, RadioButton, TextInput, Surface, IconButton, Divider, Chip } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock servisleri import et
import { walletService } from '../lib/wallet';

const MOCK_CARDS = [
  { id: '1', name: 'Ziraat Bankası', last4: '4242', icon: 'credit-card' },
  { id: '2', name: 'İş Bankası', last4: '8765', icon: 'credit-card' },
];

export default function PaymentScreen() {
  const { treeId, amount, rentalData } = useLocalSearchParams();
  const [selectedCard, setSelectedCard] = useState('');
  const [showAddCard, setShowAddCard] = useState(false);
  const [useWallet, setUseWallet] = useState(false);
  const [cards, setCards] = useState(MOCK_CARDS);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserPaymentData();
  }, []);

  const loadUserPaymentData = async () => {
    try {
      setLoading(true);
      
      // Kiralama verilerini parse et
      if (rentalData) {
        try {
          const parsedData = JSON.parse(rentalData as string);
          console.log('Kiralama verileri:', parsedData);
        } catch (error) {
          console.error('Kiralama verileri parse edilemedi:', error);
        }
      }

      // Cüzdan durumunu kontrol et
      const walletData = await AsyncStorage.getItem('walletConnected');
      const addressData = await AsyncStorage.getItem('walletAddress');
      
      if (walletData === 'true' && addressData) {
        setWalletConnected(true);
        setWalletAddress(addressData);
        // Cüzdan bağlıysa varsayılan olarak crypto ödeme seç
        setUseWallet(true);
      }

      // Kayıtlı kartları yükle
      const savedCards = await AsyncStorage.getItem('savedCards');
      if (savedCards) {
        const parsedCards = JSON.parse(savedCards);
        setCards([...MOCK_CARDS, ...parsedCards]);
      }

    } catch (error) {
      console.error('Ödeme verileri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = () => {
    if (!cardName || !cardNumber || !cardCVC || !cardExpiry) {
      Alert.alert('Eksik Bilgi', 'Lütfen tüm kart bilgilerini doldurun.');
      return;
    }
    setCards([...cards, { id: Date.now().toString(), name: cardName, last4: cardNumber.slice(-4), icon: 'credit-card' }]);
    setShowAddCard(false);
    setCardName(''); setCardNumber(''); setCardCVC(''); setCardExpiry('');
  };

  const handlePayment = async () => {
    if (useWallet) {
      await handleCryptoPayment();
      return;
    }
    if (!selectedCard) {
      Alert.alert('Kart Seçimi', 'Lütfen bir kart seçin veya ekleyin.');
      return;
    }
    handleCardPayment();
  };

  const handleCryptoPayment = async () => {
    try {
      const amount = walletConnected ? Math.round(Number(amount) * 0.85) : Number(amount);
      
      Alert.alert(
        'MetaMask ile Ödeme 💰',
        `Ödeme Tutarı: ${amount} ₺ (≈ 0.${Math.floor(Math.random() * 9) + 1} ETH)\n` +
        `Gas Fee: ~0.002 ETH\n` +
        `Toplam: ~0.${Math.floor(Math.random() * 9) + 1}2 ETH\n\n` +
        `MetaMask uygulaması açılacak ve işlemi onaylamanız istenecek.`,
        [
          { text: 'İptal', style: 'cancel' },
          { 
            text: 'MetaMask\'ı Aç',
            onPress: () => processMetaMaskPayment(amount)
          }
        ]
      );
    } catch (error) {
      Alert.alert('Hata', 'Kripto ödeme başlatılamadı');
    }
  };

  const processMetaMaskPayment = async (amount: number) => {
    try {
      // MetaMask simülasyonu
      Alert.alert(
        'İşlem Onaylanıyor... ⏳',
        'MetaMask\'ta işlemi onayladınız.\nBlockchain\'de onay bekleniyor...\n\nBu işlem 1-3 dakika sürebilir.',
        [
          {
            text: 'İşlem Durumunu Gör',
            onPress: () => {
              // Başarı simülasyonu
              setTimeout(() => {
                Alert.alert(
                  'Ödeme Başarılı! ✅',
                  `${amount} ₺ değerinde kripto ödeme tamamlandı.\n\n` +
                  `İşlem Hash: 0x${Math.random().toString(16).substring(2, 18)}...\n` +
                  `Blok: ${Math.floor(Math.random() * 1000000) + 18000000}\n\n` +
                  `Etherscan\'da görüntüleyebilirsiniz.`,
                  [
                    {
                      text: 'Tamam',
                      onPress: () => router.push('/payment/success')
                    }
                  ]
                );
              }, 2000);
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('İşlem Başarısız', 'Ödeme işlemi iptal edildi veya başarısız oldu');
    }
  };

  const handleCardPayment = () => {
    Alert.alert(
      'Kart ile Ödeme 💳',
      `Seçilen Kart: ${cards.find(c => c.id === selectedCard)?.name}\n` +
      `Tutar: ${amount} ₺\n\n` +
      `3D Secure doğrulama sayfasına yönlendirileceksiniz.`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Ödemeyi Onayla',
          onPress: () => {
            // Kart ödeme simülasyonu
            Alert.alert(
              '3D Secure Doğrulama 🔐',
              'Telefonunuza gelen SMS kodunu girin:\n\n' +
              `Kod: ${Math.floor(Math.random() * 900000) + 100000}`,
              [
                { text: 'İptal', style: 'cancel' },
                {
                  text: 'Kodu Girdim',
                  onPress: () => {
                    Alert.alert(
                      'Ödeme Başarılı! ✅',
                      `${amount} ₺ tutarında kart ödemesi tamamlandı.`,
                      [
                        {
                          text: 'Tamam',
                          onPress: () => router.push('/payment/success')
                        }
                      ]
                    );
                  }
                }
              ]
            );
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Ödeme bilgileri yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton icon="arrow-left" size={28} iconColor="#fff" onPress={() => router.back()} />
        <Text style={styles.headerTitle}>Ödeme Yöntemi</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Kiralama Özeti */}
        <Surface style={styles.summaryCard} elevation={4}>
          <View style={styles.summaryHeader}>
            <MaterialCommunityIcons name="receipt" size={24} color="#2D6A4F" />
            <Text style={styles.summaryTitle}>Ödeme Özeti</Text>
          </View>
          <View style={styles.summaryContent}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Toplam Tutar</Text>
              <Text style={styles.summaryAmount}>{amount} ₺</Text>
            </View>
            {useWallet && walletConnected && (
              <>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Kripto İndirimi (%15)</Text>
                  <Text style={styles.discountAmount}>-{Math.round(Number(amount) * 0.15)} ₺</Text>
                </View>
                <Divider style={styles.summaryDivider} />
                <View style={styles.summaryRow}>
                  <Text style={styles.finalAmountLabel}>Net Tutar</Text>
                  <Text style={styles.finalAmount}>{Math.round(Number(amount) * 0.85)} ₺</Text>
                </View>
              </>
            )}
          </View>
        </Surface>
        {/* Ödeme Yöntemleri */}
        <Surface style={styles.methodsSection} elevation={2}>
          <View style={styles.methodsHeader}>
            <MaterialCommunityIcons name="credit-card" size={24} color="#2D6A4F" />
            <Text style={styles.methodsTitle}>Ödeme Yöntemi Seçin</Text>
          </View>
          
          <View style={styles.methodsList}>
            {/* Kart Ödeme */}
            <View style={[
              styles.methodCard, 
              !useWallet && styles.selectedMethodCard
            ]}>
              <View style={styles.methodCardContent}>
                <View style={styles.methodCardLeft}>
                  <View style={[
                    styles.methodIcon,
                    !useWallet && styles.selectedMethodIcon
                  ]}>
                    <MaterialCommunityIcons 
                      name="credit-card" 
                      size={28} 
                      color={!useWallet ? '#fff' : '#2D6A4F'} 
                    />
                  </View>
                  <View style={styles.methodInfo}>
                    <Text style={[
                      styles.methodTitle,
                      !useWallet && styles.selectedMethodTitle
                    ]}>
                      Kredi/Banka Kartı
                    </Text>
                    <Text style={styles.methodDescription}>
                      Visa, MasterCard, Troy kabul edilir
                    </Text>
                  </View>
                </View>
                <RadioButton.Android 
                  value="card" 
                  status={!useWallet ? 'checked' : 'unchecked'} 
                  onPress={() => setUseWallet(false)} 
                  color="#2D6A4F" 
                />
              </View>
            </View>

            {/* Dijital Cüzdan */}
            <View style={[
              styles.methodCard, 
              useWallet && styles.selectedMethodCard,
              !walletConnected && styles.disabledMethodCard
            ]}>
              <View style={styles.methodCardContent}>
                <View style={styles.methodCardLeft}>
                  <View style={[
                    styles.methodIcon,
                    useWallet && walletConnected && styles.selectedMethodIcon,
                    !walletConnected && styles.disabledMethodIcon
                  ]}>
                    <MaterialCommunityIcons 
                      name="wallet" 
                      size={28} 
                      color={
                        !walletConnected ? '#CCC' : 
                        useWallet ? '#fff' : '#2D6A4F'
                      } 
                    />
                  </View>
                  <View style={styles.methodInfo}>
                    <Text style={[
                      styles.methodTitle,
                      useWallet && walletConnected && styles.selectedMethodTitle,
                      !walletConnected && styles.disabledMethodTitle
                    ]}>
                      Dijital Cüzdan
                      {walletConnected && (
                        <Text style={styles.discountBadge}> %15 İndirim</Text>
                      )}
                    </Text>
                    <Text style={[
                      styles.methodDescription,
                      !walletConnected && styles.disabledText
                    ]}>
                      {walletConnected ? 
                        `${walletAddress?.substring(0, 10)}...${walletAddress?.substring(38)}` :
                        'Profil sayfasından cüzdanınızı bağlayın'
                      }
                    </Text>
                  </View>
                </View>
                <RadioButton.Android 
                  value="wallet" 
                  status={useWallet ? 'checked' : 'unchecked'} 
                  onPress={() => walletConnected ? setUseWallet(true) : Alert.alert('Cüzdan Bağlı Değil', 'Önce profil sayfasından cüzdanınızı bağlamanız gerekiyor.')} 
                  color="#2D6A4F" 
                  disabled={!walletConnected}
                />
        </View>
        </View>
      </View>
        </Surface>
      {!useWallet && (
        <View style={styles.cardSection}>
          <Text style={styles.sectionTitle}>Kart Seçimi</Text>
          {cards.map(card => (
            <View key={card.id} style={[styles.paymentCard, selectedCard === card.id && styles.selectedCard]}>
              <View style={styles.cardContent}>
                <MaterialCommunityIcons name={card.icon} size={28} color="#2D6A4F" />
                <Text style={styles.cardText}>{card.name} •••• {card.last4}</Text>
                {selectedCard === card.id && <MaterialCommunityIcons name="check-circle" size={24} color="#2D6A4F" />}
                <RadioButton.Android value={card.id} status={selectedCard === card.id ? 'checked' : 'unchecked'} onPress={() => setSelectedCard(card.id)} color="#2D6A4F" />
              </View>
            </View>
          ))}
          <Button mode="outlined" icon="plus" onPress={() => setShowAddCard(true)} style={styles.addCardButton} labelStyle={styles.addCardButtonLabel}>
            Kart Ekle
          </Button>
        </View>
      )}
        <Button 
          mode="contained" 
          style={styles.payButton} 
          labelStyle={styles.payButtonLabel}
          onPress={handlePayment}
          disabled={!useWallet && !selectedCard}
        >
          {useWallet ? 
            `${walletConnected ? Math.round(Number(amount) * 0.85) : amount} ₺ - Kripto ile Öde` :
            `${amount} ₺ - Kart ile Öde`
          }
      </Button>
      </ScrollView>
      
      {/* Kart Ekle Modal */}
      <Modal visible={showAddCard} animationType="slide" transparent onRequestClose={() => setShowAddCard(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Kart Ekle</Text>
            <TextInput label="Kart Sahibi" value={cardName} onChangeText={setCardName} style={styles.input} />
            <TextInput label="Kart Numarası" value={cardNumber} onChangeText={setCardNumber} style={styles.input} keyboardType="number-pad" maxLength={16} />
            <View style={styles.inputRow}>
              <TextInput label="SKT (AA/YY)" value={cardExpiry} onChangeText={setCardExpiry} style={[styles.input, { flex: 1, marginRight: 8 }]} maxLength={5} />
              <TextInput label="CVC" value={cardCVC} onChangeText={setCardCVC} style={[styles.input, { flex: 1 }]} keyboardType="number-pad" maxLength={3} />
            </View>
            <Button mode="contained" onPress={handleAddCard} style={styles.saveCardButton}>Kaydet</Button>
            <Button mode="text" onPress={() => setShowAddCard(false)} style={styles.cancelButton}>İptal</Button>
          </View>
        </View>
      </Modal>
        </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F5F7F3',
  },
  
  // Header
  header: {
    backgroundColor: '#2D6A4F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  
  // Özet Kartı
  summaryCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B4332',
    marginLeft: 12,
  },
  summaryContent: {
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1B4332',
  },
  discountAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E53E3E',
  },
  summaryDivider: {
    marginVertical: 8,
  },
  finalAmountLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D6A4F',
  },
  finalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D6A4F',
  },

  // Ödeme Yöntemleri
  methodsSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  methodsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  methodsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B4332',
    marginLeft: 12,
  },
  methodsList: {
    gap: 12,
  },
  methodCard: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#F8F9FA',
    overflow: 'hidden',
  },
  selectedMethodCard: {
    borderColor: '#2D6A4F',
    backgroundColor: '#E8F5E9',
  },
  disabledMethodCard: {
    opacity: 0.6,
    backgroundColor: '#F0F0F0',
  },
  methodCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  methodCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  methodIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  selectedMethodIcon: {
    backgroundColor: '#2D6A4F',
  },
  disabledMethodIcon: {
    backgroundColor: '#E0E0E0',
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B4332',
    marginBottom: 4,
  },
  selectedMethodTitle: {
    color: '#2D6A4F',
  },
  disabledMethodTitle: {
    color: '#999',
  },
  methodDescription: {
    fontSize: 14,
    color: '#666',
  },
  discountBadge: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E53E3E',
  },
  disabledText: { 
    color: '#999' 
  },
  cardSection: { marginVertical: 12, width: '100%' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1B4332', marginBottom: 8 },
  paymentCard: { marginBottom: 8, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, backgroundColor: '#F8F9FA', width: '100%' },
  selectedCard: { borderColor: '#2D6A4F', backgroundColor: '#E8F5E9' },
  cardContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 8 },
  cardText: { fontSize: 16, color: '#222', marginLeft: 12, flex: 1 },
  addCardButton: { marginTop: 8, borderColor: '#2D6A4F', borderRadius: 8 },
  addCardButtonLabel: { color: '#2D6A4F', fontWeight: 'bold' },
  
  // Ödeme Butonu
  payButton: { 
    marginTop: 24,
    backgroundColor: '#2D6A4F', 
    borderRadius: 16,
    paddingVertical: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  payButtonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    paddingVertical: 4,
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { backgroundColor: '#fff', padding: 24, borderRadius: 20, width: '90%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1B4332', marginBottom: 16 },
  input: { marginBottom: 12, backgroundColor: '#F8F9FA' },
  inputRow: { flexDirection: 'row', marginBottom: 12 },
  saveCardButton: { backgroundColor: '#2D6A4F', borderRadius: 12, marginBottom: 8 },
  cancelButton: { marginTop: 0 },
}); 