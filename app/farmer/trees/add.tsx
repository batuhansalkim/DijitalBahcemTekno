import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, StatusBar, TouchableOpacity, Alert, Platform } from 'react-native';
import { Text, TextInput, Button, Surface, IconButton, Chip, Divider, ProgressBar } from 'react-native-paper';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNfcReader } from '../../hooks/useNfcReader';
import { useTreeUpload } from '../../hooks/useTreeUpload';
import { TreeDataPackage } from '../../services/pinataService';
import { NfcTutorialModal } from '../../components/NfcTutorialModal';
import { SuccessModal } from '../../components/SuccessModal';

interface TreeForm {
  name: string;
  type: string;
  age: string;
  health: string;
  status: string;
  garden: string;
  expectedHarvest: string;
  harvestMonth: string;
  rentalPrice: string;
  description: string;
  story: string;
  rfidCode: string;
  location: {
    latitude: string;
    longitude: string;
  };
  treeId: string;
  images: string[];
}

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

// Örnek bahçe verileri
const GARDENS = [
  { id: '1', name: 'Zeytinlik Bahçesi' },
  { id: '2', name: 'Karışık Meyve Bahçesi' },
  { id: '3', name: 'Fındık Bahçesi' },
];

export default function AddTreeScreen() {
  // NFC Reader Hook
  const { state, uid, error, read, readWithLocation, location, showTutorial, showSuccess, showTutorialModal, hideTutorialModal, hideSuccessModal } = useNfcReader();
  const { uploadTreeData, isUploading, uploadProgress, lastUploadedCid, testConnection } = useTreeUpload();
  
  // UID okunduğunda forma ekle ve ağaç ID'sini güncelle
  useEffect(() => {
    if (uid) {
      const newTreeId = generateTreeId(uid);
      setForm(prev => ({ 
        ...prev, 
        rfidCode: uid,
        treeId: newTreeId
      }));
    }
  }, [uid]);

  // Konum okunduğunda forma ekle
  useEffect(() => {
    if (location) {
      setForm(prev => ({ 
        ...prev, 
        location: {
          latitude: location.lat.toString(),
          longitude: location.lon.toString()
        }
      }));
    }
  }, [location]);
  
  const [form, setForm] = useState<TreeForm>({
    name: '',
    type: TREE_TYPES[0].value,
    age: '',
    health: '100',
    status: TREE_STATUS[0].value,
    garden: '',
    expectedHarvest: '',
    harvestMonth: HARVEST_MONTHS[0].value,
    rentalPrice: '',
    description: '',
    story: '',
    rfidCode: '',
    location: {
      latitude: '',
      longitude: '',
    },
    treeId: '',
    images: [],
  });

  const [errors, setErrors] = useState<Partial<Record<keyof TreeForm, string>>>({});
  const [showCustomType, setShowCustomType] = useState(false);
  const [showCustomGarden, setShowCustomGarden] = useState(false);
  const [customType, setCustomType] = useState('');
  const [customGarden, setCustomGarden] = useState('');

  // UID'yi forma otomatik doldur
  useEffect(() => {
    if (uid) {
      setForm(prev => ({ ...prev, rfidCode: uid }));
    }
  }, [uid]);

  const generateTreeId = (rfidUid?: string) => {
    if (rfidUid) {
      return `TR-${rfidUid}`;
    }
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `TR-${timestamp}-${random}`;
  };

  const addCustomType = () => {
    if (customType.trim()) {
      // Burada yeni ağaç türünü listeye ekleyebiliriz
      console.log('Yeni ağaç türü eklendi:', customType);
      setForm((prev) => ({ ...prev, type: customType.toLowerCase() }));
      setCustomType('');
      setShowCustomType(false);
    }
  };

  const addCustomGarden = () => {
    if (customGarden.trim()) {
      // Burada yeni bahçeyi listeye ekleyebiliriz
      console.log('Yeni bahçe eklendi:', customGarden);
      setForm((prev) => ({ ...prev, garden: customGarden }));
      setCustomGarden('');
      setShowCustomGarden(false);
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

  const validateForm = () => {
    const newErrors: Partial<Record<keyof TreeForm, string>> = {};

    if (!form.name) newErrors.name = 'Ağaç adı gereklidir';
    if (!form.age) newErrors.age = 'Yaş bilgisi gereklidir';
    if (!form.garden) newErrors.garden = 'Bahçe seçimi gereklidir';
    if (!form.expectedHarvest) newErrors.expectedHarvest = 'Tahmini hasat miktarı gereklidir';
    if (!form.rentalPrice) newErrors.rentalPrice = 'Kira bedeli gereklidir';
    if (!form.rfidCode) newErrors.rfidCode = 'RFID kodu gereklidir';
    if (!form.location.latitude || !form.location.longitude) {
      newErrors.location = 'Konum bilgisi gereklidir';
    }
    if (form.images.length === 0) newErrors.images = 'En az bir fotoğraf ekleyin';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        // Form verilerini TreeDataPackage formatına çevir
        const treeDataPackage: TreeDataPackage = {
          tree_info: {
            rfid_uid: form.rfidCode,
            tree_id: form.treeId,
            name: form.name,
            type: form.type,
            age_years: parseInt(form.age) || 0,
            health_percent: parseInt(form.health) || 100,
            status: form.status
          },
          location: {
            lat: parseFloat(form.location.latitude),
            lon: parseFloat(form.location.longitude),
            accuracy_m: location?.accuracy_m || 0,
            altitude_m: location?.alt
          },
          timestamp: {
            collected_at_utc: new Date().toISOString(),
            created_at_utc: new Date().toISOString(),
            updated_at_utc: new Date().toISOString()
          },
          farmer_info: {
            farmer_id: "farmer_123", // TODO: Kullanıcıdan alınacak
            name: "Ahmet Çiftçi",    // TODO: Kullanıcıdan alınacak
            experience_years: 15      // TODO: Kullanıcıdan alınacak
          },
          garden_info: {
            garden_id: form.garden,
            garden_name: form.garden,
            area_hectares: 2.5,      // TODO: Kullanıcıdan alınacak
            location: "Ayvalık, Balıkesir" // TODO: Kullanıcıdan alınacak
          },
          harvest_info: {
            expected_harvest_date: form.harvestMonth,
            expected_harvest_amount_kg: parseInt(form.expectedHarvest) || 0
          },
          maintenance_info: {
            notes: form.description
          },
          device_info: {
            platform: Platform.OS,
            os_version: Platform.Version.toString(),
            device_model: "Unknown", // TODO: Device info'dan alınacak
            app_version: "1.0.0",
            nfc_technology: "Ndef",
            gps_accuracy_m: location?.accuracy_m || 0
          }
        };

        // Pinata'ya yükle
        const cid = await uploadTreeData(treeDataPackage);
        
        // Başarılı olduğunda formu temizle ve geri dön
        setForm({
          name: '',
          type: TREE_TYPES[0].value,
          age: '',
          health: '100',
          status: TREE_STATUS[0].value,
          garden: '',
          expectedHarvest: '',
          harvestMonth: HARVEST_MONTHS[0].value,
          rentalPrice: '',
          description: '',
          story: '',
          rfidCode: '',
          location: {
            latitude: '',
            longitude: '',
          },
          treeId: '',
          images: [],
        });
        
        // Geri dön
        router.back();
        
      } catch (error) {
        console.error('Submit error:', error);
        // Hata zaten useTreeUpload hook'unda handle ediliyor
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E7D32" />
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
              <Text style={styles.title}>Yeni Ağaç Ekle 🌳</Text>
              <Text style={styles.subtitle}>Ağaç bilgilerini doldurun</Text>
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
              <TouchableOpacity
                style={styles.addCustomButton}
                onPress={() => setShowCustomType(true)}
              >
                <MaterialCommunityIcons name="plus" size={16} color="#2E7D32" />
                <Text style={styles.addCustomText}>Yeni Tür</Text>
              </TouchableOpacity>
            </View>

            {showCustomType && (
              <Surface style={styles.customModal} elevation={4}>
                <View style={styles.customModalHeader}>
                  <View style={styles.customModalTitleContainer}>
                    <MaterialCommunityIcons name="tree" size={24} color="#2E7D32" />
                    <Text style={styles.customModalTitle}>Yeni Ağaç Türü Ekle</Text>
                  </View>
                  <TouchableOpacity onPress={() => setShowCustomType(false)}>
                    <MaterialCommunityIcons name="close" size={24} color="#666" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.customModalSubtitle}>
                  Listede olmayan ağaç türünü ekleyin
                </Text>
                <TextInput
                  label="Ağaç Türü Adı"
                  value={customType}
                  onChangeText={setCustomType}
                  mode="outlined"
                  style={styles.customInput}
                  outlineColor="#E0E0E0"
                  activeOutlineColor="#2E7D32"
                  placeholder="Örn: Kiraz, Vişne, Kayısı, Şeftali..."
                />
                <View style={styles.customModalActions}>
                  <Button
                    mode="contained"
                    onPress={addCustomType}
                    style={[
                      styles.customModalButton, 
                      { 
                        width: '100%',
                        backgroundColor: customType.trim() ? '#2E7D32' : '#A5D6A7',
                      }
                    ]}
                    buttonColor={customType.trim() ? '#2E7D32' : '#A5D6A7'}
                    textColor="#fff"
                    disabled={!customType.trim()}
                    labelStyle={{ color: '#fff' }}
                  >
                    Ekle
                  </Button>
                </View>
              </Surface>
            )}

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

            <View style={{ height: 20 }} />

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
                onPress={readWithLocation}
                loading={state === 'reading'}
                disabled={state === 'reading'}
                style={styles.nfcButton}
                buttonColor="#2E7D32"
                textColor="#fff"
                icon="nfc"
                labelStyle={{ fontSize: 12 }}
              >
                {state === 'reading' ? 'Okunuyor...' : 'NFC + Konum Oku'}
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
                  placeholder="NFC ile otomatik alınacak"
                  textColor="#000"
                  editable={false}
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
                  placeholder="NFC ile otomatik alınacak"
                  textColor="#000"
                  editable={false}
                />
              </View>
            </View>
            {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}

            <View style={styles.treeIdContainer}>
              <Text style={styles.label}>Ağaç ID</Text>
              <View style={styles.treeIdBox}>
                <Text style={styles.treeIdText}>
                  {form.treeId || generateTreeId(form.rfidCode)}
                </Text>
                <IconButton
                  icon="refresh"
                  size={20}
                  onPress={() => setForm((prev) => ({ ...prev, treeId: generateTreeId(form.rfidCode) }))}
                  iconColor="#2E7D32"
                />
              </View>
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
                    form.garden === garden.id && styles.gardenButtonActive
                  ]}
                  onPress={() => setForm((prev) => ({ ...prev, garden: garden.id }))}
                >
                  <MaterialCommunityIcons 
                    name="flower" 
                    size={20} 
                    color={form.garden === garden.id ? '#fff' : '#2E7D32'} 
                  />
                  <Text style={[
                    styles.gardenText,
                    form.garden === garden.id && styles.gardenTextActive
                  ]}>
                    {garden.name}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.addCustomButton}
                onPress={() => setShowCustomGarden(true)}
              >
                <MaterialCommunityIcons name="plus" size={16} color="#2E7D32" />
                <Text style={styles.addCustomText}>Yeni Bahçe</Text>
              </TouchableOpacity>
            </View>

            {showCustomGarden && (
              <Surface style={styles.customModal} elevation={4}>
                <View style={styles.customModalHeader}>
                  <View style={styles.customModalTitleContainer}>
                    <MaterialCommunityIcons name="flower" size={24} color="#2E7D32" />
                    <Text style={styles.customModalTitle}>Yeni Bahçe Ekle</Text>
                  </View>
                  <TouchableOpacity onPress={() => setShowCustomGarden(false)}>
                    <MaterialCommunityIcons name="close" size={24} color="#666" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.customModalSubtitle}>
                  Yeni bir bahçe alanı tanımlayın
                </Text>
                <TextInput
                  label="Bahçe Adı"
                  value={customGarden}
                  onChangeText={setCustomGarden}
                  mode="outlined"
                  style={styles.customInput}
                  outlineColor="#E0E0E0"
                  activeOutlineColor="#2E7D32"
                  placeholder="Örn: Elma Bahçesi, Kiraz Bahçesi, Karışık Meyve Bahçesi..."
                />
                <View style={styles.customModalActions}>
                  <Button
                    mode="contained"
                    onPress={addCustomGarden}
                    style={[
                      styles.customModalButton, 
                      { 
                        width: '100%',
                        backgroundColor: customGarden.trim() ? '#2E7D32' : '#A5D6A7',
                      }
                    ]}
                    buttonColor={customGarden.trim() ? '#2E7D32' : '#A5D6A7'}
                    textColor="#fff"
                    disabled={!customGarden.trim()}
                    labelStyle={{ color: '#fff' }}
                  >
                    Ekle
                  </Button>
                </View>
              </Surface>
            )}
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
            <View style={styles.storyInfo}>
              <MaterialCommunityIcons name="lightbulb-outline" size={16} color="#666" />
              <Text style={styles.storyInfoText}>
                Hikaye, kiralayan kişilerin dikkatini çeker ve duygusal bağ kurmalarını sağlar
              </Text>
            </View>
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
            {errors.images && <Text style={styles.errorText}>{errors.images}</Text>}
          </Surface>

          {/* Upload Progress */}
          {isUploading && (
            <Surface style={styles.progressContainer} elevation={2}>
              <Text style={styles.progressText}>IPFS'e yükleniyor... {uploadProgress}%</Text>
              <ProgressBar 
                progress={uploadProgress / 100} 
                color="#2E7D32"
                style={styles.progressBar}
              />
            </Surface>
          )}

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={isUploading}
            disabled={!uid || !location || isUploading}
            style={styles.submitButton}
            buttonColor="#2E7D32"
            textColor="#fff"
          >
            {isUploading ? 'Yükleniyor...' : 'Ağacı Kaydet'}
          </Button>
        </View>
      </ScrollView>
      
      {/* NFC Tutorial Modal */}
      <NfcTutorialModal
        visible={showTutorial}
        onClose={hideTutorialModal}
        onStartReading={read}
        isReading={state === 'reading'}
      />
      
      {/* Success Modal */}
      <SuccessModal
        visible={showSuccess}
        uid={uid}
        onClose={hideSuccessModal}
      />
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
    fontSize: 14,
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
  textArea: {
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
  progressContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    color: '#2E7D32',
    marginBottom: 8,
    fontWeight: '500',
  },
  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
  },
  storySubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  storyArea: {
    marginTop: 8,
  },
  storyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  storyInfoText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  addCustomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
  addCustomText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '500',
    marginLeft: 6,
  },
  customModal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  customModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  customModalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B4332',
    marginLeft: 8,
  },
  customModalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  customInput: {
    marginBottom: 12,
    backgroundColor: '#fff',
    color: '#000',
  },
  customModalActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  customModalButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    minHeight: 36,
  },
  rfidContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  rfidInput: {
    flex: 1,
  },
  nfcButton: {
    borderRadius: 8,
    minHeight: 50,
    paddingHorizontal: 12,
    marginTop: -6,
  },
}); 