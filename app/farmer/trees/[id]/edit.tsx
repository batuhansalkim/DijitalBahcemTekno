import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, Surface, IconButton, Chip } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNfcReader } from '../../../_hooks/useNfcReader';

// Örnek ağaç verileri (gerçek uygulamada API'den gelecek)
const TREES_DATA = [
  {
    id: '1',
    name: 'Zeytin Ağacı #123',
    type: 'Zeytin',
    age: 15,
    health: 95,
    status: 'available',
    garden: 'Zeytinlik Bahçesi',
    lastHarvest: '120 kg',
    nextHarvest: '2024 Kasım',
    rentalPrice: '2.500',
    expectedHarvest: '150 kg',
    harvestMonth: 'Kasım',
    description: 'Bu zeytin ağacı, dedemizin 2008\'de diktiği ilk ağaçlardan. Her yıl kaliteli zeytin veriyor.',
    story: 'Bu 15 yaşındaki zeytin ağacımız, dedemizin 2008\'de diktiği ilk ağaçlardan. Her yıl 120kg zeytin veriyor ve ailemizin gururu. "Barış Ağacı" olarak biliniyor çünkü komşularımızla birlikte hasat ediyoruz.',
    imageUrl: 'https://images.unsplash.com/photo-1445264718234-a623be589d37?w=400&h=300&fit=crop',
    rfidCode: 'RFID-123456',
    location: { latitude: '40.7128', longitude: '-74.0060' },
    treeId: 'TR-123456-ABC',
    images: [
      'https://images.unsplash.com/photo-1445264718234-a623be589d37?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1590086783191-a0694c7d1e6e?w=400&h=300&fit=crop',
    ],
  },
  {
    id: '2',
    name: 'Portakal Ağacı #45',
    type: 'Portakal',
    age: 8,
    health: 88,
    status: 'rented',
    garden: 'Karışık Meyve Bahçesi',
    lastHarvest: '85 kg',
    nextHarvest: '2024 Mart',
    rentalPrice: '1.800',
    expectedHarvest: '100 kg',
    harvestMonth: 'Mart',
    description: 'Çocukluğumda diktiğim ilk ağaç. Her yıl mis kokulu portakallar veriyor.',
    story: 'Bu portakal ağacımız, çocukluğumda diktiğim ilk ağaç. 8 yaşında babamla birlikte dikmiştik. Şimdi 8 yaşında ve her yıl mis kokulu portakallar veriyor. "Çocukluk Ağacı" olarak anılıyor.',
    imageUrl: 'https://images.unsplash.com/photo-1590086783191-a0694c7d1e6e?w=400&h=300&fit=crop',
    rfidCode: 'RFID-789012',
    location: { latitude: '40.7589', longitude: '-73.9851' },
    treeId: 'TR-789012-DEF',
    images: [
      'https://images.unsplash.com/photo-1590086783191-a0694c7d1e6e?w=400&h=300&fit=crop',
    ],
  },
];

const TREE_TYPES = [
  { value: 'zeytin', label: 'Zeytin', icon: '🌳' },
  { value: 'portakal', label: 'Portakal', icon: '🍊' },
  { value: 'elma', label: 'Elma', icon: '🍎' },
  { value: 'findik', label: 'Fındık', icon: '🌰' },
  { value: 'ceviz', label: 'Ceviz', icon: '🥜' },
  { value: 'kayisi', label: 'Kayısı', icon: '🍑' },
  { value: 'seftali', label: 'Şeftali', icon: '🍑' },
];

const TREE_STATUS = [
  { value: 'healthy', label: 'Sağlıklı', color: '#4CAF50' },
  { value: 'maintenance', label: 'Bakım Gerekli', color: '#FFC107' },
  { value: 'disease', label: 'Hastalıklı', color: '#F44336' },
  { value: 'young', label: 'Genç Ağaç', color: '#2196F3' },
];

const HARVEST_MONTHS = [
  { value: 'mart', label: 'Mart' },
  { value: 'nisan', label: 'Nisan' },
  { value: 'mayis', label: 'Mayıs' },
  { value: 'haziran', label: 'Haziran' },
  { value: 'temmuz', label: 'Temmuz' },
  { value: 'agustos', label: 'Ağustos' },
  { value: 'eylul', label: 'Eylül' },
  { value: 'ekim', label: 'Ekim' },
  { value: 'kasim', label: 'Kasım' },
  { value: 'aralik', label: 'Aralık' },
];

const GARDENS = [
  { id: '1', name: 'Zeytinlik Bahçesi' },
  { id: '2', name: 'Karışık Meyve Bahçesi' },
  { id: '3', name: 'Fındık Bahçesi' },
];

