import NfcManager, { NfcTech } from 'react-native-nfc-manager';

/**
 * NFC Service - RFID UID okuma için low-level API sarmalayıcısı
 * Mevcut trees/add.tsx'teki readNFC fonksiyonunu service'e taşıdık
 */

export async function ensureNfcStarted(): Promise<void> {
  try {
    await NfcManager.start();
  } catch (error) {
    console.log('NFC Manager başlatma hatası:', error);
  }
}

export async function isNfcEnabled(): Promise<boolean> {
  try {
    return await NfcManager.isEnabled();
  } catch (error) {
    console.log('NFC enabled kontrol hatası:', error);
    return false;
  }
}

export async function openNfcSettings(): Promise<void> {
  try {
    await NfcManager.goToNfcSetting();
  } catch (error) {
    console.log('NFC ayarları açma hatası:', error);
  }
}

/**
 * RFID UID okuma fonksiyonu - retry mekanizması ile
 * @param maxRetries Maksimum deneme sayısı (varsayılan: 3)
 * @returns Promise<string> - UID hex formatında
 */
export async function readUidWithRetry(maxRetries: number = 3): Promise<string> {
  // NFC Manager'ı başlat
  await ensureNfcStarted();
  
  // NFC'nin açık olup olmadığını kontrol et
  const isEnabled = await isNfcEnabled();
  if (!isEnabled) {
    throw new Error('NFC_DISABLED');
  }

  // Retry mekanizması ile NFC okuma
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Mevcut kodunuzun Ndef → NfcA fallback stratejisi
      let tag = null;
      
      try {
        // Önce Ndef teknolojisini dene
        await NfcManager.requestTechnology(NfcTech.Ndef, {
          alertMessage: 'Etiketi yaklaştırın',
          timeout: 10000, // 10 saniye timeout
        });
        tag = await NfcManager.getTag();
      } catch (ndefError) {
        try {
          // Ndef başarısız olursa NfcA teknolojisini dene
          await NfcManager.requestTechnology(NfcTech.NfcA, {
            alertMessage: 'Etiketi yaklaştırın',
            timeout: 10000, // 10 saniye timeout
          });
          tag = await NfcManager.getTag();
        } catch (nfcaError) {
          throw new Error('TECH_UNAVAILABLE');
        }
      }
      
      if (tag && tag.id) {
        // Debug: Ham tag verisini göster
        console.log('🏷️ Ham Tag Verisi:', tag);
        console.log('🆔 Tag ID:', tag.id);
        console.log('📊 ID Tipi:', Array.isArray(tag.id) ? 'Array' : typeof tag.id);
        
        // Mevcut UID formatlayıcı kodunuz
        if (Array.isArray(tag.id)) {
          // Byte array formatında
          console.log('📦 Byte Array:', tag.id);
          const hexArray = tag.id.map(byte => byte.toString(16).padStart(2, '0').toUpperCase());
          const formattedUid = hexArray.join(':');
          console.log('🔤 Formatlanmış UID:', formattedUid);
          return formattedUid;
        } else {
          // String formatında
          const formattedUid = tag.id.toString().toUpperCase();
          console.log('🔤 Formatlanmış UID:', formattedUid);
          return formattedUid;
        }
      } else {
        throw new Error('NO_UID');
      }
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      // 1 saniye bekle ve tekrar dene
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      // NFC teknolojisini serbest bırak
      try {
        await NfcManager.cancelTechnologyRequest();
      } catch (cancelError) {
        console.log('NFC cancel hatası:', cancelError);
      }
    }
  }
  
  throw new Error('MAX_RETRIES_EXCEEDED');
}

/**
 * UID formatlayıcı yardımcı fonksiyon
 * @param bytes Byte array veya Uint8Array
 * @returns Hex formatında UID string
 */
export function bytesToHex(bytes: number[] | Uint8Array = []): string {
  if (!bytes || bytes.length === 0) return '';
  
  return Array.from(bytes, b => {
    const hex = b.toString(16).padStart(2, '0');
    return hex.toUpperCase();
  }).join(':');
}
