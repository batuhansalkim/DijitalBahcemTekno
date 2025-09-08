import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Modal } from 'react-native';
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
  Surface,
  IconButton,
  Chip,
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
    icon: 'credit-card' as const,
  },
  {
    id: '2',
    type: 'card',
    name: 'İş Bankası',
    last4: '8765',
    icon: 'credit-card' as const,
  },
];

export default function RentScreen() {
  const { id } = useLocalSearchParams();
  const [rentalPeriod, setRentalPeriod] = useState('');
  const [processingOption, setProcessingOption] = useState('');
  const [organicPreference, setOrganicPreference] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);

  // Seçilen işleme opsiyonunun fiyatını bul
  const selectedProcessing = PROCESSING_OPTIONS.find(
    (opt) => opt.id === processingOption
  );

  // Seçilen süreye göre fiyat hesaplama
  const calculatePrice = () => {
    if (!rentalPeriod) return 0;
    
    const period = RENTAL_PERIODS.find(p => p.value === rentalPeriod);
    const basePrice = TREE_DATA.basePrice;
    const processingPrice = selectedProcessing?.price || 0;
    const organicExtra = organicPreference ? 300 : 0;
    return Math.round((basePrice + processingPrice + organicExtra) * (period?.multiplier || 1));
  };

  const handleRentConfirm = () => {
    console.log('🔄 Ödeme sayfasına yönlendirme başlatıldı...');
    
    if (!rentalPeriod) {
      Alert.alert('Uyarı', 'Lütfen kiralama süresini seçin.');
      return;
    }
    if (!processingOption) {
      Alert.alert('Uyarı', 'Lütfen ürün işleme tercihini seçin.');
      return;
    }
    if (!isTermsAccepted) {
      Alert.alert('Uyarı', 'Devam etmek için sözleşme şartlarını kabul etmelisiniz.');
      return;
    }

    const paymentParams = {
      treeId: id,
      amount: calculatePrice(),
      rentalData: JSON.stringify({
        period: rentalPeriod,
        processing: processingOption,
        organic: organicPreference,
        treeName: TREE_DATA.name,
        treeLocation: TREE_DATA.location
      })
    };

    console.log('💳 Ödeme parametreleri:', paymentParams);

    try {
      // Ödeme sayfasına yönlendir - Alternatif yöntemler dene
      
      // Yöntem 1: Basit string path
      // router.push('/payment');
      
      // Ödeme sayfasına yönlendir
      router.push({
        pathname: '/payment',
        params: paymentParams
      });
      
      // Yöntem 3: Query string formatında (yedek)
      // const queryString = Object.entries(paymentParams)
      //   .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      //   .join('&');
      // router.push(`/payment?${queryString}`);
      
      console.log('✅ Yönlendirme komutu gönderildi');
      
      // 2 saniye sonra kontrol et
      setTimeout(() => {
        console.log('🔍 2 saniye sonra yönlendirme durumu kontrol ediliyor...');
      }, 2000);
      
    } catch (error) {
      console.error('❌ Yönlendirme hatası:', error);
      Alert.alert('Hata', 'Ödeme sayfasına yönlendirilemedi. Konsol loglarını kontrol edin.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <IconButton icon="arrow-left" size={28} iconColor="#2D6A4F" onPress={() => router.back()} />
        <Text style={styles.headerTitle}>Ağaç Kiralama</Text>
      </View>
      <ScrollView style={styles.scrollView}>
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
                    color='green'
                    labelStyle={{ color: '#000', fontWeight: 'bold' }}
                  />
                  <Text style={styles.optionDescription}>
                    {option.description}
                  </Text>
                  <Text style={styles.optionPrice}>+{option.price}₺</Text>
                </View>
              ))}
            </RadioButton.Group>

            <Divider style={styles.divider} />

            <View style={styles.organicContainer}>
              <View style={styles.organicLeftSection}>
                <Checkbox.Android
                  status={organicPreference ? 'checked' : 'unchecked'}
                  onPress={() => setOrganicPreference(!organicPreference)}
                />
                <View style={styles.organicTextSection}>
                  <Text style={styles.organicTitle}>Organik Tarım</Text>
                  <Text style={styles.organicDescription}>Tamamen organik yöntemlerle üretim</Text>
                  <Text style={styles.optionPrice}>+300₺</Text>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Sözleşme */}
        <Surface style={styles.section} elevation={2}>
          <Text style={styles.sectionTitle}>Kiralama Sözleşmesi</Text>
          <View style={styles.contractButtonContainer}>
            <Button
              mode="outlined"
              icon="file-document-outline"
              onPress={() => setShowContractModal(true)}
              style={styles.contractViewButton}
              labelStyle={styles.contractButtonLabel}
            >
              Sözleşmeyi İncele
            </Button>
          </View>
          <View style={styles.termsContainer}>
            <Checkbox.Android
              status={isTermsAccepted ? 'checked' : 'unchecked'}
              onPress={() => setIsTermsAccepted(!isTermsAccepted)}
              color="#2D6A4F"
            />
            <View style={styles.termsTextContainer}>
              <Text style={styles.termsText}>
                Sözleşme şartlarını okudum ve kabul ediyorum
              </Text>
            </View>
          </View>
        </Surface>

        {/* Alt boşluk - sabit kısım için */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Sözleşme Modal */}
      <Modal
        visible={showContractModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowContractModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Kiralama Sözleşmesi</Text>
              <IconButton
                icon="close"
                size={24}
                onPress={() => setShowContractModal(false)}
                iconColor="#666"
                style={styles.modalCloseButton}
              />
            </View>
            <View style={styles.modalDivider} />
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <View style={styles.modalContractSection}>
                <Text style={styles.modalSectionTitle}>AĞAÇ KİRALAMA SÖZLEŞMESİ</Text>
                <Text style={styles.modalContractText}>
                  Bu sözleşme, Dijital Bahçem platformu üzerinden gerçekleştirilen ağaç kiralama hizmetinin 
                  şartlarını ve koşullarını belirlemektedir. Sözleşme tarafları, aşağıda belirtilen şartları 
                  kabul ederek bu anlaşmayı imzalamaktadır.
                </Text>
              </View>

              <View style={styles.modalContractSection}>
                <Text style={styles.modalSectionTitle}>1. TARAFLAR VE KONU</Text>
                <Text style={styles.modalContractText}>
                  <Text style={styles.modalBoldText}>KİRAYE VEREN:</Text> Dijital Bahçem Platformu ve 
                  bağlı çiftçiler{'\n'}
                  <Text style={styles.modalBoldText}>KİRALAYAN:</Text> Platform üzerinden kiralama işlemi 
                  gerçekleştiren kullanıcı{'\n'}
                  <Text style={styles.modalBoldText}>KONU:</Text> Belirtilen ağacın belirli süre için 
                  kiralanması ve bakım hizmetlerinin sağlanması
                </Text>
              </View>

              <View style={styles.modalContractSection}>
                <Text style={styles.modalSectionTitle}>2. KİRALAMA HAKKI VE KAPSAMI</Text>
                <Text style={styles.modalContractText}>
                  • Kiralayan, seçilen ağacın kiralama hakkını satın alır.{'\n'}
                  • Kiralama süresi boyunca ağacın tüm bakım işlemleri Kiraye Veren tarafından 
                  gerçekleştirilir.{'\n'}
                  • Ağacın ürün verimi ve kalitesi Kiraye Veren'in sorumluluğundadır.{'\n'}
                  • Kiralayan, ağacın fiziksel mülkiyetini değil, kullanım hakkını satın alır.
                </Text>
              </View>

              <View style={styles.modalContractSection}>
                <Text style={styles.modalSectionTitle}>3. BAKIM VE YÖNETİM HİZMETLERİ</Text>
                <Text style={styles.modalContractText}>
                  Kiraye Veren aşağıdaki hizmetleri sağlamayı taahhüt eder:{'\n\n'}
                  • <Text style={styles.modalBoldText}>Sulama:</Text> Ağacın ihtiyacına göre düzenli sulama{'\n'}
                  • <Text style={styles.modalBoldText}>Gübreleme:</Text> Organik gübreleme ve beslenme{'\n'}
                  • <Text style={styles.modalBoldText}>Hastalık Kontrolü:</Text> Düzenli sağlık kontrolü ve 
                  koruyucu önlemler{'\n'}
                  • <Text style={styles.modalBoldText}>Budama:</Text> Gerekli budama işlemleri{'\n'}
                  • <Text style={styles.modalBoldText}>Hasat:</Text> Uygun zamanda hasat ve ürün teslimi
                </Text>
              </View>

              <View style={styles.modalContractSection}>
                <Text style={styles.modalSectionTitle}>4. ÖDEME KOŞULLARI</Text>
                <Text style={styles.modalContractText}>
                  • Kiralama bedeli peşin olarak ödenir.{'\n'}
                  • Ödeme, platform üzerinden güvenli ödeme sistemleri ile gerçekleştirilir.{'\n'}
                  • Kiralama bedeli, seçilen süre ve hizmet paketine göre belirlenir.{'\n'}
                  • Organik tarım tercihi ek ücret gerektirir.{'\n'}
                  • Ödeme tamamlandıktan sonra kiralama hakkı aktif hale gelir.
                </Text>
              </View>

              <View style={styles.modalContractSection}>
                <Text style={styles.modalSectionTitle}>5. ÜRÜN TESLİMİ VE KALİTE</Text>
                <Text style={styles.modalContractText}>
                  • Hasat zamanı geldiğinde Kiralayan'a önceden bilgi verilir.{'\n'}
                  • Ürün, belirtilen adrese ücretsiz teslim edilir.{'\n'}
                  • Organik tarım seçeneği için organik sertifika sağlanır.{'\n'}
                  • Ürün kalitesi, sektör standartlarına uygun olarak garanti edilir.{'\n'}
                  • Teslimat sırasında ürün kalitesi kontrolü yapılır.
                </Text>
              </View>

              <View style={styles.modalContractSection}>
                <Text style={styles.modalSectionTitle}>6. SORUMLULUK VE GARANTİ</Text>
                <Text style={styles.modalContractText}>
                  • Ağacın bakımı ve yönetimi tamamen Kiraye Veren'in sorumluluğundadır.{'\n'}
                  • Doğal afetler, hastalık veya beklenmeyen durumlar nedeniyle ürün kaybı 
                  yaşanması durumunda kiralama bedeli iade edilmez.{'\n'}
                  • Kiraye Veren, maksimum çaba göstererek ürün kalitesini korumayı taahhüt eder.{'\n'}
                  • Kiralayan'ın ağaca müdahale etmesi yasaktır.
                </Text>
              </View>

              <View style={styles.modalContractSection}>
                <Text style={styles.modalSectionTitle}>7. İLETİŞİM VE TAKİP</Text>
                <Text style={styles.modalContractText}>
                  • Kiralama süresi boyunca düzenli fotoğraf güncellemeleri sağlanır.{'\n'}
                  • Ağacın gelişim durumu hakkında bilgilendirme yapılır.{'\n'}
                  • 7/24 müşteri hizmetleri desteği sunulur.{'\n'}
                  • Sorular ve talepler için platform üzerinden iletişim kurulabilir.
                </Text>
              </View>

              <View style={styles.modalContractSection}>
                <Text style={styles.modalSectionTitle}>8. SÖZLEŞME SÜRESİ VE FESİH</Text>
                <Text style={styles.modalContractText}>
                  • Sözleşme süresi, seçilen kiralama periyoduna göre belirlenir.{'\n'}
                  • Süre sonunda sözleşme otomatik olarak sona erer.{'\n'}
                  • Yenileme seçeneği mevcuttur.{'\n'}
                  • Taraflar karşılıklı anlaşma ile sözleşmeyi feshedebilir.{'\n'}
                  • Fesih durumunda kiralama bedeli iade edilmez.
                </Text>
              </View>

              <View style={styles.modalContractSection}>
                <Text style={styles.modalSectionTitle}>9. GİZLİLİK VE VERİ GÜVENLİĞİ</Text>
                <Text style={styles.modalContractText}>
                  • Kişisel veriler KVKK kapsamında korunur.{'\n'}
                  • Platform güvenlik standartlarına uygun olarak tasarlanmıştır.{'\n'}
                  • Ödeme bilgileri şifrelenerek saklanır.{'\n'}
                  • Veri paylaşımı sadece hizmet kalitesi için gerekli olduğunda yapılır.
                </Text>
              </View>

              <View style={styles.modalContractSection}>
                <Text style={styles.modalSectionTitle}>10. UYUŞMAZLIK ÇÖZÜMÜ</Text>
                <Text style={styles.modalContractText}>
                  • Bu sözleşmeden doğacak uyuşmazlıklar öncelikle görüşme yoluyla çözülmeye çalışılır.{'\n'}
                  • Çözülemeyen uyuşmazlıklar için Türkiye Cumhuriyeti mahkemeleri yetkilidir.{'\n'}
                  • Sözleşme Türkçe dilinde hazırlanmıştır ve Türk hukukuna tabidir.
                </Text>
              </View>

              <View style={styles.modalContractSection}>
                <Text style={styles.modalContractText}>
                  <Text style={styles.modalBoldText}>Bu sözleşmeyi okuyarak ve kabul ederek, 
                  yukarıda belirtilen tüm şartları ve koşulları kabul etmiş sayılırsınız.</Text>
                </Text>
              </View>
            </ScrollView>
            <View style={styles.modalFooter}>
              <Button
                mode="contained"
                icon="check-circle"
                onPress={() => {
                  setIsTermsAccepted(true);
                  setShowContractModal(false);
                }}
                style={styles.modalAcceptButton}
                contentStyle={styles.modalAcceptButtonContent}
                labelStyle={styles.modalAcceptButtonLabel}
              >
                Sözleşmeyi Kabul Ediyorum
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      {/* Sabit Alt Kısım */}
      <View style={styles.fixedBottom}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Toplam Tutar</Text>
          <Text style={styles.totalPrice}>
            {rentalPeriod ? `${calculatePrice()} ₺` : 'Seçim yapın'}
          </Text>
        </View>
        <Button
          mode="contained"
          onPress={handleRentConfirm}
          style={styles.confirmButton}
          contentStyle={styles.confirmButtonContent}
          disabled={!isTermsAccepted || !rentalPeriod || !processingOption}
        >
          Ödeme Sayfasına Git
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F3',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    backgroundColor: '#2D6A4F',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 6,
    fontWeight: '500',
  },
  location: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    fontWeight: '400',
  },
  section: {
    margin: 16,
    marginBottom: 12,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1B4332',
  },
  treeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  treeDetails: {
    marginLeft: 16,
    flex: 1,
  },
  treeName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B4332',
    marginBottom: 4,
  },
  treeLocation: {
    fontSize: 16,
    color: '#2D6A4F',
    fontWeight: '500',
  },
  divider: {
    marginVertical: 20,
    height: 1,
    backgroundColor: '#E8F5E9',
  },
  harvestInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
  },
  harvestDetail: {
    alignItems: 'center',
    flex: 1,
  },
  harvestLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
    fontWeight: '500',
  },
  harvestValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B4332',
  },
  periodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 8,
  },
  periodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  periodLabel: {
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '500',
    color: '#1B4332',
  },
  periodPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D6A4F',
  },
  radioOption: {
    marginBottom: 12,
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    color:"black"
  },
  optionDescription: {
    fontSize: 14,
    color: 'black',
    marginLeft: 52,
    marginTop: 4,
    lineHeight: 20,
  },
  optionPrice: {
    fontSize: 16,
    color: '#2D6A4F',
    fontWeight: 'bold',
    marginLeft: 52,
    marginTop: 4,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 8,
  },
  paymentIcon: {
    marginRight: 16,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1B4332',
  },
  paymentDetail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  addPaymentButton: {
    marginTop: 16,
    borderColor: '#2D6A4F',
    borderWidth: 2,
  },
  contractContainer: {
    marginBottom: 16,
  },
  contractShortText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 24,
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  contractButtonContainer: {
    marginBottom: 16,
    alignItems: 'center',
    width: '100%',
  },
  contractButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D6A4F',
    textAlign: 'center',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
  },
  termsText: {
    flex: 1,
    fontSize: 15,
    marginLeft: 12,
    color: '#1B4332',
    fontWeight: '500',
  },
  priceBreakdown: {
    marginBottom: 20,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  priceLabel: {
    fontSize: 16,
    color: '#1B4332',
    fontWeight: '500',
  },
  priceValue: {
    fontSize: 16,
    color: '#2D6A4F',
    fontWeight: 'bold',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  totalLabel: {
    fontSize: 18,
    color: '#1B4332',
    fontWeight: '500',
  },
  totalPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D6A4F',
  },
  confirmButton: {
    backgroundColor: '#2D6A4F',
    borderRadius: 12,
    color:"white",
    elevation: 4,
  },
  confirmButtonContent: {
    height: 56,
  },
  organicContainer: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
  },
  organicLeftSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  organicTextSection: {
    marginLeft: 12,
    flex: 1,
  },
  organicTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1B4332',
  },
  organicDescription: {
    fontSize: 14,
    color: '#666',
  },
  bottomSpacer: {
    height: 100,
  },
  fixedBottom: {
    padding: 24,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E8F5E9',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 20,
    width: '92%',
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B4332',
  },
  modalContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  modalContractText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 24,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  modalAcceptButton: {
    backgroundColor: '#2D6A4F',
    borderRadius: 12,
    padding: 16,
  },
  modalAcceptButtonContent: {
    height: 56,
  },
  modalAcceptButtonLabel: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  contractHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  contractCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
  },
  contractIconContainer: {
    marginRight: 16,
  },
  contractContent: {
    flex: 1,
  },
  contractTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B4332',
    marginBottom: 4,
  },
  contractSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  contractViewButton: {
    width: '80%',
    alignSelf: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#2D6A4F',
    backgroundColor: '#fff',
  },
  termsTextContainer: {
    flex: 1,
    marginLeft: 8,
  },
  termsNote: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  modalCloseButton: {
    marginLeft: 16,
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#E8F5E9',
  },
  modalContractSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B4332',
    marginBottom: 8,
  },
  modalSummaryCard: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  modalSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalSummaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B4332',
    marginLeft: 8,
  },
  modalSummaryContent: {
    gap: 12,
  },
  modalSummaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  modalSummaryText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  modalBenefitsSection: {
    marginBottom: 20,
  },
  modalBenefitsList: {
    gap: 12,
  },
  modalBenefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  modalBenefitText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  modalContactSection: {
    marginBottom: 20,
  },
  modalContactInfo: {
    gap: 12,
  },
  modalContactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  modalContactText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  modalSecuritySection: {
    marginBottom: 20,
  },
  modalSecurityList: {
    gap: 12,
  },
  modalSecurityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  modalSecurityText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  modalBoldText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B4332',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B4332',
    marginLeft: 8,
  },
}); 