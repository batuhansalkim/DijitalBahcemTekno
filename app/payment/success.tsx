import React from 'react';
import { View, StyleSheet, Image, Alert, Platform } from 'react-native';
import { Text, Button, Surface, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

const CONTRACT = {
  number: '2024-0001',
  blockchainId: '0xA1B2C3D4E5F6',
  tree: 'Zeytin Ağacı #123',
  user: 'Kullanıcı Adı',
  date: new Date().toLocaleDateString('tr-TR'),
  clauses: [
    'Kiralama hakkı ve süresi belirtilmiştir.',
    'Ağacın bakımı ve yönetimi profesyonel çiftçiler tarafından yapılacaktır.',
    'Kiralama bedeli peşin ödenmiştir.',
    'Ürün teslimatı ve kalite garantisi sağlanacaktır.',
    'Sözleşme blockchain üzerinde kaydedilmiştir.',
    "Ağaç NFT'si kullanıcıya transfer edilmiştir."
  ]
};

async function handlePrint() {
  const html = getContractHtml();
  const { uri } = await Print.printToFileAsync({ html });
  const fileName = `Kiralama_Sozlesmesi_${CONTRACT.number}.pdf`;
  const destUri = FileSystem.documentDirectory + fileName;
  await FileSystem.copyAsync({ from: uri, to: destUri });
  Alert.alert('PDF İndirildi', `Sözleşme PDF olarak kaydedildi:\n${fileName}`);
}

async function handleShare() {
  const html = getContractHtml();
  const { uri } = await Print.printToFileAsync({ html });
  await Sharing.shareAsync(uri);
}

function getContractHtml() {
  return `
    <html><body style="font-family:sans-serif; margin:0; padding:0;">
      <div style="width:100%;padding:32px 0 0 0;position:relative;">
        <img src='https://i.ibb.co/6bQ6b8K/dijitalbahcem-logo.png' style="width:120px;opacity:0.15;position:absolute;top:32px;right:32px;z-index:0;" />
        <div style="background:#fff;border-radius:18px;box-shadow:0 4px 24px #0001;padding:32px 24px 24px 24px;max-width:600px;margin:0 auto;z-index:1;">
          <h1 style="color:#1B4332;font-size:28px;margin-bottom:8px;">Kiralama Sözleşmesi</h1>
          <h3 style="color:#2D6A4F;font-size:18px;margin-top:0;">Blockchain Onaylı Dijital Sözleşme</h3>
          <hr style="margin:16px 0; border:0; border-top:1.5px solid #E0E0E0;" />
          <table style="width:100%;font-size:15px;margin-bottom:16px;">
            <tr><td><b>Sözleşme No:</b></td><td>${CONTRACT.number}</td></tr>
            <tr><td><b>Blockchain ID:</b></td><td>${CONTRACT.blockchainId}</td></tr>
            <tr><td><b>Ağaç:</b></td><td>${CONTRACT.tree}</td></tr>
            <tr><td><b>Kiracı:</b></td><td>${CONTRACT.user}</td></tr>
            <tr><td><b>Tarih:</b></td><td>${CONTRACT.date}</td></tr>
          </table>
          <ol style="margin-bottom:24px;">
            ${CONTRACT.clauses.map(c => `<li style='margin-bottom:6px;'>${c}</li>`).join('')}
          </ol>
          <div style="margin-top:32px;">
            <div style="display:flex;align-items:center;justify-content:space-between;">
              <div style="font-size:14px;color:#888;">Blockchain ID: <span style='color:#2D6A4F;'>${CONTRACT.blockchainId}</span></div>
              <div style="font-size:14px;color:#888;">Tarih: ${CONTRACT.date}</div>
            </div>
            <div style="margin-top:32px;display:flex;align-items:center;">
              <div style="width:180px;height:48px;border-bottom:2px solid #2D6A4F;"></div>
              <span style="margin-left:16px;font-size:15px;color:#1B4332;font-weight:bold;">Dijital İmza</span>
            </div>
          </div>
        </div>
      </div>
    </body></html>
  `;
}

export default function PaymentSuccessScreen() {
  return (
    <View style={styles.bg}>
      <Image source={{ uri: 'https://i.ibb.co/6bQ6b8K/dijitalbahcem-logo.png' }} style={styles.logo} resizeMode="contain" />
      <Surface style={styles.card} elevation={5}>
        <View style={styles.headerRow}>
          <MaterialCommunityIcons name="file-certificate" size={38} color="#2D6A4F" />
          <Text style={styles.title}>Kiralama Sözleşmesi Blockchain'de Oluşturuldu</Text>
        </View>
        <Divider style={{ marginVertical: 12 }} />
        <View style={styles.infoRow}><Text style={styles.label}>Sözleşme No:</Text><Text style={styles.value}>{CONTRACT.number}</Text></View>
        <View style={styles.infoRow}><Text style={styles.label}>Blockchain ID:</Text><Text style={styles.value}>{CONTRACT.blockchainId}</Text></View>
        <View style={styles.infoRow}><Text style={styles.label}>Ağaç:</Text><Text style={styles.value}>{CONTRACT.tree}</Text></View>
        <View style={styles.infoRow}><Text style={styles.label}>Kiracı:</Text><Text style={styles.value}>{CONTRACT.user}</Text></View>
        <View style={styles.infoRow}><Text style={styles.label}>Tarih:</Text><Text style={styles.value}>{CONTRACT.date}</Text></View>
        <View style={styles.clausesBox}>
          {CONTRACT.clauses.map((c, i) => (
            <Text key={i} style={styles.clause}>• {c}</Text>
          ))}
        </View>
        <View style={styles.signatureRow}>
          <View style={styles.signatureLine} />
          <Text style={styles.signatureLabel}>Dijital İmza</Text>
        </View>
        <Text style={styles.nftInfo}>Ağaç NFT'si hesabınıza transfer edildi.</Text>
        <View style={styles.buttonRow}>
          <Button icon="download" mode="outlined" onPress={handlePrint} style={styles.actionButton}>PDF İndir</Button>
          <Button icon="share-variant" mode="outlined" onPress={handleShare} style={styles.actionButton}>Paylaş</Button>
        </View>
        <Button mode="contained" style={styles.button} onPress={() => router.replace('/my-trees')}>Ana Sayfaya Dön</Button>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#F5F7F3', alignItems: 'center', justifyContent: 'center' },
  logo: { position: 'absolute', top: 32, right: 32, width: 80, height: 80, opacity: 0.08, zIndex: 0 },
  card: { padding: 32, borderRadius: 24, backgroundColor: '#fff', alignItems: 'center', width: '92%', maxWidth: 480, elevation: 5 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1B4332', marginLeft: 12, flex: 1, flexWrap: 'wrap' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 2 },
  label: { fontWeight: 'bold', color: '#2D6A4F', fontSize: 15 },
  value: { color: '#222', fontSize: 15 },
  clausesBox: { marginTop: 18, marginBottom: 8, alignSelf: 'stretch' },
  clause: { fontSize: 14, color: '#222', marginBottom: 2, marginLeft: 8 },
  signatureRow: { flexDirection: 'row', alignItems: 'center', marginTop: 24, marginBottom: 8, width: '100%' },
  signatureLine: { flex: 1, height: 0, borderBottomWidth: 2, borderBottomColor: '#2D6A4F', marginRight: 12 },
  signatureLabel: { color: '#1B4332', fontWeight: 'bold', fontSize: 15 },
  nftInfo: { fontSize: 15, color: '#2D6A4F', marginTop: 12, marginBottom: 16, textAlign: 'center' },
  buttonRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 8 },
  actionButton: { borderColor: '#2D6A4F', marginHorizontal: 4 },
  button: { backgroundColor: '#2D6A4F', borderRadius: 12, marginTop: 8 },
}); 