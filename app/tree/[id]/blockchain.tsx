import React from 'react';
import { View, StyleSheet, ScrollView, Image, Dimensions, Linking } from 'react-native';
import { Text, Surface, Button, Divider, IconButton, Chip } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const windowWidth = Dimensions.get('window').width;

export default function BlockchainScreen() {
  const { id } = useLocalSearchParams();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={28}
          onPress={() => router.back()}
          iconColor="#fff"
        />
        <Text style={styles.headerTitle}>Blokzincir & Ürün Bilgisi</Text>
        <View style={{ width: 56 }} />
      </View>

      {/* NFT Bilgileri */}
      <Surface style={styles.card} elevation={3}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="nfc" size={32} color="#2D6A4F" />
          <Text style={styles.cardTitle}>NFT & Blokzincir Bilgileri</Text>
        </View>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>NFT ID</Text>
            <Text style={styles.infoValue}>#1234567890abcdef</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Token Standardı</Text>
            <Text style={styles.infoValue}>ERC-721</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Sahip Adresi</Text>
            <Text style={styles.infoValue}>0xA1B2...C3D4</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Son İşlem</Text>
            <Text style={styles.infoValue}>2024-05-01 14:32</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>İşlem Hash</Text>
            <Text style={styles.infoValue}>0xF1E2...B3C4</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Blok Numarası</Text>
            <Text style={styles.infoValue}>#18,245,632</Text>
          </View>
        </View>
      </Surface>

      {/* RFID Bilgileri */}
      <Surface style={styles.card} elevation={3}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="credit-card-wireless" size={32} color="#2D6A4F" />
          <Text style={styles.cardTitle}>RFID Takip Bilgileri</Text>
        </View>
        <View style={styles.rfidInfo}>
          <View style={styles.rfidItem}>
            <Text style={styles.rfidLabel}>RFID Tag ID</Text>
            <Text style={styles.rfidValue}>TAG-2024-001</Text>
          </View>
          <View style={styles.rfidItem}>
            <Text style={styles.rfidLabel}>Son Okuma</Text>
            <Text style={styles.rfidValue}>2024-05-01 15:45</Text>
          </View>
          <View style={styles.rfidItem}>
            <Text style={styles.rfidLabel}>Konum</Text>
            <Text style={styles.rfidValue}>Bahçe A, Sıra 3, Ağaç 12</Text>
          </View>
          <View style={styles.rfidItem}>
            <Text style={styles.rfidLabel}>Durum</Text>
            <Chip style={styles.statusChip} textStyle={styles.statusText}>
              Aktif
            </Chip>
          </View>
        </View>
      </Surface>

      {/* Ürün Yolculuğu */}
      <Surface style={styles.card} elevation={3}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="map-marker-path" size={32} color="#2D6A4F" />
          <Text style={styles.cardTitle}>Ürün Yolculuğu</Text>
        </View>
        <View style={styles.journeyContainer}>
          <View style={styles.journeySteps}>
            <View style={styles.journeyStep}>
              <MaterialCommunityIcons name="check-circle" size={28} color="#2D6A4F" />
              <View style={styles.journeyStepContent}>
                <Text style={styles.journeyStepText}>Hasat Edildi</Text>
                <Text style={styles.journeyStepDate}>01.11.2024 - 14:30</Text>
              </View>
            </View>
            <View style={styles.journeyStep}>
              <MaterialCommunityIcons name="check-circle" size={28} color="#2D6A4F" />
              <View style={styles.journeyStepContent}>
                <Text style={styles.journeyStepText}>İşlendi</Text>
                <Text style={styles.journeyStepDate}>02.11.2024 - 09:15</Text>
              </View>
            </View>
            <View style={styles.journeyStep}>
              <MaterialCommunityIcons name="check-circle" size={28} color="#2D6A4F" />
              <View style={styles.journeyStepContent}>
                <Text style={styles.journeyStepText}>Paketlendi</Text>
                <Text style={styles.journeyStepDate}>03.11.2024 - 16:45</Text>
              </View>
            </View>
            <View style={styles.journeyStep}>
              <MaterialCommunityIcons name="truck" size={28} color="#666" />
              <View style={styles.journeyStepContent}>
                <Text style={styles.journeyStepText}>Sevk Edildi</Text>
                <Text style={styles.journeyStepDate}>04.11.2024 - 11:20</Text>
              </View>
            </View>
            <View style={styles.journeyStep}>
              <MaterialCommunityIcons name="clock-outline" size={28} color="#666" />
              <View style={styles.journeyStepContent}>
                <Text style={styles.journeyStepText}>Teslim Edilecek</Text>
                <Text style={styles.journeyStepDate}>10.11.2024 - Tahmini</Text>
              </View>
            </View>
          </View>
          <View style={styles.qrContainer}>
            <Image
              source={{ uri: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=1234567890abcdef' }}
              style={styles.qrImage}
            />
            <Text style={styles.qrText}>QR Kod ile Doğrula</Text>
            <Button
              mode="outlined"
              icon="qrcode-scan"
              onPress={() => {}}
              style={styles.scanButton}
            >
              QR Kod Tara
            </Button>
          </View>
        </View>
      </Surface>

      {/* Ürün İşleme & Sevkiyat */}
      <Surface style={styles.card} elevation={3}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="factory" size={32} color="#2D6A4F" />
          <Text style={styles.cardTitle}>Ürün İşleme & Sevkiyat</Text>
        </View>
        <View style={styles.processInfo}>
          <View style={styles.processItem}>
            <Text style={styles.processLabel}>İşleme Türü</Text>
            <Text style={styles.processValue}>Zeytinyağı</Text>
          </View>
          <View style={styles.processItem}>
            <Text style={styles.processLabel}>İşleme Tarihi</Text>
            <Text style={styles.processValue}>2024-05-02</Text>
          </View>
          <View style={styles.processItem}>
            <Text style={styles.processLabel}>Sevkiyat Durumu</Text>
            <Chip style={styles.statusChip} textStyle={styles.statusText}>
              Yolda
            </Chip>
          </View>
          <View style={styles.processItem}>
            <Text style={styles.processLabel}>Tahmini Teslim</Text>
            <Text style={styles.processValue}>2024-05-10</Text>
          </View>
          <View style={styles.processItem}>
            <Text style={styles.processLabel}>Kargo Takip No</Text>
            <Text style={styles.processValue}>TR123456789</Text>
          </View>
        </View>
      </Surface>

      {/* Dijital Cüzdan Bilgileri */}
      <Surface style={styles.card} elevation={3}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="wallet" size={32} color="#2D6A4F" />
          <Text style={styles.cardTitle}>Dijital Cüzdan</Text>
        </View>
        <View style={styles.walletInfo}>
          <View style={styles.walletItem}>
            <Text style={styles.walletLabel}>Bağlı Cüzdan</Text>
            <Text style={styles.walletValue}>MetaMask</Text>
          </View>
          <View style={styles.walletItem}>
            <Text style={styles.walletLabel}>Cüzdan Adresi</Text>
            <Text style={styles.walletValue}>0x1234...5678</Text>
          </View>
          <View style={styles.walletItem}>
            <Text style={styles.walletLabel}>Ödeme Yöntemi</Text>
            <Text style={styles.walletValue}>Kripto Para (%30 İndirim)</Text>
          </View>
          <View style={styles.walletItem}>
            <Text style={styles.walletLabel}>Bakiye</Text>
            <Text style={styles.walletValue}>1,250 DBC</Text>
          </View>
        </View>
      </Surface>

      {/* Alt Bilgi */}
      <View style={styles.bottomInfo}>
        <Text style={styles.bottomInfoText}>
          Tüm işlemler blokzincir üzerinde şeffaf bir şekilde kayıt altına alınmaktadır.
        </Text>
        <View style={styles.explorerButtons}>
          <Button
            mode="contained"
            icon="eye"
            onPress={() => {
              // NFT işlem detaylarını aç
              const explorerUrl = `https://etherscan.io/tx/0xF1E2...B3C4`;
              Linking.openURL(explorerUrl).catch(err => 
                console.error('URL açılamadı:', err)
              );
            }}
            style={styles.viewButton}
          >
            NFT İşlem Detayları
          </Button>
          <Button
            mode="outlined"
            icon="account"
            onPress={() => {
              // Sahip adresini aç
              const addressUrl = `https://etherscan.io/address/0xA1B2...C3D4`;
              Linking.openURL(addressUrl).catch(err => 
                console.error('URL açılamadı:', err)
              );
            }}
            style={styles.addressButton}
          >
            Sahip Adresi
          </Button>
        </View>
        <View style={styles.explorerInfo}>
          <MaterialCommunityIcons name="information" size={20} color="#666" />
          <Text style={styles.explorerInfoText}>
            Blokzincir Explorer'da işlemlerinizi gerçek zamanlı olarak takip edebilirsiniz.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F3',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#2D6A4F',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  card: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#fff',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8F5E9',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1B4332',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  infoItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8F5E9',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B4332',
  },
  rfidInfo: {
    gap: 12,
  },
  rfidItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
  },
  rfidLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  rfidValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B4332',
  },
  journeyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  journeySteps: {
    flex: 1,
    gap: 16,
  },
  journeyStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  journeyStepContent: {
    flex: 1,
  },
  journeyStepText: {
    fontSize: 16,
    color: '#1B4332',
    fontWeight: '500',
  },
  journeyStepDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  qrContainer: {
    alignItems: 'center',
    marginLeft: 20,
  },
  qrImage: {
    width: 150,
    height: 150,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E8F5E9',
  },
  qrText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  scanButton: {
    marginTop: 12,
    borderColor: '#2D6A4F',
  },
  processInfo: {
    gap: 12,
  },
  processItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
  },
  processLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  processValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B4332',
  },
  walletInfo: {
    gap: 12,
  },
  walletItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
  },
  walletLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  walletValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B4332',
  },
  statusChip: {
    backgroundColor: '#E8F5E9',
  },
  statusText: {
    color: '#2D6A4F',
    fontWeight: '600',
  },
  bottomInfo: {
    padding: 20,
    alignItems: 'center',
  },
  bottomInfoText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
  },
  explorerButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  viewButton: {
    backgroundColor: '#2D6A4F',
    
    flex: 1,
  },
  addressButton: {
    
    borderColor: '#2D6A4F',
    flex: 1,
  },
  explorerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
  },
  explorerInfoText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    lineHeight: 20,
  },
}); 