import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, Surface, IconButton, Chip } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TextInput as RNTextInput } from 'react-native';

// Demo veri (gerçek uygulamada API'den gelir)
const GARDEN = {
  id: '1',
  name: 'Ayvalık Zeytinliği',
  location: 'Ayvalık, Balıkesir',
  area: '25 dönüm',
  description: 'Ayvalık\'ın verimli topraklarında, organik tarım ilkeleriyle yönetilen zeytinlik.',
  features: ['Damla Sulama Sistemi', 'Organik Tarım', 'Düzenli İlaçlama'],
  treeTypes: ['Zeytin'],
  images: [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80',
  ],
  coordinates: { latitude: 39.309196, longitude: 26.685394 },
};

const TREE_TYPES = [
  { value: 'Zeytin', label: 'Zeytin' },
  { value: 'Portakal', label: 'Portakal' },
  { value: 'Elma', label: 'Elma' },
  { value: 'Fındık', label: 'Fındık' },
  { value: 'Armut', label: 'Armut' },
];

const FEATURES = [
  { value: 'Damla Sulama Sistemi', label: 'Damla Sulama Sistemi' },
  { value: 'Organik Tarım', label: 'Organik Tarım' },
  { value: 'Düzenli İlaçlama', label: 'Düzenli İlaçlama' },
  { value: 'Otomatik Sulama', label: 'Otomatik Sulama' },
  { value: 'Doğal Gübreleme', label: 'Doğal Gübreleme' },
];

export default function EditGardenScreen() {
  const { id } = useLocalSearchParams();
  // Gerçek uygulamada id ile veri çekilecek
  const [form, setForm] = useState({ ...GARDEN });
  const [errors, setErrors] = useState<any>({});

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });
    if (!result.canceled && result.assets[0].uri) {
      setForm((prev) => ({ ...prev, images: [...prev.images, result.assets[0].uri] }));
    }
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const toggleFeature = (value: string) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.includes(value)
        ? prev.features.filter((f: string) => f !== value)
        : [...prev.features, value],
    }));
  };

  const toggleTreeType = (value: string) => {
    setForm((prev) => ({
      ...prev,
      treeTypes: prev.treeTypes.includes(value)
        ? prev.treeTypes.filter((t: string) => t !== value)
        : [...prev.treeTypes, value],
    }));
  };

  const handleSubmit = () => {
    // Validasyon ve güncelleme işlemi (API)
    // ...
    router.back();
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.header} elevation={4}>
        <View style={styles.headerContent}>
          <IconButton icon="arrow-left" onPress={() => router.back()} style={styles.backBtn} />
          <MaterialCommunityIcons name="flower" size={28} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.headerTitle}>Bahçeyi Düzenle</Text>
        </View>
      </Surface>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          <Surface style={styles.formCard} elevation={3}>
            <Text style={styles.sectionTitle}>Temel Bilgiler</Text>
            <View style={{ marginBottom: 8 }}>
              <Text style={{ color: '#000', fontWeight: 'bold', marginBottom: 4 }}>Bahçe Adı</Text>
              <RNTextInput
                value={form.name}
                onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
                style={{
                  color: '#000',
                  borderWidth: 1,
                  borderColor: '#2E7D32',
                  borderRadius: 8,
                  padding: 12,
                  backgroundColor: '#fff',
                  marginBottom: 8,
                }}
                placeholder="Bahçe Adı"
                placeholderTextColor="#000"
              />
            </View>
            <View style={{ marginBottom: 8 }}>
              <Text style={{ color: '#000', fontWeight: 'bold', marginBottom: 4 }}>Konum</Text>
              <RNTextInput
                value={form.location}
                onChangeText={(text) => setForm((prev) => ({ ...prev, location: text }))}
                style={{
                  color: '#000',
                  borderWidth: 1,
                  borderColor: '#2E7D32',
                  borderRadius: 8,
                  padding: 12,
                  backgroundColor: '#fff',
                  marginBottom: 8,
                }}
                placeholder="Konum"
                placeholderTextColor="#000"
              />
            </View>
            <View style={{ marginBottom: 8 }}>
              <Text style={{ color: '#000', fontWeight: 'bold', marginBottom: 4 }}>Alan (m² veya dönüm)</Text>
              <RNTextInput
                value={form.area}
                onChangeText={(text) => setForm((prev) => ({ ...prev, area: text }))}
                style={{
                  color: '#000',
                  borderWidth: 1,
                  borderColor: '#2E7D32',
                  borderRadius: 8,
                  padding: 12,
                  backgroundColor: '#fff',
                  marginBottom: 8,
                }}
                placeholder="Alan (m² veya dönüm)"
                placeholderTextColor="#000"
              />
            </View>
            <View style={{ marginBottom: 8 }}>
              <Text style={{ color: '#000', fontWeight: 'bold', marginBottom: 4 }}>Açıklama</Text>
              <RNTextInput
                value={form.description}
                onChangeText={(text) => setForm((prev) => ({ ...prev, description: text }))}
                style={{
                  color: '#000',
                  borderWidth: 1,
                  borderColor: '#2E7D32',
                  borderRadius: 8,
                  padding: 12,
                  backgroundColor: '#fff',
                  marginBottom: 8,
                  minHeight: 100,
                  textAlignVertical: 'top',
                }}
                placeholder="Açıklama"
                placeholderTextColor="#000"
                multiline
                numberOfLines={4}
              />
            </View>
          </Surface>

          <Surface style={styles.formCard} elevation={3}>
            <Text style={styles.sectionTitle}>Ağaç Türleri</Text>
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
          </Surface>

          <Surface style={styles.formCard} elevation={3}>
            <Text style={styles.sectionTitle}>Özellikler</Text>
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

          <Surface style={styles.formCard} elevation={3}>
            <Text style={styles.sectionTitle}>Konum Seç</Text>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: form.coordinates.latitude,
                longitude: form.coordinates.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              onPress={(e) => setForm((prev) => ({ ...prev, coordinates: e.nativeEvent.coordinate }))}
            >
              <Marker
                coordinate={form.coordinates}
                draggable
                onDragEnd={(e) => setForm((prev) => ({ ...prev, coordinates: e.nativeEvent.coordinate }))}
              />
            </MapView>
          </Surface>

          <Surface style={styles.formCard} elevation={3}>
            <Text style={styles.sectionTitle}>Fotoğraflar</Text>
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
              >
                Fotoğraf Ekle
              </Button>
            </ScrollView>
          </Surface>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.bottomBar}>
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.saveBtn}
          buttonColor="#2E7D32"
          textColor="#fff"
        >
          Kaydet
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
  sectionTitle: { fontWeight: 'bold', color: '#1B4332', fontSize: 15, marginBottom: 12 },
  input: { marginBottom: 8, backgroundColor: '#fff' },
  textArea: { minHeight: 100 },
  chipGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  chip: { marginBottom: 8, backgroundColor: '#E8F5E9' },
  chipSelected: { backgroundColor: '#2E7D32' },
  map: { height: 160, marginBottom: 8, borderRadius: 12 },
  imageRow: { flexDirection: 'row', marginBottom: 8 },
  imageWrapper: { position: 'relative', marginRight: 8 },
  image: { width: 100, height: 100, borderRadius: 8 },
  removeImage: { position: 'absolute', top: -8, right: -8, backgroundColor: '#fff' },
  addImageButton: { height: 100, justifyContent: 'center', width: 100 },
  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#fff', padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 8 },
  saveBtn: { borderRadius: 12, paddingVertical: 10, fontWeight: 'bold', fontSize: 16, },
}); 