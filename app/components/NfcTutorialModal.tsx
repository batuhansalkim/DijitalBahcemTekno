import React, { useState } from 'react';
import { View, StyleSheet, Modal, Dimensions, TouchableOpacity } from 'react-native';
import { Text, Surface, Card, Title, Paragraph, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface NfcTutorialModalProps {
  visible: boolean;
  onClose: () => void;
  onStartReading: () => void;
  isReading: boolean;
}

const { width, height } = Dimensions.get('window');

export function NfcTutorialModal({ visible, onClose, onStartReading, isReading }: NfcTutorialModalProps) {
  const handleStartReading = () => {
    onStartReading();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Surface style={styles.modal}>
          <View style={styles.header}>
            <Title style={styles.title}>RFID Okuma Nasıl Yapılır?</Title>
            <IconButton
              icon="close"
              size={24}
              onPress={onClose}
              style={styles.closeButton}
            />
          </View>
          
          <Card style={styles.tutorialCard}>
            <Card.Content>
              <View style={styles.stepContainer}>
                <View style={styles.stepIcon}>
                  <MaterialCommunityIcons name="tree" size={40} color="#2E7D32" />
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>1. Ağacın Üstündeki RFID Etiketini Bulun</Text>
                  <Paragraph style={styles.stepDescription}>
                    Ağacın gövdesine yapıştırılmış küçük RFID etiketini bulun.
                  </Paragraph>
                </View>
              </View>
              
              <View style={styles.stepContainer}>
                <View style={styles.stepIcon}>
                  <MaterialCommunityIcons name="cellphone" size={40} color="#1976D2" />
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>2. Telefonun Arka Kısmına Yaklaştırın</Text>
                  <Paragraph style={styles.stepDescription}>
                    RFID etiketini telefonun arka antenine (genellikle üst kısım) yaklaştırın.
                  </Paragraph>
                </View>
              </View>
              
              <View style={styles.stepContainer}>
                <View style={styles.stepIcon}>
                  <MaterialCommunityIcons name="hand-okay" size={40} color="#FF9800" />
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>3. Sabit Tutun</Text>
                  <Paragraph style={styles.stepDescription}>
                    Etiketi 2-3 saniye sabit tutun. Okuma işlemi otomatik başlayacak.
                  </Paragraph>
                </View>
              </View>
            </Card.Content>
          </Card>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handleStartReading}
              disabled={isReading}
              style={[
                styles.startButton,
                isReading && styles.startButtonPressed,
                { backgroundColor: isReading ? "#1B5E20" : "#2E7D32" }
              ]}
            >
              <View style={styles.buttonContent}>
                <MaterialCommunityIcons 
                  name="nfc" 
                  size={20} 
                  color="#fff" 
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>
                  {isReading ? "Okuma Başlatılıyor..." : "RFID Okumaya Başla"}
                </Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={onClose}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>İptal</Text>
            </TouchableOpacity>
          </View>
        </Surface>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    borderRadius: 16,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    flex: 1,
  },
  closeButton: {
    margin: 0,
  },
  tutorialCard: {
    marginBottom: 20,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  stepIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  buttonContainer: {
    gap: 10,
  },
  startButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
    marginBottom: 10,
  },
  startButtonPressed: {
    elevation: 8,
    transform: [{ scale: 0.98 }],
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
});
