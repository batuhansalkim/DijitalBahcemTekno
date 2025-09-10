import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Linking } from 'react-native';
import { ensureNfcStarted, isNfcEnabled, openNfcSettings, readUidWithRetry } from '../_services/nfcService';
import { captureTreeLocation, GpsFix, checkLocationPermissions, requestLocationPermission, openLocationSettings } from '../_services/locationService';

type NfcState = 'idle' | 'checking' | 'need-settings' | 'reading' | 'success' | 'error';

interface UseNfcReaderReturn {
  state: NfcState;
  uid: string;
  error: string;
  retryCount: number;
  showTutorial: boolean;
  showSuccess: boolean;
  location: GpsFix | null;
  read: () => Promise<void>;
  readWithLocation: () => Promise<void>;
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
  const successAutoHideRef = useRef<NodeJS.Timeout | null>(null);
  const [location, setLocation] = useState<GpsFix | null>(null);
  const readingRef = useRef(false);

  // NFC Manager'ı başlat
  useEffect(() => {
    ensureNfcStarted();
    return () => {
      if (successAutoHideRef.current) {
        clearTimeout(successAutoHideRef.current);
        successAutoHideRef.current = null;
      }
    };
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
      
      // Tutorial modal'ı kapat; başarı modalı gösterme
      setShowTutorial(false);
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

  // NFC + Konum entegrasyonu için yeni fonksiyon
  const readWithLocation = useCallback(async () => {
    if (readingRef.current) return;
    
    setError('');
    setUid('');
    setLocation(null);
    setState('reading');
    setRetryCount(0);
    readingRef.current = true;
    
    try {
      // Önce NFC'nin açık olup olmadığını kontrol et
      const isEnabled = await isNfcEnabled();
      if (!isEnabled) {
        setState('need-settings');
        readingRef.current = false;
        await openNfcSettings();
        return; // NFC açılmadan okumayı başlatma
      }
      
      // Konum izinlerini kontrol et ve gerekiyorsa iste
      const locationPermission = await checkLocationPermissions();
      if (!locationPermission.granted) {
        if (locationPermission.canAskAgain) {
          const grantedNow = await requestLocationPermission();
          if (!grantedNow) {
            setState('error');
            readingRef.current = false;
            await openLocationSettings();
            return; // Konum izni verilmeden okumayı başlatma
          }
        } else {
          setState('error');
          readingRef.current = false;
          await openLocationSettings();
          return; // Kullanıcı tekrar sorulamıyorsa doğrudan ayarlara yönlendir
        }
      }
      
      // RFID UID okuma
      const value = await readUidWithRetry(3);
      setUid(value);
      
      // Konum alma
      const gpsFix = await captureTreeLocation();
      setLocation(gpsFix);
      
      setState('success');
      
      // Console'da detayları göster
      console.log('🔍 RFID + Konum Okuma Detayları:');
      console.log('📱 UID:', value);
      console.log('📍 Konum:', gpsFix.lat, gpsFix.lon);
      console.log('📏 Doğruluk:', gpsFix.accuracy_m, 'm');
      console.log('📅 Okuma Zamanı:', new Date().toLocaleString('tr-TR'));
      
      // Tutorial modal'ı kapat; başarı modalı gösterme
      setShowTutorial(false);
      
      // Başarı mesajı gösterme kaldırıldı (UI üzerindeki modal yeterli)
    } catch (e: any) {
      const msg = String(e?.message || e);
      let uiMsg = 'Okuma başarısız. Tekrar deneyin.';
      
      if (msg.includes('NFC_DISABLED')) { 
        setState('need-settings'); 
        readingRef.current = false; 
        return; 
      }
      if (msg.includes('Konum izni')) {
        uiMsg = 'Konum izni verilmedi. Lütfen ayarlardan konum iznini açın.';
      }
      if (msg.includes('Konum alınamadı')) {
        uiMsg = 'Konum alınamadı. GPS sinyalini kontrol edin.';
      }
      if (msg.includes('Tag was lost') || msg.includes('TAG_LOST')) {
        uiMsg = 'Kart uzaklaştı. Kartı telefonun arka antenine sabit tutun.';
      }
      if (msg.includes('Timed out') || msg.includes('TIMEOUT')) {
        uiMsg = 'Zaman aşımı. Kartı 2-3 saniye sabit tutun.';
      }
      if (msg.includes('TECH_UNAVAILABLE')) {
        uiMsg = 'Bu kart türü desteklenmiyor. Farklı bir RFID kart deneyin.';
      }
      if (msg.includes('MAX_RETRIES_EXCEEDED')) {
        uiMsg = '3 deneme sonunda okuma başarısız. Kartı kontrol edin.';
      }
      
      setError(uiMsg);
      setState('error');
      
      Alert.alert(
        'Okuma Hatası',
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
    location,
    read,
    readWithLocation,
    goSettings,
    check,
    showTutorialModal,
    hideTutorialModal,
    hideSuccessModal,
    resetButtonState,
  };
}
