import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Card, Text, ActivityIndicator, Chip } from 'react-native-paper';
import { walletService, WalletState } from '../lib/wallet';

interface WalletConnectProps {
  onWalletConnected?: (walletState: WalletState) => void;
  onWalletDisconnected?: () => void;
}

export default function WalletConnect({ 
  onWalletConnected, 
  onWalletDisconnected 
}: WalletConnectProps) {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: null,
    network: null,
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Başlangıçta cüzdan durumunu kontrol et
  useEffect(() => {
    checkWalletState();
  }, []);

  const checkWalletState = async () => {
    try {
      setIsLoading(true);
      const state = await walletService.getWalletState();
      setWalletState(state);
      
      if (state.isConnected && onWalletConnected) {
        onWalletConnected(state);
      }
    } catch (error) {
      console.error('Cüzdan durumu kontrol hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectMetaMask = async () => {
    try {
      setIsConnecting(true);
      
      const state = await walletService.connectMetaMask();
      setWalletState(state);
      
      if (onWalletConnected) {
        onWalletConnected(state);
      }

      Alert.alert(
        'Bağlantı Başarılı!',
        `Cüzdan bağlandı\nAdres: ${state.address?.substring(0, 10)}...${state.address?.substring(38)}\nBakiye: ${state.balance} ETH`
      );

    } catch (error: any) {
      console.error('MetaMask bağlantı hatası:', error);
      
      let errorMessage = 'Bilinmeyen hata oluştu';
      
      if (error.message.includes('User rejected')) {
        errorMessage = 'Bağlantı kullanıcı tarafından reddedildi';
      } else if (error.message.includes('MetaMask bulunamadı')) {
        errorMessage = 'MetaMask yüklü değil. Lütfen MetaMask uygulamasını yükleyin.';
      } else if (error.message.includes('Wrong network')) {
        errorMessage = 'Yanlış ağ. Lütfen Sepolia test ağına geçin.';
      }

      Alert.alert('Bağlantı Hatası', errorMessage);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleConnectWalletConnect = async () => {
    try {
      setIsConnecting(true);
      
      // WalletConnect implementasyonu (şimdilik placeholder)
      Alert.alert(
        'WalletConnect',
        'WalletConnect entegrasyonu henüz tamamlanmadı. Lütfen MetaMask kullanın.'
      );

    } catch (error) {
      console.error('WalletConnect hatası:', error);
      Alert.alert('Bağlantı Hatası', 'WalletConnect bağlantısı başarısız');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await walletService.disconnect();
      setWalletState({
        isConnected: false,
        address: null,
        balance: null,
        network: null,
      });

      if (onWalletDisconnected) {
        onWalletDisconnected();
      }

      Alert.alert('Bağlantı Kesildi', 'Cüzdan bağlantısı başarıyla kesildi');

    } catch (error) {
      console.error('Bağlantı kesme hatası:', error);
      Alert.alert('Hata', 'Bağlantı kesilirken hata oluştu');
    }
  };

  const refreshBalance = async () => {
    if (!walletState.address) return;

    try {
      setIsLoading(true);
      const balance = await walletService.checkBalance(walletState.address);
      setWalletState(prev => ({ ...prev, balance }));
    } catch (error) {
      console.error('Bakiye yenileme hatası:', error);
      Alert.alert('Hata', 'Bakiye yenilenemedi');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card style={styles.card}>
        <Card.Content style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text style={styles.loadingText}>Cüzdan durumu kontrol ediliyor...</Text>
        </Card.Content>
      </Card>
    );
  }

  if (walletState.isConnected) {
    return (
      <Card style={styles.connectedCard}>
        <Card.Content>
          <View style={styles.connectedHeader}>
            <Text style={styles.connectedTitle}>Cüzdan Bağlı</Text>
            <Chip 
              icon="check-circle" 
              style={styles.statusChip}
              textStyle={styles.statusChipText}
            >
              Aktif
            </Chip>
          </View>

          <View style={styles.walletInfo}>
            <Text style={styles.addressLabel}>Adres:</Text>
            <Text style={styles.addressValue}>
              {walletState.address?.substring(0, 10)}...{walletState.address?.substring(38)}
            </Text>
          </View>

          <View style={styles.walletInfo}>
            <Text style={styles.balanceLabel}>Bakiye:</Text>
            <View style={styles.balanceContainer}>
              <Text style={styles.balanceValue}>
                {walletState.balance ? `${parseFloat(walletState.balance).toFixed(4)} ETH` : 'Yükleniyor...'}
              </Text>
              <Button 
                mode="outlined" 
                compact 
                onPress={refreshBalance}
                style={styles.refreshButton}
                labelStyle={styles.refreshButtonText}
              >
                Yenile
              </Button>
            </View>
          </View>

          <View style={styles.walletInfo}>
            <Text style={styles.networkLabel}>Ağ:</Text>
            <Chip 
              icon="earth" 
              style={styles.networkChip}
              textStyle={styles.networkChipText}
            >
              {walletState.network === 'sepolia' ? 'Sepolia Testnet' : walletState.network}
            </Chip>
          </View>

          <Button
            mode="outlined"
            onPress={handleDisconnect}
            style={styles.disconnectButton}
            labelStyle={styles.disconnectButtonText}
            icon="logout"
          >
            Bağlantıyı Kes
          </Button>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.title}>Dijital Cüzdan Bağlantısı</Text>
        <Text style={styles.subtitle}>
          Blockchain işlemleri için cüzdanınızı bağlayın
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleConnectMetaMask}
            loading={isConnecting}
            disabled={isConnecting}
            style={styles.connectButton}
            labelStyle={styles.connectButtonText}
            icon="wallet"
          >
            MetaMask ile Bağlan
          </Button>

          <Button
            mode="outlined"
            onPress={handleConnectWalletConnect}
            loading={isConnecting}
            disabled={isConnecting}
            style={styles.walletConnectButton}
            labelStyle={styles.walletConnectButtonText}
            icon="qrcode"
          >
            WalletConnect
          </Button>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            ⚡ Sepolia test ağı kullanılacak{'\n'}
            🔒 Güvenli blockchain bağlantısı{'\n'}
            💰 Test ETH gereklidir
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    borderRadius: 16,
    elevation: 4,
    backgroundColor: '#fff',
  },
  connectedCard: {
    margin: 16,
    borderRadius: 16,
    elevation: 4,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#E8F5E9',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B4332',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  connectedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  connectedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B4332',
  },
  statusChip: {
    backgroundColor: '#E8F5E9',
  },
  statusChipText: {
    color: '#2E7D32',
    fontWeight: '600',
    fontSize: 12,
  },
  walletInfo: {
    marginBottom: 16,
  },
  addressLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  addressValue: {
    fontSize: 16,
    fontFamily: 'monospace',
    color: '#1B4332',
    backgroundColor: '#F5F5F5',
    padding: 8,
    borderRadius: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  refreshButton: {
    borderColor: '#2E7D32',
  },
  refreshButtonText: {
    color: '#2E7D32',
    fontSize: 12,
  },
  networkLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  networkChip: {
    backgroundColor: '#E3F2FD',
    alignSelf: 'flex-start',
  },
  networkChipText: {
    color: '#1565C0',
    fontWeight: '600',
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 20,
  },
  connectButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 6,
  },
  connectButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  walletConnectButton: {
    borderColor: '#2E7D32',
    paddingVertical: 6,
  },
  walletConnectButtonText: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  disconnectButton: {
    borderColor: '#B00020',
    marginTop: 8,
  },
  disconnectButtonText: {
    color: '#B00020',
    fontWeight: '600',
  },
  infoContainer: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
});
