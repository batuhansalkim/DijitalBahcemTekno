import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Modal, Image } from 'react-native';
import { Text, Button, Card, RadioButton, TextInput, Surface, IconButton, Divider } from 'react-native-paper';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MOCK_CARDS = [
  { id: '1', name: 'Ziraat Bankası', last4: '4242', icon: 'credit-card' },
  { id: '2', name: 'İş Bankası', last4: '8765', icon: 'credit-card' },
];

export default function PaymentScreen() {
  const [selectedCard, setSelectedCard] = useState('');
  const [showAddCard, setShowAddCard] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [useWallet, setUseWallet] = useState(false);
  const [cards, setCards] = useState(MOCK_CARDS);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');

  const handleAddCard = () => {
    if (!cardName || !cardNumber || !cardCVC || !cardExpiry) {
      Alert.alert('Eksik Bilgi', 'Lütfen tüm kart bilgilerini doldurun.');
      return;
    }
    setCards([...cards, { id: Date.now().toString(), name: cardName, last4: cardNumber.slice(-4), icon: 'credit-card' }]);
    setShowAddCard(false);
    setCardName(''); setCardNumber(''); setCardCVC(''); setCardExpiry('');
  };

  const handlePayment = () => {
    if (useWallet) {
      setShowWalletModal(true);
      return;
    }
    if (!selectedCard) {
      Alert.alert('Kart Seçimi', 'Lütfen bir kart seçin veya ekleyin.');
      return;
    }
    router.push('/payment/success');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Ödeme Yöntemi Seçin</Text>
      <Divider style={{ marginVertical: 16 }} />
      <View style={styles.methodRow}>
        <View style={[styles.methodBox, !useWallet && styles.selectedMethod]}>
          <RadioButton.Android value="card" status={!useWallet ? 'checked' : 'unchecked'} onPress={() => setUseWallet(false)} color="#2D6A4F" />
          <MaterialCommunityIcons name="credit-card" size={28} color={!useWallet ? '#2D6A4F' : '#888'} style={{ marginRight: 8 }} />
          <Text style={styles.methodLabel} numberOfLines={1}>Kredi/Banka Kartı</Text>
        </View>
        <View style={[styles.methodBox, useWallet && styles.selectedMethod]}>
          <RadioButton.Android value="wallet" status={useWallet ? 'checked' : 'unchecked'} onPress={() => setUseWallet(true)} color="#2D6A4F" />
          <MaterialCommunityIcons name="wallet" size={28} color={useWallet ? '#2D6A4F' : '#888'} style={{ marginRight: 8 }} />
          <Text style={styles.methodLabel} numberOfLines={1}>Dijital Cüzdan <Text style={styles.walletDiscount}>%30 indirim</Text></Text>
        </View>
      </View>
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
      <Button mode="contained" style={styles.payButton} onPress={handlePayment}>
        Ödemeyi Onayla
      </Button>
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
      {/* Dijital Cüzdan Modal */}
      <Modal visible={showWalletModal} animationType="slide" transparent onRequestClose={() => setShowWalletModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Dijital Cüzdan ile Öde</Text>
            <Text style={styles.walletInfo}>WalletConnect ile QR kodu mobil cüzdanınızdan okutun.</Text>
            <View style={styles.qrPlaceholder}>
              <MaterialCommunityIcons name="qrcode-scan" size={64} color="#2D6A4F" />
            </View>
            <Button mode="contained" onPress={() => { setShowWalletModal(false); router.push('/payment/success'); }} style={styles.payButton}>Ödeme Onaylandı</Button>
            <Button mode="text" onPress={() => setShowWalletModal(false)} style={styles.cancelButton}>İptal</Button>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff', flexGrow: 1, minHeight: '100%' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1B4332', marginBottom: 8, textAlign: 'center' },
  methodRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 18, gap: 8 },
  methodBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FA', borderRadius: 8, padding: 8, marginHorizontal: 0, borderWidth: 1, borderColor: '#E0E0E0', minWidth: 0 },
  selectedMethod: { borderColor: '#2D6A4F', backgroundColor: '#E8F5E9' },
  methodLabel: { fontSize: 15, color: '#222', fontWeight: 'bold', flexShrink: 1 },
  walletDiscount: { color: '#2D6A4F', fontWeight: 'bold', fontSize: 15 },
  cardSection: { marginVertical: 12, width: '100%' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1B4332', marginBottom: 8 },
  paymentCard: { marginBottom: 8, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, backgroundColor: '#F8F9FA', width: '100%' },
  selectedCard: { borderColor: '#2D6A4F', backgroundColor: '#E8F5E9' },
  cardContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 8 },
  cardText: { fontSize: 16, color: '#222', marginLeft: 12, flex: 1 },
  addCardButton: { marginTop: 8, borderColor: '#2D6A4F', borderRadius: 8 },
  addCardButtonLabel: { color: '#2D6A4F', fontWeight: 'bold' },
  payButton: { marginTop: 20, backgroundColor: '#2D6A4F', borderRadius: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { backgroundColor: '#fff', padding: 24, borderRadius: 20, width: '90%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1B4332', marginBottom: 16 },
  input: { marginBottom: 12, backgroundColor: '#F8F9FA' },
  inputRow: { flexDirection: 'row', marginBottom: 12 },
  saveCardButton: { backgroundColor: '#2D6A4F', borderRadius: 12, marginBottom: 8 },
  cancelButton: { marginTop: 0 },
  walletInfo: { fontSize: 15, color: '#333', marginBottom: 16 },
  qrPlaceholder: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#E8F5E9', borderRadius: 16, height: 120, marginBottom: 16 },
}); 