export default function EditTreeScreen() {
  const { id } = useLocalSearchParams();
  const originalTree = TREES_DATA.find(t => t.id === id);
  
  // NFC Reader Hook
  const { state, uid, error, read } = useNfcReader();

  const [form, setForm] = useState({
    name: originalTree?.name || '',
    type: originalTree?.type || '',
    age: originalTree?.age?.toString() || '',
    health: originalTree?.health?.toString() || '',
    status: originalTree?.status || 'available',
    garden: originalTree?.garden || '',
    expectedHarvest: originalTree?.expectedHarvest || '',
    harvestMonth: originalTree?.harvestMonth || '',
    rentalPrice: originalTree?.rentalPrice || '',
    description: originalTree?.description || '',
    story: originalTree?.story || '',
    rfidCode: originalTree?.rfidCode || '',
    location: {
      latitude: originalTree?.location?.latitude || '',
      longitude: originalTree?.location?.longitude || '',
    },
    images: originalTree?.images || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // UID'yi forma otomatik doldur
  useEffect(() => {
    if (uid) {
      setForm(prev => ({ ...prev, rfidCode: uid }));
    }
  }, [uid]);

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name) newErrors.name = 'Ağaç adı gereklidir';
    if (!form.age) newErrors.age = 'Yaş bilgisi gereklidir';
    if (!form.garden) newErrors.garden = 'Bahçe seçimi gereklidir';
    if (!form.expectedHarvest) newErrors.expectedHarvest = 'Tahmini hasat miktarı gereklidir';
    if (!form.rentalPrice) newErrors.rentalPrice = 'Kira bedeli gereklidir';
    if (!form.rfidCode) newErrors.rfidCode = 'RFID kodu gereklidir';
    if (!form.location.latitude || !form.location.longitude) {
      newErrors.location = 'Konum bilgisi gereklidir';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // API call to update tree
      console.log('Form updated:', form);
      router.back();
    }
  };

  if (!originalTree) {
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
              <Text style={styles.title}>Ağaç Düzenle 🌳</Text>
              <Text style={styles.subtitle}>{originalTree.name}</Text>
            </View>
          </View>
        </Surface>

        <View style={styles.form}>
          {/* Temel Bilgiler */}
          <Surface style={styles.section} elevation={2}>
            <Text style={styles.sectionTitle}>Temel Bilgiler</Text>
            
            <TextInput
              label="Ağaç Adı"
              value={form.name}
              onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
              mode="outlined"
              error={!!errors.name}
              style={[styles.input, { color: '#000' }]}
              outlineColor="#E0E0E0"
              activeOutlineColor="#2E7D32"
              textColor="#000"
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

            <Text style={styles.label}>Ağaç Türü</Text>
            <View style={styles.typeContainer}>
              {TREE_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.typeButton,
                    form.type === type.value && styles.typeButtonActive
                  ]}
                  onPress={() => setForm((prev) => ({ ...prev, type: type.value }))}
                >
                  <Text style={styles.typeIcon}>{type.icon}</Text>
                  <Text style={[
                    styles.typeText,
                    form.type === type.value && styles.typeTextActive
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <TextInput
                  label="Yaş"
                  value={form.age}
                  onChangeText={(text) => setForm((prev) => ({ ...prev, age: text }))}
                  mode="outlined"
                  error={!!errors.age}
                  keyboardType="numeric"
                  style={[styles.input, { color: '#000' }]}
                  outlineColor="#E0E0E0"
                  activeOutlineColor="#2E7D32"
                  textColor="#000"
                />
                {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
              </View>

              <View style={styles.halfInput}>
                <TextInput
                  label="Sağlık Durumu (%)"
                  value={form.health}
                  onChangeText={(text) => setForm((prev) => ({ ...prev, health: text }))}
                  mode="outlined"
                  keyboardType="numeric"
                  style={[styles.input, { color: '#000' }]}
                  outlineColor="#E0E0E0"
                  activeOutlineColor="#2E7D32"
                  textColor="#000"
                />
              </View>
            </View>

            <Text style={styles.label}>Ağaç Durumu</Text>
            <View style={styles.statusContainer}>
              {TREE_STATUS.map((status) => (
                <TouchableOpacity
                  key={status.value}
                  style={[
                    styles.statusButton,
                    form.status === status.value && styles.statusButtonActive
                  ]}
                  onPress={() => setForm((prev) => ({ ...prev, status: status.value }))}
                >
                  <Text style={[
                    styles.statusText,
                    form.status === status.value && styles.statusTextActive
                  ]}>
                    {status.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Surface>

          {/* Bahçe ve Hasat */}
          <Surface style={styles.section} elevation={2}>
            <Text style={styles.sectionTitle}>Bahçe ve Hasat Bilgileri</Text>
            
            <Text style={styles.label}>Bahçe Seçimi</Text>
            <View style={styles.gardenContainer}>
              {GARDENS.map((garden) => (
                <TouchableOpacity
                  key={garden.id}
                  style={[
                    styles.gardenButton,
                    form.garden === garden.name && styles.gardenButtonActive
                  ]}
                  onPress={() => setForm((prev) => ({ ...prev, garden: garden.name }))}
                >
                  <MaterialCommunityIcons 
                    name="flower" 
                    size={20} 
                    color={form.garden === garden.name ? '#fff' : '#2E7D32'} 
                  />
                  <Text style={[
                    styles.gardenText,
                    form.garden === garden.name && styles.gardenTextActive
                  ]}>
                    {garden.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.garden && <Text style={styles.errorText}>{errors.garden}</Text>}

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <TextInput
                  label="Tahmini Hasat (kg)"
                  value={form.expectedHarvest}
                  onChangeText={(text) => setForm((prev) => ({ ...prev, expectedHarvest: text }))}
                  mode="outlined"
                  error={!!errors.expectedHarvest}
                  keyboardType="numeric"
                  style={[styles.input, { color: '#000' }]}
                  outlineColor="#E0E0E0"
                  activeOutlineColor="#2E7D32"
                  textColor="#000"
                />
                {errors.expectedHarvest && (
                  <Text style={styles.errorText}>{errors.expectedHarvest}</Text>
                )}
              </View>

              <View style={styles.halfInput}>
                <TextInput
                  label="Yıllık Kira (₺)"
                  value={form.rentalPrice}
                  onChangeText={(text) => setForm((prev) => ({ ...prev, rentalPrice: text }))}
                  mode="outlined"
                  error={!!errors.rentalPrice}
                  keyboardType="numeric"
                  style={[styles.input, { color: '#000' }]}
                  outlineColor="#E0E0E0"
                  activeOutlineColor="#2E7D32"
                  textColor="#000"
                />
                {errors.rentalPrice && (
                  <Text style={styles.errorText}>{errors.rentalPrice}</Text>
                )}
              </View>
            </View>

            <Text style={styles.label}>Hasat Ayı</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.monthScroll}>
              <View style={styles.monthContainer}>
                {HARVEST_MONTHS.map((month) => (
                  <TouchableOpacity
                    key={month.value}
                    style={[
                      styles.monthButton,
                      form.harvestMonth === month.value && styles.monthButtonActive
                    ]}
                    onPress={() => setForm((prev) => ({ ...prev, harvestMonth: month.value }))}
                  >
                    <Text style={[
                      styles.monthText,
                      form.harvestMonth === month.value && styles.monthTextActive
                    ]}>
                      {month.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </Surface>

          {/* RFID ve Konum */}
          <Surface style={styles.section} elevation={2}>
            <Text style={styles.sectionTitle}>RFID ve Konum</Text>
            
            <View style={styles.rfidContainer}>
              <TextInput
                label="RFID Kodu"
                value={form.rfidCode}
                onChangeText={(text) => setForm((prev) => ({ ...prev, rfidCode: text }))}
                mode="outlined"
                error={!!errors.rfidCode}
                style={[styles.input, styles.rfidInput, { color: '#000' }]}
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

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <TextInput
                  label="Enlem"
                  value={form.location.latitude}
                  onChangeText={(text) => setForm((prev) => ({ 
                    ...prev, 
                    location: { ...prev.location, latitude: text }
                  }))}
                  mode="outlined"
                  error={!!errors.location}
                  keyboardType="numeric"
                  style={[styles.input, { color: '#000' }]}
                  outlineColor="#E0E0E0"
                  activeOutlineColor="#2E7D32"
                  placeholder="40.7128"
                  textColor="#000"
                />
              </View>

              <View style={styles.halfInput}>
                <TextInput
                  label="Boylam"
                  value={form.location.longitude}
                  onChangeText={(text) => setForm((prev) => ({ 
                    ...prev, 
                    location: { ...prev.location, longitude: text }
                  }))}
                  mode="outlined"
                  error={!!errors.location}
                  keyboardType="numeric"
                  style={[styles.input, { color: '#000' }]}
                  outlineColor="#E0E0E0"
                  activeOutlineColor="#2E7D32"
                  placeholder="-74.0060"
                  textColor="#000"
                />
              </View>
            </View>
            {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}

            <View style={styles.treeIdContainer}>
              <Text style={styles.label}>Ağaç ID</Text>
              <View style={styles.treeIdBox}>
                <Text style={styles.treeIdText}>
                  {originalTree.treeId}
                </Text>
                <Chip style={styles.readOnlyChip}>Salt Okunur</Chip>
              </View>
            </View>
          </Surface>

          {/* Açıklama */}
          <Surface style={styles.section} elevation={2}>
            <Text style={styles.sectionTitle}>Açıklama</Text>
            <TextInput
              label="Ağaç hakkında detaylı bilgi"
              value={form.description}
              onChangeText={(text) => setForm((prev) => ({ ...prev, description: text }))}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={[styles.input, styles.textArea, { color: '#000' }]}
              outlineColor="#E0E0E0"
              activeOutlineColor="#2E7D32"
              textColor="#000"
            />
          </Surface>

          {/* Ağaç Hikayesi */}
          <Surface style={styles.section} elevation={2}>
            <Text style={styles.sectionTitle}>🌳 Ağaç Hikayesi</Text>
            <Text style={styles.storySubtitle}>
              Bu ağacın özel hikayesini paylaşın. Kiralayan kişilerle duygusal bağ kurun!
            </Text>
            <TextInput
              label="Ağacınızın hikayesini anlatın..."
              value={form.story}
              onChangeText={(text) => setForm((prev) => ({ ...prev, story: text }))}
              mode="outlined"
              multiline
              numberOfLines={6}
              style={[styles.input, styles.storyArea, { color: '#000' }]}
              outlineColor="#E0E0E0"
              activeOutlineColor="#2E7D32"
              placeholder="Örn: Bu 15 yaşındaki zeytin ağacımız, dedemizin 2008'de diktiği ilk ağaçlardan. Her yıl 120kg zeytin veriyor ve ailemizin gururu. 'Barış Ağacı' olarak biliniyor çünkü komşularımızla birlikte hasat ediyoruz."
              textColor="#000"
            />
          </Surface>

          {/* Fotoğraflar */}
          <Surface style={styles.section} elevation={2}>
            <Text style={styles.sectionTitle}>Fotoğraflar</Text>
            <View style={styles.imageContainer}>
              {form.images.map((uri, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri }} style={styles.image} />
                  <IconButton
                    icon="close"
                    size={20}
                    style={styles.removeImage}
                    onPress={() => removeImage(index)}
                    iconColor="#fff"
                  />
                </View>
              ))}
              <TouchableOpacity
                style={styles.addImageButton}
                onPress={pickImage}
              >
                <MaterialCommunityIcons name="camera-plus" size={32} color="#2E7D32" />
                <Text style={styles.addImageText}>Fotoğraf Ekle</Text>
              </TouchableOpacity>
            </View>
          </Surface>

          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.submitButton}
            buttonColor="#2E7D32"
            textColor="#fff"
          >
            Değişiklikleri Kaydet
          </Button>
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
  form: {
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
  input: {
    marginBottom: 12,
    backgroundColor: '#fff',
    color: '#000',
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginBottom: 8,
    marginTop: -8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1B4332',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
  typeButtonActive: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  typeIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  typeText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  typeTextActive: {
    color: '#fff',
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
  statusButtonActive: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  statusText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  statusTextActive: {
    color: '#fff',
  },
  gardenContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  gardenButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
  gardenButtonActive: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  gardenText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginLeft: 6,
  },
  gardenTextActive: {
    color: '#fff',
  },
  monthScroll: {
    marginBottom: 16,
  },
  monthContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  monthButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#fff',
    minWidth: 80,
  },
  monthButtonActive: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  monthText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
  monthTextActive: {
    color: '#fff',
  },
  treeIdContainer: {
    marginTop: 8,
  },
  treeIdBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  treeIdText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
    fontFamily: 'monospace',
  },
  readOnlyChip: {
    backgroundColor: '#E0E0E0',
    marginLeft: 8,
  },
  textArea: {
    marginTop: 8,
  },
  storySubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  storyArea: {
    marginTop: 8,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  removeImage: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#F44336',
    borderRadius: 12,
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: '#2E7D32',
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAF8',
  },
  addImageText: {
    fontSize: 10,
    color: '#2E7D32',
    marginTop: 4,
    textAlign: 'center',
  },
  submitButton: {
    marginVertical: 24,
    borderRadius: 12,
    paddingVertical: 8,
  },
  rfidContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    marginBottom: 12,
  },
  rfidInput: {
    flex: 1,
  },
  nfcButton: {
    borderRadius: 8,
    minHeight: 48,
    paddingHorizontal: 12,
  },
}); 