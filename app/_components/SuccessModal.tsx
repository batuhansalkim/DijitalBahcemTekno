import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Modal, Dimensions, Animated } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface SuccessModalProps {
  visible: boolean;
  uid?: string;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  showUid?: boolean;
  durationMs?: number;
  iconName?: keyof typeof MaterialCommunityIcons.glyphMap;
}

const { width, height } = Dimensions.get('window');

export function SuccessModal({ visible, uid = '', onClose, title = 'İşlem Başarılı', subtitle, showUid = false, durationMs = 2500, iconName = 'check-circle' }: SuccessModalProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
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

      const timer = setTimeout(() => {
        handleClose();
      }, durationMs);

      return () => clearTimeout(timer);
    }
  }, [visible, durationMs, handleClose]);

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
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons 
                name={iconName}
                size={80} 
                color="#4CAF50" 
              />
            </View>
            <Text style={styles.successTitle}>{title}</Text>
            {subtitle ? (
              <Text style={styles.successMessage}>{subtitle}</Text>
            ) : null}
            {showUid ? (
              <View style={styles.uidContainer}>
                <Text style={styles.uidLabel}>UID</Text>
                <Text style={styles.uidValue}>{uid}</Text>
              </View>
            ) : null}
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
    backgroundColor: '#fff',
  },
  iconContainer: {
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 12,
  },
  uidContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    width: '100%',
    alignItems: 'center',
  },
  uidLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  uidValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B4332',
    fontFamily: 'monospace',
  },
});
