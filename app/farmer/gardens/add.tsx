import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, TextInput, Button, Surface, IconButton, Chip, SegmentedButtons } from 'react-native-paper';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker } from 'react-native-maps';

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
}

const TREE_TYPES = [
  { value: 'zeytin', label: 'Zeytin' },
  { value: 'portakal', label: 'Portakal' },
  { value: 'elma', label: 'Elma' },
  { value: 'findik', label: 'Fındık' },
  { value: 'armut', label: 'Armut' },
];

const FEATURES = [
  { value: 'damla_sulama', label: 'Damla Sulama' },
  { value: 'yagmurlama', label: 'Yağmurlama Sistemi' },
  { value: 'organik', label: 'Organik Tarım' },
  { value: 'gubre', label: 'Gübre Sistemi' },
  { value: 'ilaclama', label: 'İlaçlama Sistemi' },
];

export default function AddGardenScreen() {
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
  });

  const [errors, setErrors] = useState<Partial<Record<keyof GardenForm, string>>>({});

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

  const validateForm = () => {
    const newErrors: Partial<Record<keyof GardenForm, string>> = {};

    if (!form.name) newErrors.name = 'Bahçe adı gereklidir';
    if (!form.location) newErrors.location = 'Konum bilgisi gereklidir';
    if (!form.area) newErrors.area = 'Alan bilgisi gereklidir';
    if (form.treeTypes.length === 0) newErrors.treeTypes = 'En az bir ağaç türü seçin';
    if (form.images.length === 0) newErrors.images = 'En az bir fotoğraf ekleyin';

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
    <ScrollView style={styles.container}>
      <Surface style={styles.header} elevation={2}>
        <View style={styles.headerContent}>
          <IconButton icon="arrow-left" onPress={() => router.back()} />
          <Text variant="headlineMedium">Yeni Bahçe Ekle</Text>
        </View>
      </Surface>

      <View style={styles.form}>
        <TextInput
          label="Bahçe Adı"
          value={form.name}
          onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
          mode="outlined"
          error={!!errors.name}
          style={styles.input}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        <TextInput
          label="Konum"
          value={form.location}
          onChangeText={(text) => setForm((prev) => ({ ...prev, location: text }))}
          mode="outlined"
          error={!!errors.location}
          style={styles.input}
        />
        {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}

        <TextInput
          label="Alan (m²)"
          value={form.area}
          onChangeText={(text) => setForm((prev) => ({ ...prev, area: text }))}
          mode="outlined"
          error={!!errors.area}
          keyboardType="numeric"
          style={styles.input}
        />
        {errors.area && <Text style={styles.errorText}>{errors.area}</Text>}

        <Text variant="titleMedium" style={styles.sectionTitle}>Ağaç Türleri</Text>
        <View style={styles.chipGroup}>
          {TREE_TYPES.map((type) => (
            <Chip
              key={type.value}
              selected={form.treeTypes.includes(type.value)}
              onPress={() => toggleTreeType(type.value)}
              style={styles.chip}
            >
              {type.label}
            </Chip>
          ))}
        </View>
        {errors.treeTypes && <Text style={styles.errorText}>{errors.treeTypes}</Text>}

        <Text variant="titleMedium" style={styles.sectionTitle}>Özellikler</Text>
        <View style={styles.chipGroup}>
          {FEATURES.map((feature) => (
            <Chip
              key={feature.value}
              selected={form.features.includes(feature.value)}
              onPress={() => toggleFeature(feature.value)}
              style={styles.chip}
            >
              {feature.label}
            </Chip>
          ))}
        </View>

        <TextInput
          label="Açıklama"
          value={form.description}
          onChangeText={(text) => setForm((prev) => ({ ...prev, description: text }))}
          mode="outlined"
          multiline
          numberOfLines={4}
          style={[styles.input, styles.textArea]}
        />

        <Text variant="titleMedium" style={styles.sectionTitle}>Konum Seç</Text>
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

        <Text variant="titleMedium" style={styles.sectionTitle}>Fotoğraflar</Text>
        <View style={styles.imageContainer}>
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
        </View>
        {errors.images && <Text style={styles.errorText}>{errors.images}</Text>}

        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
        >
          Bahçe Ekle
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  form: {
    padding: 16,
  },
  input: {
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  errorText: {
    color: '#B00020',
    fontSize: 12,
    marginBottom: 8,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    marginBottom: 8,
  },
  textArea: {
    minHeight: 100,
  },
  map: {
    height: 200,
    marginBottom: 16,
    borderRadius: 8,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImage: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
  },
  addImageButton: {
    height: 100,
    justifyContent: 'center',
    width: 100,
  },
  submitButton: {
    marginVertical: 24,
    backgroundColor: '#2E7D32',
  },
}); 