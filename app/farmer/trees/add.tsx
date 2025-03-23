import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, TextInput, Button, Surface, SegmentedButtons, IconButton, Chip } from 'react-native-paper';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

interface TreeForm {
  name: string;
  type: string;
  age: string;
  health: string;
  garden: string;
  expectedHarvest: string;
  harvestMonth: string;
  rentalPrice: string;
  description: string;
  images: string[];
}

const TREE_TYPES = [
  { value: 'zeytin', label: 'Zeytin' },
  { value: 'portakal', label: 'Portakal' },
  { value: 'elma', label: 'Elma' },
  { value: 'findik', label: 'Fındık' },
  { value: 'ceviz', label: 'Ceviz' },
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
  const [form, setForm] = useState<TreeForm>({
    name: '',
    type: TREE_TYPES[0].value,
    age: '',
    health: '100',
    garden: '',
    expectedHarvest: '',
    harvestMonth: HARVEST_MONTHS[0].value,
    rentalPrice: '',
    description: '',
    images: [],
  });

  const [errors, setErrors] = useState<Partial<Record<keyof TreeForm, string>>>({});

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
    if (form.images.length === 0) newErrors.images = 'En az bir fotoğraf ekleyin';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // API call to save tree
      console.log('Form submitted:', form);
      router.back();
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.header} elevation={2}>
        <View style={styles.headerContent}>
          <IconButton icon="arrow-left" onPress={() => router.back()} />
          <Text variant="headlineMedium">Yeni Ağaç Ekle</Text>
        </View>
      </Surface>

      <View style={styles.form}>
        <TextInput
          label="Ağaç Adı"
          value={form.name}
          onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
          mode="outlined"
          error={!!errors.name}
          style={styles.input}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        <Text variant="titleMedium" style={styles.sectionTitle}>Ağaç Türü</Text>
        <SegmentedButtons
          value={form.type}
          onValueChange={(value) => setForm((prev) => ({ ...prev, type: value }))}
          buttons={TREE_TYPES}
          style={styles.segmentedButtons}
        />

        <View style={styles.row}>
          <View style={styles.halfInput}>
            <TextInput
              label="Yaş"
              value={form.age}
              onChangeText={(text) => setForm((prev) => ({ ...prev, age: text }))}
              mode="outlined"
              error={!!errors.age}
              keyboardType="numeric"
              style={styles.input}
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
              style={styles.input}
            />
          </View>
        </View>

        <Text variant="titleMedium" style={styles.sectionTitle}>Bahçe Seçimi</Text>
        <View style={styles.gardenList}>
          {GARDENS.map((garden) => (
            <Chip
              key={garden.id}
              selected={form.garden === garden.id}
              onPress={() => setForm((prev) => ({ ...prev, garden: garden.id }))}
              style={styles.gardenChip}
            >
              {garden.name}
            </Chip>
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
              style={styles.input}
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
              style={styles.input}
            />
            {errors.rentalPrice && (
              <Text style={styles.errorText}>{errors.rentalPrice}</Text>
            )}
          </View>
        </View>

        <Text variant="titleMedium" style={styles.sectionTitle}>Hasat Ayı</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.monthScroll}>
          <View style={styles.monthList}>
            {HARVEST_MONTHS.map((month) => (
              <Chip
                key={month.value}
                selected={form.harvestMonth === month.value}
                onPress={() => setForm((prev) => ({ ...prev, harvestMonth: month.value }))}
                style={styles.monthChip}
              >
                {month.label}
              </Chip>
            ))}
          </View>
        </ScrollView>

        <TextInput
          label="Açıklama"
          value={form.description}
          onChangeText={(text) => setForm((prev) => ({ ...prev, description: text }))}
          mode="outlined"
          multiline
          numberOfLines={4}
          style={[styles.input, styles.textArea]}
        />

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
          Ağaç Ekle
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
  segmentedButtons: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  halfInput: {
    flex: 1,
  },
  gardenList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  gardenChip: {
    marginBottom: 8,
  },
  monthScroll: {
    marginBottom: 16,
  },
  monthList: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  monthChip: {
    minWidth: 80,
  },
  textArea: {
    marginTop: 8,
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