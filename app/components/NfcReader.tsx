import React, { useEffect } from 'react';
import { Button } from 'react-native-paper';
import { useNfcReader } from '../hooks/useNfcReader';

interface NfcReaderProps {
  onUidRead: (uid: string) => void;
  buttonText?: string;
  style?: any;
  disabled?: boolean;
}

/**
 * Reusable NFC Reader Component
 * RFID UID okuma için kullanılabilir component
 */
export function NfcReader({ 
  onUidRead, 
  buttonText = 'NFC Oku', 
  style,
  disabled = false 
}: NfcReaderProps) {
  const { state, uid, read } = useNfcReader();
  
  // UID okunduğunda callback'i çağır
  useEffect(() => {
    if (uid) {
      onUidRead(uid);
    }
  }, [uid, onUidRead]);

  return (
    <Button
      mode="outlined"
      onPress={read}
      loading={state === 'reading'}
      disabled={disabled || state === 'reading'}
      style={style}
      buttonColor="#2E7D32"
      textColor="#fff"
      icon="nfc"
      labelStyle={{ fontSize: 12 }}
    >
      {state === 'reading' ? 'Okunuyor...' : buttonText}
    </Button>
  );
}
