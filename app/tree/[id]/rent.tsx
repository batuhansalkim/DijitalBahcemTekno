import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import {
  Text,
  Button,
  Card,
  RadioButton,
  Divider,
  TextInput,
  List,
  Checkbox,
  SegmentedButtons,
  Portal,
  Modal,
  Surface,
} from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Örnek ağaç verisi (gerçek uygulamada API'den gelecek)
const TREE_DATA = {
  id: '1',
  name: 'Zeytin Ağacı #123',
  location: 'İzmir, Seferihisar',
  basePrice: 2500,
  nextHarvest: '01.11.2024',
  estimatedYield: '90kg',
};

// Ürün işleme seçenekleri
const PROCESSING_OPTIONS = [
  {
    id: 'oil',
    label: 'Zeytinyağı',
    description: 'Zeytinler yağa işlenecek',
    price: 200,
  },
  {
    id: 'table',
    label: 'Sofralık',
    description: 'Zeytinler sofralık olarak işlenecek',
    price: 150,
  },
  {
    id: 'mixed',
    label: 'Karışık',
    description: 'Yarısı yağlık, yarısı sofralık olarak işlenecek',
    price: 175,
  },
];

// Kiralama süreleri
const RENTAL_PERIODS = [
  { value: '1', label: '1 Yıl', multiplier: 1 },
  { value: '2', label: '2 Yıl', multiplier: 1.8 },
  { value: '3', label: '3 Yıl', multiplier: 2.5 },
];

// Ödeme yöntemleri
const PAYMENT_METHODS = [
  {
    id: '1',
    type: 'card',
    name: 'Ziraat Bankası',
    last4: '4242',
    icon: 'credit-card',
  },
  {
    id: '2',
    type: 'card',
    name: 'İş Bankası',
    last4: '8765',
    icon: 'credit-card',
  },
];

export default function RentScreen() {
  const { id } = useLocalSearchParams();
  const [rentalPeriod, setRentalPeriod] = useState('1');
  const [processingOption, setProcessingOption] = useState('oil');
  const [organicPreference, setOrganicPreference] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(PAYMENT_METHODS[0].id);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Seçilen işleme opsiyonunun fiyatını bul
  const selectedProcessing = PROCESSING_OPTIONS.find(
    (opt) => opt.id === processingOption
  );

  // Seçilen süreye göre fiyat hesaplama
  const calculatePrice = () => {
    const period = RENTAL_PERIODS.find(p => p.value === rentalPeriod);
    const basePrice = TREE_DATA.basePrice;
    const processingPrice = selectedProcessing?.price || 0;
    const organicExtra = organicPreference ? 300 : 0;
    return Math.round((basePrice + processingPrice + organicExtra) * period.multiplier);
  };

  const handleRentConfirm = () => {
    if (!isTermsAccepted) {
      Alert.alert('Uyarı', 'Devam etmek için sözleşme şartlarını kabul etmelisiniz.');
      return;
    }

    Alert.alert(
      'Kiralama Onayı',
      'Kiralama işlemini onaylıyor musunuz?',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Onayla',
          onPress: () => {
            // Kiralama işlemi başarılı olduğunda
            Alert.alert(
              'Başarılı',
              'Kiralama işleminiz başarıyla tamamlandı!',
              [
                {
                  text: 'Tamam',
                  onPress: () => router.push('/home'),
                },
              ],
            );
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Başlık */}
      <View style={styles.header}>
        <Text style={styles.title}>Ağaç Kiralama</Text>
        <Text style={styles.subtitle}>{TREE_DATA.name}</Text>
        <Text style={styles.location}>{TREE_DATA.location}</Text>
      </View>

      {/* Ağaç Özeti */}
      <Surface style={styles.section} elevation={2}>
        <Text style={styles.sectionTitle}>Ağaç Bilgileri</Text>
        <View style={styles.treeInfo}>
          <MaterialCommunityIcons name="tree" size={36} color="#2E7D32" />
          <View style={styles.treeDetails}>
            <Text style={styles.treeName}>{TREE_DATA.name}</Text>
            <Text style={styles.treeLocation}>{TREE_DATA.location}</Text>
          </View>
        </View>
        <Divider style={styles.divider} />
        <View style={styles.harvestInfo}>
          <View style={styles.harvestDetail}>
            <Text style={styles.harvestLabel}>Sonraki Hasat</Text>
            <Text style={styles.harvestValue}>{TREE_DATA.nextHarvest}</Text>
          </View>
          <View style={styles.harvestDetail}>
            <Text style={styles.harvestLabel}>Tahmini Verim</Text>
            <Text style={styles.harvestValue}>{TREE_DATA.estimatedYield}</Text>
          </View>
        </View>
      </Surface>

      {/* Kiralama Süresi */}
      <Surface style={styles.section} elevation={2}>
        <Text style={styles.sectionTitle}>Kiralama Süresi</Text>
        <RadioButton.Group
          onValueChange={value => setRentalPeriod(value)}
          value={rentalPeriod}
        >
          {RENTAL_PERIODS.map(period => (
            <View key={period.value} style={styles.periodOption}>
              <View style={styles.periodInfo}>
                <RadioButton.Android value={period.value} color="#2E7D32" />
                <Text style={styles.periodLabel}>{period.label}</Text>
              </View>
              <Text style={styles.periodPrice}>
                {Math.round(TREE_DATA.basePrice * period.multiplier)} ₺
              </Text>
            </View>
          ))}
        </RadioButton.Group>
      </Surface>

      {/* İşleme Tercihleri */}
      <Card style={styles.section}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Ürün İşleme Tercihleri</Text>
          <RadioButton.Group
            onValueChange={value => setProcessingOption(value)}
            value={processingOption}
          >
            {PROCESSING_OPTIONS.map((option) => (
              <View key={option.id} style={styles.radioOption}>
                <RadioButton.Item
                  label={option.label}
                  value={option.id}
                  position="leading"
                />
                <Text style={styles.optionDescription}>
                  {option.description}
                </Text>
                <Text style={styles.optionPrice}>+{option.price}₺</Text>
              </View>
            ))}
          </RadioButton.Group>

          <Divider style={styles.divider} />

          <List.Item
            title="Organik Tarım"
            description="Tamamen organik yöntemlerle üretim"
            left={() => (
              <Checkbox.Android
                status={organicPreference ? 'checked' : 'unchecked'}
                onPress={() => setOrganicPreference(!organicPreference)}
              />
            )}
            right={() => <Text style={styles.optionPrice}>+300₺</Text>}
          />
        </Card.Content>
      </Card>

      {/* Ödeme Yöntemi */}
      <Surface style={styles.section} elevation={2}>
        <Text style={styles.sectionTitle}>Ödeme Yöntemi</Text>
        <RadioButton.Group
          onValueChange={value => setSelectedPaymentMethod(value)}
          value={selectedPaymentMethod}
        >
          {PAYMENT_METHODS.map(method => (
            <View key={method.id} style={styles.paymentOption}>
              <RadioButton.Android value={method.id} color="#2E7D32" />
              <MaterialCommunityIcons
                name={method.icon}
                size={24}
                color="#666"
                style={styles.paymentIcon}
              />
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentName}>{method.name}</Text>
                <Text style={styles.paymentDetail}>**** {method.last4}</Text>
              </View>
            </View>
          ))}
        </RadioButton.Group>
        <Button
          mode="outlined"
          icon="plus"
          onPress={() => router.push('/profile/add-payment')}
          style={styles.addPaymentButton}
        >
          Yeni Ödeme Yöntemi Ekle
        </Button>
      </Surface>

      {/* Sözleşme */}
      <Surface style={styles.section} elevation={2}>
        <Text style={styles.sectionTitle}>Kiralama Sözleşmesi</Text>
        <Text style={styles.contractText}>
          Bu sözleşme ile belirtilen ağacın kiralama hakkını satın alıyorsunuz. 
          Kiralama süresi boyunca ağacın bakımı profesyonel çiftçilerimiz tarafından yapılacaktır. 
          Hasat zamanı geldiğinde size haber verilecek ve ürününüz adresinize teslim edilecektir.
        </Text>
        <View style={styles.termsContainer}>
          <Checkbox.Android
            status={isTermsAccepted ? 'checked' : 'unchecked'}
            onPress={() => setIsTermsAccepted(!isTermsAccepted)}
            color="#2E7D32"
          />
          <Text style={styles.termsText}>
            Kiralama sözleşmesini okudum ve kabul ediyorum
          </Text>
        </View>
      </Surface>

      {/* Toplam ve Onay */}
      <Surface style={styles.section} elevation={2}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Toplam Tutar</Text>
          <Text style={styles.totalPrice}>{calculatePrice()} ₺</Text>
        </View>
        <Button
          mode="contained"
          onPress={handleRentConfirm}
          style={styles.confirmButton}
          contentStyle={styles.confirmButtonContent}
          disabled={!isTermsAccepted}
        >
          Kirala ve Öde
        </Button>
      </Surface>
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
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  section: {
    margin: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  treeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  treeDetails: {
    marginLeft: 16,
    flex: 1,
  },
  treeName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  treeLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  divider: {
    marginVertical: 16,
  },
  harvestInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  harvestDetail: {
    alignItems: 'center',
  },
  harvestLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  harvestValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  periodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  periodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  periodLabel: {
    fontSize: 16,
    marginLeft: 8,
  },
  periodPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  radioOption: {
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    marginLeft: 52,
    marginTop: -4,
  },
  optionPrice: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: 'bold',
    marginLeft: 52,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  paymentIcon: {
    marginRight: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: 16,
  },
  paymentDetail: {
    fontSize: 14,
    color: '#666',
  },
  addPaymentButton: {
    marginTop: 16,
  },
  contractText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    marginLeft: 8,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  confirmButton: {
    backgroundColor: '#2E7D32',
  },
  confirmButtonContent: {
    height: 48,
  },
}); 