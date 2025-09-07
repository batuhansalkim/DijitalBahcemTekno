import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import PinataService, { TreeDataPackage } from '../services/pinataService';

// Hook return type
interface UseTreeUploadReturn {
  // States
  isUploading: boolean;
  uploadProgress: number;
  lastUploadedCid: string | null;
  error: string | null;
  
  // Functions
  uploadTreeData: (treeData: TreeDataPackage) => Promise<string>;
  processOfflineQueue: () => Promise<void>;
  testConnection: () => Promise<boolean>;
  clearError: () => void;
}

// Custom hook for tree upload functionality
export const useTreeUpload = (): UseTreeUploadReturn => {
  // State management
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [lastUploadedCid, setLastUploadedCid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Upload tree data to Pinata IPFS
  const uploadTreeData = useCallback(async (treeData: TreeDataPackage): Promise<string> => {
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);
    
    try {
      console.log('🚀 Ağaç verisi yükleme başlatılıyor...');
      
      // Progress simulation - 25%
      setUploadProgress(25);
      
      // Validate tree data
      if (!treeData.tree_info?.rfid_uid || !treeData.tree_info?.tree_id) {
        throw new Error('Ağaç bilgileri eksik! RFID UID ve Tree ID gerekli.');
      }
      
      if (!treeData.location?.lat || !treeData.location?.lon) {
        throw new Error('Konum bilgileri eksik! Enlem ve boylam gerekli.');
      }
      
      // Progress simulation - 50%
      setUploadProgress(50);
      
      // Upload to Pinata
      const cid = await PinataService.uploadTreeData(treeData);
      
      // Progress simulation - 75%
      setUploadProgress(75);
      
      // Success
      setLastUploadedCid(cid);
      setUploadProgress(100);
      
      console.log('✅ Ağaç verisi başarıyla yüklendi! CID:', cid);
      
      // Show success message
      Alert.alert(
        'Başarılı! 🎉',
        `Ağaç verisi IPFS'e yüklendi!\n\nCID: ${cid}\n\nBu CID'yi blokzincir kontratında kullanabilirsiniz.`,
        [{ text: 'Tamam' }]
      );
      
      return cid;
      
    } catch (error: any) {
      console.error('❌ Upload failed:', error);
      setError(error.message || 'Bilinmeyen hata oluştu');
      
      // Show error message
      Alert.alert(
        'Hata! ❌',
        `Ağaç verisi yüklenemedi.\n\nHata: ${error.message || 'Bilinmeyen hata'}\n\nVeri offline kuyruğa eklendi ve internet bağlantısı kurulduğunda otomatik yüklenecek.`,
        [{ text: 'Tamam' }]
      );
      
      throw error;
    } finally {
      setIsUploading(false);
      // Reset progress after 2 seconds
      setTimeout(() => setUploadProgress(0), 2000);
    }
  }, []);

  // Process offline queue
  const processOfflineQueue = useCallback(async (): Promise<void> => {
    try {
      console.log('📶 Offline kuyruk işleniyor...');
      await PinataService.processOfflineQueue();
      
      Alert.alert(
        'Senkronizasyon Tamamlandı! ✅',
        'Offline kuyruktaki tüm veriler başarıyla yüklendi.',
        [{ text: 'Tamam' }]
      );
      
    } catch (error: any) {
      console.error('❌ Offline queue processing failed:', error);
      
      Alert.alert(
        'Senkronizasyon Hatası! ⚠️',
        `Offline kuyruk işlenirken hata oluştu.\n\nHata: ${error.message || 'Bilinmeyen hata'}`,
        [{ text: 'Tamam' }]
      );
    }
  }, []);

  // Test Pinata connection
  const testConnection = useCallback(async (): Promise<boolean> => {
    try {
      console.log('🧪 Pinata bağlantı testi yapılıyor...');
      const isConnected = await PinataService.testConnection();
      
      if (isConnected) {
        Alert.alert(
          'Bağlantı Testi Başarılı! ✅',
          'Pinata IPFS servisine başarıyla bağlanıldı.',
          [{ text: 'Tamam' }]
        );
      } else {
        Alert.alert(
          'Bağlantı Testi Başarısız! ❌',
          'Pinata IPFS servisine bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.',
          [{ text: 'Tamam' }]
        );
      }
      
      return isConnected;
    } catch (error: any) {
      console.error('❌ Connection test failed:', error);
      
      Alert.alert(
        'Bağlantı Testi Hatası! ⚠️',
        `Bağlantı testi sırasında hata oluştu.\n\nHata: ${error.message || 'Bilinmeyen hata'}`,
        [{ text: 'Tamam' }]
      );
      
      return false;
    }
  }, []);

  return {
    // States
    isUploading,
    uploadProgress,
    lastUploadedCid,
    error,
    
    // Functions
    uploadTreeData,
    processOfflineQueue,
    testConnection,
    clearError
  };
};
