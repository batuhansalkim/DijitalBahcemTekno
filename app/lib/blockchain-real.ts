// Zeynep'in dosyaları geldikten sonra blockchain.ts böyle olacak
import { ethers } from 'ethers';
import { walletService } from './wallet';

// Zeynep'in gerçek dosyaları
import { REGISTRY_ABI, ACCESS_CONTROL_ABI } from './zeynep-contracts/abis';
import { SEPOLIA_CONTRACTS } from './zeynep-contracts/deployments';
import { TreeRegisteredEvent } from './zeynep-contracts/events';

// Gerçek sözleşme adresleri
export const CONTRACT_ADDRESSES = {
  REGISTRY: SEPOLIA_CONTRACTS.REGISTRY,           // 0x742d35Cc...
  ACCESS_CONTROL: SEPOLIA_CONTRACTS.ACCESS_CONTROL, // 0x123456...
  VERIFIER: SEPOLIA_CONTRACTS.VERIFIER,          // 0xabcdef...
};

class BlockchainService {
  private registryContract: ethers.Contract | null = null;
  
  // Gerçek sözleşmeyi başlat
  async initializeContract(): Promise<void> {
    try {
      const signer = walletService.getSigner();
      if (!signer) {
        throw new Error('Signer bulunamadı - önce cüzdanı bağlayın');
      }

      // Gerçek sözleşme instance'ı oluştur
      this.registryContract = new ethers.Contract(
        CONTRACT_ADDRESSES.REGISTRY,  // 0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6
        REGISTRY_ABI,                 // Zeynep'in ABI'sı
        signer                        // Cüzdan bağlantısı
      );

      console.log('Gerçek blockchain sözleşmesi başlatıldı:', CONTRACT_ADDRESSES.REGISTRY);
    } catch (error) {
      console.error('Sözleşme başlatma hatası:', error);
      throw error;
    }
  }

  // Gerçek ağaç kaydetme
  async registerTree(
    rfid: string, 
    cid: string, 
    deviceSignature: string
  ): Promise<{hash: string, status: string}> {
    try {
      if (!this.registryContract) {
        await this.initializeContract();
      }

      console.log('Gerçek ağaç kaydı başlatılıyor:', { rfid, cid });

      // Gas tahmini
      const gasEstimate = await this.registryContract.registerTree.estimateGas(
        rfid, 
        cid, 
        deviceSignature
      );

      // Gerçek işlemi gönder
      const tx = await this.registryContract.registerTree(
        rfid, 
        cid, 
        deviceSignature,
        {
          gasLimit: gasEstimate * BigInt(120) / BigInt(100), // %20 buffer
        }
      );

      console.log('Gerçek işlem gönderildi:', tx.hash);
      console.log('Etherscan:', `https://sepolia.etherscan.io/tx/${tx.hash}`);

      return {
        hash: tx.hash,
        status: 'pending',
      };

    } catch (error) {
      console.error('Gerçek ağaç kayıt hatası:', error);
      throw error;
    }
  }

  // Gerçek RFID → CID alma
  async getCIDByRFID(rfid: string): Promise<string | null> {
    try {
      if (!this.registryContract) {
        await this.initializeContract();
      }

      console.log('Gerçek CID sorgusu:', rfid);
      
      const cid = await this.registryContract.getByRfid(rfid);
      
      console.log('Bulunan CID:', cid);
      return cid || null;

    } catch (error) {
      console.error('Gerçek CID alma hatası:', error);
      return null;
    }
  }

  // Gerçek event dinleme
  async startEventListener(): Promise<void> {
    try {
      if (!this.registryContract) {
        await this.initializeContract();
      }

      // TreeRegistered event'ini dinle
      this.registryContract.on("TreeRegistered", (rfid, cid, owner, timestamp, event) => {
        const eventData: TreeRegisteredEvent = {
          rfid,
          cid,
          owner,
          timestamp: Number(timestamp),
          blockNumber: event.blockNumber,
          transactionHash: event.transactionHash,
        };

        console.log('Yeni ağaç kaydedildi:', eventData);
        
        // UI'ya bildir (React state güncellemesi vs.)
        // Bu kısım mobil uygulamada kullanılacak
      });

      console.log('Gerçek event listener başlatıldı');

    } catch (error) {
      console.error('Event listener hatası:', error);
    }
  }
}

export const blockchainService = new BlockchainService();
