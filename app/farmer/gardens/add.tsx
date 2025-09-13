import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, Surface, IconButton, Chip } from 'react-native-paper';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TextInput as RNTextInput } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNfcReader } from '../../hooks/useNfcReader';
import { fetchGardenDescription } from '../../services/aiServices';

interface GardenForm {
  name: string;
  location: string;
  area: string;
  description: string;
  features: string[];
  treeTypes: string[];
  images: string[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
  soilType: string;
  irrigationType: string;
  certification: string[];
  contactPhone: string;
  contactEmail: string;
  establishmentYear: string;
  maxTreeCapacity: string;
  averageYield: string;
  rfidCode: string;
}

const TREE_TYPES = [
  { value: 'zeytin', label: 'Zeytin' },
  { value: 'portakal', label: 'Portakal' },
  { value: 'elma', label: 'Elma' },
  { value: 'findik', label: 'Fındık' },
  { value: 'armut', label: 'Armut' },
  { value: 'kayisi', label: 'Kayısı' },
  { value: 'seftali', label: 'Şeftali' },
  { value: 'kiraz', label: 'Kiraz' },
  { value: 'visne', label: 'Vişne' },
  { value: 'ceviz', label: 'Ceviz' },
];

const FEATURES = [
  { value: 'damla_sulama', label: 'Damla Sulama' },
  { value: 'yagmurlama', label: 'Yağmurlama Sistemi' },
  { value: 'organik', label: 'Organik Tarım' },
  { value: 'gubre', label: 'Gübre Sistemi' },
  { value: 'ilaclama', label: 'İlaçlama Sistemi' },
  { value: 'rfid_takip', label: 'RFID Takip' },
  { value: 'otomatik_sulama', label: 'Otomatik Sulama' },
  { value: 'sera', label: 'Sera Sistemi' },
  { value: 'rüzgar_koruma', label: 'Rüzgar Koruması' },
  { value: 'don_koruma', label: 'Don Koruması' },
];

const SOIL_TYPES = [
  { value: 'killi', label: 'Killi Toprak' },
  { value: 'kumlu', label: 'Kumlu Toprak' },
  { value: 'tınlı', label: 'Tınlı Toprak' },
  { value: 'organik', label: 'Organik Toprak' },
  { value: 'kireçli', label: 'Kireçli Toprak' },
];

const IRRIGATION_TYPES = [
  { value: 'damla', label: 'Damla Sulama' },
  { value: 'yagmurlama', label: 'Yağmurlama' },
  { value: 'salma', label: 'Salma Sulama' },
  { value: 'yeralti', label: 'Yeraltı Sulama' },
  { value: 'doga', label: 'Doğal Yağış' },
];

const CERTIFICATIONS = [
  { value: 'organik', label: 'Organik Tarım' },
  { value: 'iyi_tarim', label: 'İyi Tarım Uygulamaları' },
  { value: 'global_gap', label: 'Global GAP' },
  { value: 'iso_22000', label: 'ISO 22000' },
  { value: 'halal', label: 'Helal Sertifikası' },
];

export default function AddGardenScreen() {
  // NFC Reader Hook
  const { state, uid, error, read } = useNfcReader();
  
  const [form, setForm] = useState<GardenForm>({
    name: '',
    location: '',
    area: '',
    description: '',
    features: [],
    treeTypes: [],
    images: [],
    coordinates: {
      latitude: 39.9334,
      longitude: 32.8597,
    },
    soilType: '',
    irrigationType: '',
    certification: [],
    contactPhone: '',
    contactEmail: '',
    establishmentYear: '',
    maxTreeCapacity: '',
    averageYield: '',
    rfidCode: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof GardenForm, string>>>({});
  const [aiLoading, setAiLoading] = useState(false);

  // UID'yi forma otomatik doldur
  useEffect(() => {
    if (uid) {
      setForm(prev => ({ ...prev, rfidCode: uid }));
    }
  }, [uid]);

  // AI ile bahçe açıklaması oluştur
  const generateWithAI = async () => {
    setAiLoading(true);
    try {
      // Mevcut form verilerini AI servisine gönder
      const aiData = await fetchGardenDescription(form);
      
      // Sadece açıklama alanını AI'dan gelen veri ile doldur
      setForm(prev => ({
        ...prev,
        description: aiData.bahceAciklamasi || prev.description,
      }));
    } catch (error) {
      console.error('AI generation error:', error);
      // Hata durumunda kullanıcıya bilgi ver
      alert('AI ile veri oluşturulurken bir hata oluştu. Lütfen manuel olarak doldurun.');
    } finally {
      setAiLoading(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, result.assets[0].uri],
      }));
    }
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const toggleFeature = (value: string) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.includes(value)
        ? prev.features.filter((f) => f !== value)
        : [...prev.features, value],
    }));
  };

  const toggleTreeType = (value: string) => {
    setForm((prev) => ({
      ...prev,
      treeTypes: prev.treeTypes.includes(value)
        ? prev.treeTypes.filter((t) => t !== value)
        : [...prev.treeTypes, value],
    }));
  };

  const toggleCertification = (value: string) => {
    setForm((prev) => ({
      ...prev,
      certification: prev.certification.includes(value)
        ? prev.certification.filter((c) => c !== value)
        : [...prev.certification, value],
    }));
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof GardenForm, string>> = {};

    if (!form.name) newErrors.name = 'Bahçe adı gereklidir';
    if (!form.location) newErrors.location = 'Konum bilgisi gereklidir';
    if (!form.area) newErrors.area = 'Alan bilgisi gereklidir';
    if (!form.soilType) newErrors.soilType = 'Toprak türü seçin';
    if (!form.irrigationType) newErrors.irrigationType = 'Sulama türü seçin';
    if (form.treeTypes.length === 0) newErrors.treeTypes = 'En az bir ağaç türü seçin';
    if (form.images.length === 0) newErrors.images = 'En az bir fotoğraf ekleyin';
    if (!form.contactPhone) newErrors.contactPhone = 'İletişim telefonu gereklidir';
    if (!form.contactEmail) newErrors.contactEmail = 'İletişim e-postası gereklidir';
    if (!form.rfidCode) newErrors.rfidCode = 'RFID kodu gereklidir';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // API call to save garden
      console.log('Form submitted:', form);
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.header} elevation={4}>
        <View style={styles.headerContent}>
          <IconButton 
            icon="arrow-left" 
            onPress={() => router.back()} 
            style={styles.backBtn}
            iconColor="#fff"
          />
          <MaterialCommunityIcons name="flower" size={28} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.headerTitle}>Yeni Bahçe Ekle</Text>
        </View>
      </Surface>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          
          {/* Temel Bilgiler */}
          <Surface style={styles.formCard} elevation={3}>
            <Text style={styles.sectionTitle}>Temel Bilgiler</Text>
            
            <View style={{ marginBottom: 8 }}>
              <Text style={{ color: '#000', fontWeight: 'bold', marginBottom: 4 }}>Bahçe Adı *</Text>
              <RNTextInput
                value={form.name}
                onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
                style={styles.input}
                placeholder="Bahçe Adı"
                placeholderTextColor="#666"
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            <View style={{ marginBottom: 8 }}>
              <Text style={{ color: '#000', fontWeight: 'bold', marginBottom: 4 }}>Konum *</Text>
              <RNTextInput
                value={form.location}
                onChangeText={(text) => setForm((prev) => ({ ...prev, location: text }))}
                style={styles.input}
                placeholder="Şehir, İlçe"
                placeholderTextColor="#666"
              />
              {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
            </View>

            <View style={{ marginBottom: 8 }}>
              <Text style={{ color: '#000', fontWeight: 'bold', marginBottom: 4 }}>Alan *</Text>
              <RNTextInput
                value={form.area}
                onChangeText={(text) => setForm((prev) => ({ ...prev, area: text }))}
                style={styles.input}
                placeholder="m² veya dönüm"
                placeholderTextColor="#666"
                keyboardType="numeric"
              />
              {errors.area && <Text style={styles.errorText}>{errors.area}</Text>}
            </View>

            <View style={{ marginBottom: 8 }}>
              <Text style={{ color: '#000', fontWeight: 'bold', marginBottom: 4 }}>Kuruluş Yılı</Text>
              <RNTextInput
                value={form.establishmentYear}
                onChangeText={(text) => setForm((prev) => ({ ...prev, establishmentYear: text }))}
                style={styles.input}
                placeholder="Örn: 2010"
                placeholderTextColor="#666"
                keyboardType="numeric"
              />
            </View>

            <View style={{ marginBottom: 8 }}>
              <Text style={{ color: '#000', fontWeight: 'bold', marginBottom: 4 }}>Maksimum Ağaç Kapasitesi</Text>
              <RNTextInput
                value={form.maxTreeCapacity}
                onChangeText={(text) => setForm((prev) => ({ ...prev, maxTreeCapacity: text }))}
                style={styles.input}
                placeholder="Ağaç sayısı"
                placeholderTextColor="#666"
                keyboardType="numeric"
              />
            </View>

            <View style={{ marginBottom: 8 }}>
              <Text style={{ color: '#000', fontWeight: 'bold', marginBottom: 4 }}>Ortalama Yıllık Verim</Text>
              <RNTextInput
                value={form.averageYield}
                onChangeText={(text) => setForm((prev) => ({ ...prev, averageYield: text }))}
                style={styles.input}
                placeholder="Örn: 5000 kg"
                placeholderTextColor="#666"
              />
            </View>

            <View style={{ marginBottom: 8 }}>
              <View style={styles.descriptionHeader}>
                <Text style={{ color: '#000', fontWeight: 'bold', marginBottom: 4 }}>Açıklama</Text>
                <Button
                  mode="outlined"
                  onPress={generateWithAI}
                  loading={aiLoading}
                  disabled={aiLoading}
                  icon="robot"
                  style={styles.aiButton}
                  textColor="#2D6A4F"
                >
                  AI ile Oluştur
                </Button>
              </View>
              <RNTextInput
                value={form.description}
                onChangeText={(text) => setForm((prev) => ({ ...prev, description: text }))}
                style={[styles.input, styles.textArea]}
                placeholder="Bahçe hakkında detaylı bilgi"
                placeholderTextColor="#666"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </Surface>

          {/* İletişim Bilgileri */}
          <Surface style={styles.formCard} elevation={3}>
            <Text style={styles.sectionTitle}>İletişim Bilgileri</Text>
            
            <View style={{ marginBottom: 8 }}>
              <Text style={{ color: '#000', fontWeight: 'bold', marginBottom: 4 }}>Telefon *</Text>
              <RNTextInput
                value={form.contactPhone}
                onChangeText={(text) => setForm((prev) => ({ ...prev, contactPhone: text }))}
                style={styles.input}
                placeholder="0555 123 45 67"
                placeholderTextColor="#666"
                keyboardType="phone-pad"
              />
              {errors.contactPhone && <Text style={styles.errorText}>{errors.contactPhone}</Text>}
            </View>

            <View style={{ marginBottom: 8 }}>
              <Text style={{ color: '#000', fontWeight: 'bold', marginBottom: 4 }}>E-posta *</Text>
              <RNTextInput
                value={form.contactEmail}
                onChangeText={(text) => setForm((prev) => ({ ...prev, contactEmail: text }))}
                style={styles.input}
                placeholder="ornek@email.com"
                placeholderTextColor="#666"
                keyboardType="email-address"
              />
              {errors.contactEmail && <Text style={styles.errorText}>{errors.contactEmail}</Text>}
            </View>
          </Surface>

          {/* RFID ve Konum */}
          <Surface style={styles.formCard} elevation={3}>
            <Text style={styles.sectionTitle}>RFID ve Konum</Text>
            
            <View style={styles.rfidContainer}>
              <TextInput
                label="RFID Kodu"
                value={form.rfidCode}
                onChangeText={(text) => setForm((prev) => ({ ...prev, rfidCode: text }))}
                mode="outlined"
                error={!!errors.rfidCode}
                style={[styles.input, styles.rfidInput]}
                outlineColor="#E0E0E0"
                activeOutlineColor="#2E7D32"
                placeholder="NFC ile RFID Oku"
                textColor="#000"
                editable={false}
              />
              <Button
                mode="outlined"
                onPress={read}
                loading={state === 'reading'}
                disabled={state === 'reading'}
                style={styles.nfcButton}
                buttonColor="#2E7D32"
                textColor="#fff"
                icon="nfc"
                labelStyle={{ fontSize: 12 }}
              >
                {state === 'reading' ? 'Okunuyor...' : 'NFC Oku'}
              </Button>
            </View>
            {errors.rfidCode && <Text style={styles.errorText}>{errors.rfidCode}</Text>}
          </Surface>

          {/* Tarımsal Özellikler */}
          <Surface style={styles.formCard} elevation={3}>
            <Text style={styles.sectionTitle}>Tarımsal Özellikler</Text>
            
            <View style={{ marginBottom: 16 }}>
              <Text style={{ color: '#000', fontWeight: 'bold', marginBottom: 8 }}>Toprak Türü *</Text>
              <View style={styles.chipGroup}>
                {SOIL_TYPES.map((type) => (
                  <Chip
                    key={type.value}
                    selected={form.soilType === type.value}
                    onPress={() => setForm((prev) => ({ ...prev, soilType: type.value }))}
                    style={[styles.chip, form.soilType === type.value ? styles.chipSelected : null]}
                    textStyle={{ color: form.soilType === type.value ? '#fff' : '#2E7D32', fontWeight: 'bold' }}
                  >
                    {type.label}
                  </Chip>
                ))}
              </View>
              {errors.soilType && <Text style={styles.errorText}>{errors.soilType}</Text>}
            </View>

            <View style={{ marginBottom: 16 }}>
              <Text style={{ color: '#000', fontWeight: 'bold', marginBottom: 8 }}>Sulama Türü *</Text>
              <View style={styles.chipGroup}>
                {IRRIGATION_TYPES.map((type) => (
                  <Chip
                    key={type.value}
                    selected={form.irrigationType === type.value}
                    onPress={() => setForm((prev) => ({ ...prev, irrigationType: type.value }))}
                    style={[styles.chip, form.irrigationType === type.value ? styles.chipSelected : null]}
                    textStyle={{ color: form.irrigationType === type.value ? '#fff' : '#2E7D32', fontWeight: 'bold' }}
                  >
                    {type.label}
                  </Chip>
                ))}
              </View>
              {errors.irrigationType && <Text style={styles.errorText}>{errors.irrigationType}</Text>}
            </View>
          </Surface>

          {/* Ağaç Türleri */}
          <Surface style={styles.formCard} elevation={3}>
            <Text style={styles.sectionTitle}>Ağaç Türleri *</Text>
            <View style={styles.chipGroup}>
              {TREE_TYPES.map((type) => (
                <Chip
                  key={type.value}
                  selected={form.treeTypes.includes(type.value)}
                  onPress={() => toggleTreeType(type.value)}
                  style={[styles.chip, form.treeTypes.includes(type.value) ? styles.chipSelected : null]}
                  textStyle={{ color: form.treeTypes.includes(type.value) ? '#fff' : '#2E7D32', fontWeight: 'bold' }}
                >
                  {type.label}
                </Chip>
              ))}
            </View>
            {errors.treeTypes && <Text style={styles.errorText}>{errors.treeTypes}</Text>}
          </Surface>

          {/* Bahçe Özellikleri */}
          <Surface style={styles.formCard} elevation={3}>
            <Text style={styles.sectionTitle}>Bahçe Özellikleri</Text>
            <View style={styles.chipGroup}>
              {FEATURES.map((feature) => (
                <Chip
                  key={feature.value}
                  selected={form.features.includes(feature.value)}
                  onPress={() => toggleFeature(feature.value)}
                  style={[styles.chip, form.features.includes(feature.value) ? styles.chipSelected : null]}
                  textStyle={{ color: form.features.includes(feature.value) ? '#fff' : '#2E7D32', fontWeight: 'bold' }}
                >
                  {feature.label}
                </Chip>
              ))}
            </View>
          </Surface>

          {/* Sertifikalar */}
          <Surface style={styles.formCard} elevation={3}>
            <Text style={styles.sectionTitle}>Sertifikalar</Text>
            <View style={styles.chipGroup}>
              {CERTIFICATIONS.map((cert) => (
                <Chip
                  key={cert.value}
                  selected={form.certification.includes(cert.value)}
                  onPress={() => toggleCertification(cert.value)}
                  style={[styles.chip, form.certification.includes(cert.value) ? styles.chipSelected : null]}
                  textStyle={{ color: form.certification.includes(cert.value) ? '#fff' : '#2E7D32', fontWeight: 'bold' }}
                >
                  {cert.label}
                </Chip>
              ))}
            </View>
          </Surface>

          {/* Konum Seçimi */}
          <Surface style={styles.formCard} elevation={3}>
            <Text style={styles.sectionTitle}>Konum Seç</Text>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: form.coordinates.latitude,
                longitude: form.coordinates.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              onPress={(e) => setForm((prev) => ({
                ...prev,
                coordinates: e.nativeEvent.coordinate,
              }))}
            >
              <Marker
                coordinate={form.coordinates}
                draggable
                onDragEnd={(e) => setForm((prev) => ({
                  ...prev,
                  coordinates: e.nativeEvent.coordinate,
                }))}
              />
            </MapView>
            <Text style={styles.mapInfo}>Haritaya dokunarak bahçe konumunu seçin</Text>
          </Surface>

          {/* Fotoğraflar */}
          <Surface style={styles.formCard} elevation={3}>
            <Text style={styles.sectionTitle}>Fotoğraflar *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageRow}>
              {form.images.map((uri, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri }} style={styles.image} />
                  <IconButton
                    icon="close"
                    size={20}
                    style={styles.removeImage}
                    onPress={() => removeImage(index)}
                  />
                </View>
              ))}
              <Button
                mode="outlined"
                onPress={pickImage}
                icon="camera"
                style={styles.addImageButton}
                textColor="#2E7D32"
              >
                Fotoğraf Ekle
              </Button>
            </ScrollView>
            {errors.images && <Text style={styles.errorText}>{errors.images}</Text>}
          </Surface>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.bottomBar}>
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.saveBtn}
          buttonColor="#2E7D32"
          contentStyle={{ paddingVertical: 8 }}
          textColor='#ffffff'
        >
          Bahçe Ekle
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { backgroundColor: '#2E7D32', paddingTop: 40, paddingBottom: 16, paddingHorizontal: 16, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, marginBottom: 8 },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  backBtn: { position: 'absolute', left: 0, top: 0, zIndex: 2, backgroundColor: 'transparent' },
  formCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 },
  sectionTitle: { fontWeight: 'bold', color: '#1B4332', fontSize: 16, marginBottom: 16 },
  input: { color: '#000', borderWidth: 1, borderColor: '#2E7D32', borderRadius: 8, padding: 12, backgroundColor: '#fff', marginBottom: 8 },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  errorText: { color: '#B00020', fontSize: 12, marginBottom: 8 },
  chipGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  chip: { marginBottom: 8, backgroundColor: '#E8F5E9' },
  chipSelected: { backgroundColor: '#2E7D32' },
  map: { height: 200, marginBottom: 8, borderRadius: 12 },
  mapInfo: { fontSize: 12, color: '#666', textAlign: 'center', fontStyle: 'italic' },
  imageRow: { flexDirection: 'row', marginBottom: 8 },
  imageWrapper: { position: 'relative', marginRight: 8 },
  image: { width: 100, height: 100, borderRadius: 8 },
  removeImage: { position: 'absolute', top: -8, right: -8, backgroundColor: '#fff' },
  addImageButton: { height: 100, justifyContent: 'center', width: 100 },
  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#fff', padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 8 },
  saveBtn: { borderRadius: 12, paddingVertical: 10, fontWeight: 'bold', fontSize: 16 },
  rfidContainer: { flexDirection: 'row', alignItems: 'flex-end', gap: 12, marginBottom: 12 },
  rfidInput: { flex: 1 },
  nfcButton: { borderRadius: 8, minHeight: 48, paddingHorizontal: 12 },
  descriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  aiButton: {
    borderRadius: 20,
    borderColor: '#2D6A4F',
  },
}); 