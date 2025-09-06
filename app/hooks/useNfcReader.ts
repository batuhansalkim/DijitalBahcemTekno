import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { ensureNfcStarted, isNfcEnabled, openNfcSettings, readUidWithRetry } from '../services/nfcService';

type NfcState = 'idle' | 'checking' | 'need-settings' | 'reading' | 'success' | 'error';

interface UseNfcReaderReturn {
  state: NfcState;
  uid: string;
  error: string;
  retryCount: number;
  showTutorial: boolean;
  showSuccess: boolean;
  read: () => Promise<void>;
  goSettings: () => Promise<void>;
  check: () => Promise<void>;
  showTutorialModal: () => void;
  hideTutorialModal: () => void;
  hideSuccessModal: () => void;
  resetButtonState: () => void;
}

/**
 * NFC Reader Hook - RFID UID okuma için React hook
 * Mevcut trees/add.tsx'teki NFC implementasyonunu hook'a taşıdık
 */
export function useNfcReader(): UseNfcReaderReturn {
  const [state, setState] = useState<NfcState>('checking');
  const [uid, setUid] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [retryCount, setRetryCount] = useState<number>(0);
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const readingRef = useRef(false);

  // NFC Manager'ı başlat
  useEffect(() => {
    ensureNfcStarted();
  }, []);

  // NFC durumunu kontrol et
  const check = useCallback(async () => {
    setState('checking');
    const enabled = await isNfcEnabled();
    setState(enabled ? 'idle' : 'need-settings');
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  // NFC ayarlarına git
  const goSettings = useCallback(async () => {
    await openNfcSettings();
  }, []);

  // Tutorial modal'ı göster
  const showTutorialModal = useCallback(() => {
    setShowTutorial(true);
  }, []);

  // Tutorial modal'ı gizle
  const hideTutorialModal = useCallback(() => {
    setShowTutorial(false);
  }, []);

  // Success modal'ı gizle
  const hideSuccessModal = useCallback(() => {
    setShowSuccess(false);
  }, []);

  // Button state'ini sıfırla
  const resetButtonState = useCallback(() => {
    // Bu fonksiyon tutorial modal'dan çağrılacak
  }, []);

  // RFID UID okuma fonksiyonu
  const read = useCallback(async () => {
    if (readingRef.current) return;
    
    setError('');
    setUid('');
    setState('reading');
    setRetryCount(0);
    readingRef.current = true;
    
    try {
      // Önce NFC'nin açık olup olmadığını kontrol et
      const isEnabled = await isNfcEnabled();
      if (!isEnabled) {
        setState('need-settings');
        readingRef.current = false;
        
        Alert.alert(
          'NFC Kapalı',
          'NFC özelliği kapalı. NFC\'yi açmak için ayarlara gitmek ister misiniz?',
          [
            { text: 'İptal', style: 'cancel' },
            { text: 'Ayarlara Git', onPress: goSettings }
          ]
        );
        return;
      }
      
      const value = await readUidWithRetry(3);
      setUid(value);
      setState('success');
      
      // Console'da UID detaylarını göster
      console.log('🔍 RFID UID Okuma Detayları:');
      console.log('📱 UID:', value);
      console.log('📏 Uzunluk:', value.length, 'karakter');
      console.log('📅 Okuma Zamanı:', new Date().toLocaleString('tr-TR'));
      
      // Tutorial modal'ı kapat ve success modal'ı göster
      setShowTutorial(false);
      setShowSuccess(true);
    } catch (e: any) {
      const msg = String(e?.message || e);
      let uiMsg = 'Okuma başarısız. Tekrar deneyin.';
      
      if (msg.includes('NFC_DISABLED')) {
        setState('need-settings');
        readingRef.current = false;
        
        Alert.alert(
          'NFC Kapalı',
          'NFC özelliği kapalı. NFC\'yi açmak için ayarlara gitmek ister misiniz?',
          [
            { text: 'İptal', style: 'cancel' },
            { text: 'Ayarlara Git', onPress: goSettings }
          ]
        );
        return;
      }
      
      if (msg.includes('Tag was lost') || msg.includes('TAG_LOST')) {
        uiMsg = 'Kart uzaklaştı. Kartı telefonun arka antenine sabit tutun ve tekrar deneyin.';
      } else if (msg.includes('Timed out') || msg.includes('TIMEOUT')) {
        uiMsg = 'Zaman aşımı. Kartı 2-3 saniye sabit tutun ve tekrar deneyin.';
      } else if (msg.includes('TECH_UNAVAILABLE')) {
        uiMsg = 'Bu kart türü desteklenmiyor. Farklı bir RFID kart deneyin.';
      } else if (msg.includes('MAX_RETRIES_EXCEEDED')) {
        uiMsg = '3 deneme sonunda okuma başarısız. Kartı kontrol edin ve tekrar deneyin.';
      } else if (msg.includes('NO_UID')) {
        uiMsg = 'UID okunamadı. Kartı kontrol edin ve tekrar deneyin.';
      }
      
      setError(uiMsg);
      setState('error');
      
      // Mevcut Alert.alert'i koru
      Alert.alert(
        'NFC Okuma Hatası',
        uiMsg,
        [{ text: 'Tamam' }]
      );
    } finally {
      readingRef.current = false;
    }
  }, [goSettings]);

  return {
    state,
    uid,
    error,
    retryCount,
    showTutorial,
    showSuccess,
    read,
    goSettings,
    check,
    showTutorialModal,
    hideTutorialModal,
    hideSuccessModal,
    resetButtonState,
  };
}
