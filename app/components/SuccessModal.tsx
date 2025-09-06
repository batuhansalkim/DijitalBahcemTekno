import React, { useEffect } from 'react';
import { View, StyleSheet, Modal, Dimensions, Animated } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface SuccessModalProps {
  visible: boolean;
  uid: string;
  onClose: () => void;
}

const { width, height } = Dimensions.get('window');

export function SuccessModal({ visible, uid, onClose }: SuccessModalProps) {
  const scaleAnim = new Animated.Value(0);
  const opacityAnim = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      // Animasyon başlat
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // 3 saniye sonra otomatik kapat
      const timer = setTimeout(() => {
        handleClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={handleClose}
    >
      <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
        <Animated.View style={[styles.modal, { transform: [{ scale: scaleAnim }] }]}>
          <Surface style={styles.successCard}>
            {/* Başarı İkonu */}
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons 
                name="check-circle" 
                size={80} 
                color="#4CAF50" 
              />
            </View>
            
            {/* Başarı Mesajı */}
            <Text style={styles.successTitle}>RFID Okuma Başarılı!</Text>
            
            {/* UID Bilgisi */}
            <View style={styles.uidContainer}>
              <Text style={styles.uidLabel}>UID:</Text>
              <Text style={styles.uidValue}>{uid}</Text>
            </View>
            
            {/* Alt Mesaj */}
            <Text style={styles.successMessage}>
              UID otomatik olarak forma eklendi
            </Text>
            
            {/* Kapatma Butonu */}
            <View style={styles.closeButtonContainer}>
              <MaterialCommunityIcons 
                name="close-circle-outline" 
                size={24} 
                color="#666" 
                onPress={handleClose}
              />
            </View>
          </Surface>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: width * 0.85,
    maxWidth: 350,
  },
  successCard: {
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  iconContainer: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 20,
    textAlign: 'center',
  },
  uidContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  uidLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  uidValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B4332',
    fontFamily: 'monospace',
  },
  successMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
});
