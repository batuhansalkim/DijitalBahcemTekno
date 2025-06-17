import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Share, Alert } from 'react-native';
import { Text, Surface, Button, Divider, IconButton, Chip, ProgressBar } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const windowWidth = Dimensions.get('window').width;

export default function GrowthDetailsScreen() {
  const { id } = useLocalSearchParams();

  const generatePDFContent = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Ağaç Gelişim Raporu</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 0;
              padding: 20px;
              background-color: #f5f7f3;
            }
            .header {
              background-color: #2D6A4F;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 10px;
              margin-bottom: 20px;
            }
            .card {
              background-color: white;
              padding: 20px;
              margin-bottom: 20px;
              border-radius: 10px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .card-title {
              color: #1B4332;
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 15px;
              border-bottom: 2px solid #E8F5E9;
              padding-bottom: 10px;
            }
            .summary-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
            }
            .summary-item {
              background-color: #F8F9FA;
              padding: 15px;
              border-radius: 8px;
              text-align: center;
            }
            .summary-label {
              color: #666;
              font-size: 14px;
              margin-bottom: 5px;
            }
            .summary-value {
              color: #1B4332;
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .summary-change {
              color: #2D6A4F;
              font-size: 12px;
              font-weight: 500;
            }
            .chart-container {
              height: 200px;
              display: flex;
              align-items: end;
              justify-content: space-between;
              padding: 20px 0;
            }
            .chart-bar {
              width: 20px;
              background-color: #E8F5E9;
              border-radius: 10px;
              margin: 0 2px;
            }
            .season-item {
              background-color: #F8F9FA;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 10px;
            }
            .season-title {
              color: #1B4332;
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .season-growth {
              color: #2D6A4F;
              font-size: 14px;
              font-weight: 500;
              margin-bottom: 5px;
            }
            .season-detail {
              color: #666;
              font-size: 12px;
            }
            .progress-bar {
              background-color: #E0E0E0;
              height: 8px;
              border-radius: 4px;
              margin: 5px 0;
            }
            .progress-fill {
              height: 100%;
              border-radius: 4px;
            }
            .maintenance-item {
              display: flex;
              align-items: center;
              padding: 10px 0;
              border-bottom: 1px solid #E8F5E9;
            }
            .maintenance-icon {
              width: 24px;
              height: 24px;
              background-color: #4CAF50;
              border-radius: 50%;
              margin-right: 15px;
            }
            .prediction-item {
              background-color: #F8F9FA;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 10px;
            }
            .prediction-label {
              color: #1B4332;
              font-size: 14px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .prediction-value {
              color: #2D6A4F;
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .prediction-detail {
              color: #666;
              font-size: 12px;
            }
            .footer {
              text-align: center;
              color: #666;
              font-size: 12px;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #E8F5E9;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🌳 Ağaç Gelişim Raporu</h1>
            <p>Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')}</p>
          </div>

          <div class="card">
            <div class="card-title">📊 Gelişim Özeti</div>
            <div class="summary-grid">
              <div class="summary-item">
                <div class="summary-label">Toplam Boy</div>
                <div class="summary-value">4.2m</div>
                <div class="summary-change">+0.3m (7.7%)</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Gövde Çapı</div>
                <div class="summary-value">45cm</div>
                <div class="summary-change">+2cm (4.7%)</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Yaş</div>
                <div class="summary-value">25</div>
                <div class="summary-change">+1 yıl</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Sağlık Skoru</div>
                <div class="summary-value">95%</div>
                <div class="summary-change">+2%</div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-title">📈 Aylık Gelişim Takibi</div>
            <div class="chart-container">
              <div class="chart-bar" style="height: 60px;"></div>
              <div class="chart-bar" style="height: 65px;"></div>
              <div class="chart-bar" style="height: 70px;"></div>
              <div class="chart-bar" style="height: 75px;"></div>
              <div class="chart-bar" style="height: 80px;"></div>
              <div class="chart-bar" style="height: 85px;"></div>
              <div class="chart-bar" style="height: 90px;"></div>
              <div class="chart-bar" style="height: 95px;"></div>
              <div class="chart-bar" style="height: 100px;"></div>
              <div class="chart-bar" style="height: 105px;"></div>
              <div class="chart-bar" style="height: 110px;"></div>
              <div class="chart-bar" style="height: 115px;"></div>
            </div>
            <p style="text-align: center; color: #666; font-size: 12px;">
              Oca Şub Mar Nis May Haz Tem Ağu Eyl Eki Kas Ara
            </p>
          </div>

          <div class="card">
            <div class="card-title">🌤️ Mevsimsel Gelişim Analizi</div>
            <div class="season-item">
              <div class="season-title">İlkbahar</div>
              <div class="season-growth">+15cm boy artışı</div>
              <div class="season-detail">Yaprak gelişimi başladı</div>
            </div>
            <div class="season-item">
              <div class="season-title">Yaz</div>
              <div class="season-growth">+20cm boy artışı</div>
              <div class="season-detail">Maksimum büyüme dönemi</div>
            </div>
            <div class="season-item">
              <div class="season-title">Sonbahar</div>
              <div class="season-growth">+10cm boy artışı</div>
              <div class="season-detail">Yaprak dökümü başladı</div>
            </div>
            <div class="season-item">
              <div class="season-title">Kış</div>
              <div class="season-growth">+5cm boy artışı</div>
              <div class="season-detail">Dormant dönem</div>
            </div>
          </div>

          <div class="card">
            <div class="card-title">❤️ Sağlık Metrikleri</div>
            <div style="margin-bottom: 15px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>Yaprak Sağlığı</span>
                <span>95%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: 95%; background-color: #4CAF50;"></div>
              </div>
            </div>
            <div style="margin-bottom: 15px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>Kök Sistemi</span>
                <span>88%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: 88%; background-color: #2196F3;"></div>
              </div>
            </div>
            <div style="margin-bottom: 15px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>Gövde Sağlığı</span>
                <span>92%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: 92%; background-color: #FF9800;"></div>
              </div>
            </div>
            <div style="margin-bottom: 15px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>Genel Durum</span>
                <span>91%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: 91%; background-color: #9C27B0;"></div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-title">🔧 Bakım Geçmişi</div>
            <div class="maintenance-item">
              <div class="maintenance-icon"></div>
              <div>
                <div style="font-weight: bold; color: #1B4332;">Budama İşlemi</div>
                <div style="color: #666; font-size: 12px;">15.03.2024</div>
                <div style="color: #666; font-size: 12px;">Kuru dallar temizlendi, şekil verildi</div>
              </div>
            </div>
            <div class="maintenance-item">
              <div class="maintenance-icon" style="background-color: #2196F3;"></div>
              <div>
                <div style="font-weight: bold; color: #1B4332;">Sulama Sistemi</div>
                <div style="color: #666; font-size: 12px;">10.03.2024</div>
                <div style="color: #666; font-size: 12px;">Damla sulama sistemi kontrol edildi</div>
              </div>
            </div>
            <div class="maintenance-item">
              <div class="maintenance-icon" style="background-color: #8BC34A;"></div>
              <div>
                <div style="font-weight: bold; color: #1B4332;">Gübreleme</div>
                <div style="color: #666; font-size: 12px;">05.03.2024</div>
                <div style="color: #666; font-size: 12px;">Organik gübre uygulandı</div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-title">🔮 Gelecek Tahminleri</div>
            <div class="prediction-item">
              <div class="prediction-label">3 Ay Sonra</div>
              <div class="prediction-value">4.5m boy</div>
              <div class="prediction-detail">+0.3m artış bekleniyor</div>
            </div>
            <div class="prediction-item">
              <div class="prediction-label">6 Ay Sonra</div>
              <div class="prediction-value">4.8m boy</div>
              <div class="prediction-detail">+0.6m artış bekleniyor</div>
            </div>
            <div class="prediction-item">
              <div class="prediction-label">1 Yıl Sonra</div>
              <div class="prediction-value">5.2m boy</div>
              <div class="prediction-detail">+1.0m artış bekleniyor</div>
            </div>
          </div>

          <div class="footer">
            <p>Bu rapor Dijital Bahçem uygulaması tarafından otomatik olarak oluşturulmuştur.</p>
            <p>Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')} ${new Date().toLocaleTimeString('tr-TR')}</p>
          </div>
        </body>
      </html>
    `;
  };

  const downloadPDF = async () => {
    try {
      const htmlContent = generatePDFContent();
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false
      });
      
      const fileName = `agac_gelisim_raporu_${new Date().toISOString().split('T')[0]}.pdf`;
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'PDF Raporu İndir',
          UTI: 'com.adobe.pdf'
        });
      } else {
        Alert.alert('Hata', 'Paylaşım özelliği bu cihazda mevcut değil.');
      }
    } catch (error) {
      console.error('PDF oluşturma hatası:', error);
      Alert.alert('Hata', 'PDF oluşturulurken bir hata oluştu.');
    }
  };

  const shareReport = async () => {
    try {
      const htmlContent = generatePDFContent();
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false
      });
      
      const fileName = `agac_gelisim_raporu_${new Date().toISOString().split('T')[0]}.pdf`;
      
      await Share.share({
        url: uri,
        title: 'Ağaç Gelişim Raporu',
        message: 'Dijital Bahçem uygulamasından ağaç gelişim raporu paylaşıyorum.',
      });
    } catch (error) {
      console.error('Paylaşım hatası:', error);
      Alert.alert('Hata', 'Rapor paylaşılırken bir hata oluştu.');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={28}
          onPress={() => router.back()}
          iconColor="#fff"
        />
        <Text style={styles.headerTitle}>Detaylı Gelişim Raporu</Text>
        <View style={{ width: 56 }} />
      </View>

      {/* Özet Kartı */}
      <Surface style={styles.summaryCard} elevation={3}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="tree" size={32} color="#2D6A4F" />
          <Text style={styles.cardTitle}>Ağaç Gelişim Özeti</Text>
        </View>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Toplam Boy</Text>
            <Text style={styles.summaryValue}>4.2m</Text>
            <Text style={styles.summaryChange}>+0.3m (7.7%)</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Gövde Çapı</Text>
            <Text style={styles.summaryValue}>45cm</Text>
            <Text style={styles.summaryChange}>+2cm (4.7%)</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Yaş</Text>
            <Text style={styles.summaryValue}>25</Text>
            <Text style={styles.summaryChange}>+1 yıl</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Sağlık Skoru</Text>
            <Text style={styles.summaryValue}>95%</Text>
            <Text style={styles.summaryChange}>+2%</Text>
          </View>
        </View>
      </Surface>

      {/* Aylık Gelişim Grafiği */}
      <Surface style={styles.chartCard} elevation={3}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="chart-line" size={32} color="#2D6A4F" />
          <Text style={styles.cardTitle}>Aylık Gelişim Takibi</Text>
        </View>
        <View style={styles.monthlyChart}>
          {[
            { month: 'Oca', height: 60, growth: 0 },
            { month: 'Şub', height: 65, growth: 5 },
            { month: 'Mar', height: 70, growth: 5 },
            { month: 'Nis', height: 75, growth: 5 },
            { month: 'May', height: 80, growth: 5 },
            { month: 'Haz', height: 85, growth: 5 },
            { month: 'Tem', height: 90, growth: 5 },
            { month: 'Ağu', height: 95, growth: 5 },
            { month: 'Eyl', height: 100, growth: 5 },
            { month: 'Eki', height: 105, growth: 5 },
            { month: 'Kas', height: 110, growth: 5 },
            { month: 'Ara', height: 115, growth: 5 }
          ].map((item, index) => (
            <View key={index} style={styles.chartBar}>
              <View style={[styles.bar, { height: item.height }]} />
              <Text style={styles.barLabel}>{item.month}</Text>
              <Text style={styles.barGrowth}>+{item.growth}cm</Text>
            </View>
          ))}
        </View>
      </Surface>

      {/* Mevsimsel Analiz */}
      <Surface style={styles.seasonalCard} elevation={3}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="weather-sunny" size={32} color="#2D6A4F" />
          <Text style={styles.cardTitle}>Mevsimsel Gelişim Analizi</Text>
        </View>
        <View style={styles.seasonalData}>
          <View style={styles.seasonItem}>
            <Text style={styles.seasonTitle}>İlkbahar</Text>
            <Text style={styles.seasonGrowth}>+15cm boy artışı</Text>
            <Text style={styles.seasonDetail}>Yaprak gelişimi başladı</Text>
          </View>
          <View style={styles.seasonItem}>
            <Text style={styles.seasonTitle}>Yaz</Text>
            <Text style={styles.seasonGrowth}>+20cm boy artışı</Text>
            <Text style={styles.seasonDetail}>Maksimum büyüme dönemi</Text>
          </View>
          <View style={styles.seasonItem}>
            <Text style={styles.seasonTitle}>Sonbahar</Text>
            <Text style={styles.seasonGrowth}>+10cm boy artışı</Text>
            <Text style={styles.seasonDetail}>Yaprak dökümü başladı</Text>
          </View>
          <View style={styles.seasonItem}>
            <Text style={styles.seasonTitle}>Kış</Text>
            <Text style={styles.seasonGrowth}>+5cm boy artışı</Text>
            <Text style={styles.seasonDetail}>Dormant dönem</Text>
          </View>
        </View>
      </Surface>

      {/* Sağlık Metrikleri */}
      <Surface style={styles.healthCard} elevation={3}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="heart-pulse" size={32} color="#2D6A4F" />
          <Text style={styles.cardTitle}>Sağlık Metrikleri</Text>
        </View>
        <View style={styles.healthMetrics}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Yaprak Sağlığı</Text>
            <ProgressBar progress={0.95} color="#4CAF50" style={styles.progressBar} />
            <Text style={styles.metricValue}>95%</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Kök Sistemi</Text>
            <ProgressBar progress={0.88} color="#2196F3" style={styles.progressBar} />
            <Text style={styles.metricValue}>88%</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Gövde Sağlığı</Text>
            <ProgressBar progress={0.92} color="#FF9800" style={styles.progressBar} />
            <Text style={styles.metricValue}>92%</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Genel Durum</Text>
            <ProgressBar progress={0.91} color="#9C27B0" style={styles.progressBar} />
            <Text style={styles.metricValue}>91%</Text>
          </View>
        </View>
      </Surface>

      {/* Bakım Geçmişi */}
      <Surface style={styles.maintenanceCard} elevation={3}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="tools" size={32} color="#2D6A4F" />
          <Text style={styles.cardTitle}>Bakım Geçmişi</Text>
        </View>
        <View style={styles.maintenanceHistory}>
          <View style={styles.maintenanceItem}>
            <MaterialCommunityIcons name="calendar-check" size={24} color="#4CAF50" />
            <View style={styles.maintenanceContent}>
              <Text style={styles.maintenanceTitle}>Budama İşlemi</Text>
              <Text style={styles.maintenanceDate}>15.03.2024</Text>
              <Text style={styles.maintenanceDesc}>Kuru dallar temizlendi, şekil verildi</Text>
            </View>
          </View>
          <View style={styles.maintenanceItem}>
            <MaterialCommunityIcons name="water" size={24} color="#2196F3" />
            <View style={styles.maintenanceContent}>
              <Text style={styles.maintenanceTitle}>Sulama Sistemi</Text>
              <Text style={styles.maintenanceDate}>10.03.2024</Text>
              <Text style={styles.maintenanceDesc}>Damla sulama sistemi kontrol edildi</Text>
            </View>
          </View>
          <View style={styles.maintenanceItem}>
            <MaterialCommunityIcons name="leaf" size={24} color="#8BC34A" />
            <View style={styles.maintenanceContent}>
              <Text style={styles.maintenanceTitle}>Gübreleme</Text>
              <Text style={styles.maintenanceDate}>05.03.2024</Text>
              <Text style={styles.maintenanceDesc}>Organik gübre uygulandı</Text>
            </View>
          </View>
        </View>
      </Surface>

      {/* Tahminler */}
      <Surface style={styles.predictionCard} elevation={3}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="crystal-ball" size={32} color="#2D6A4F" />
          <Text style={styles.cardTitle}>Gelecek Tahminleri</Text>
        </View>
        <View style={styles.predictions}>
          <View style={styles.predictionItem}>
            <Text style={styles.predictionLabel}>3 Ay Sonra</Text>
            <Text style={styles.predictionValue}>4.5m boy</Text>
            <Text style={styles.predictionDetail}>+0.3m artış bekleniyor</Text>
          </View>
          <View style={styles.predictionItem}>
            <Text style={styles.predictionLabel}>6 Ay Sonra</Text>
            <Text style={styles.predictionValue}>4.8m boy</Text>
            <Text style={styles.predictionDetail}>+0.6m artış bekleniyor</Text>
          </View>
          <View style={styles.predictionItem}>
            <Text style={styles.predictionLabel}>1 Yıl Sonra</Text>
            <Text style={styles.predictionValue}>5.2m boy</Text>
            <Text style={styles.predictionDetail}>+1.0m artış bekleniyor</Text>
          </View>
        </View>
      </Surface>

      {/* Rapor İndirme */}
      <View style={styles.downloadSection}>
        <Button
          mode="contained"
          icon="download"
          onPress={downloadPDF}
          style={styles.downloadButton}
        >
          PDF Raporu İndir
        </Button>
        <Button
          mode="outlined"
          icon="share"
          onPress={shareReport}
          style={styles.shareButton}
        >
          Raporu Paylaş
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F3',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#2D6A4F',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  summaryCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#fff',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8F5E9',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1B4332',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  summaryItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B4332',
  },
  summaryChange: {
    fontSize: 12,
    color: '#2D6A4F',
    fontWeight: '500',
  },
  chartCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#fff',
  },
  monthlyChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
    paddingHorizontal: 8,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 20,
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 12,
    color: '#666',
  },
  barGrowth: {
    fontSize: 10,
    color: '#2D6A4F',
    fontWeight: '500',
  },
  seasonalCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#fff',
  },
  seasonalData: {
    gap: 16,
  },
  seasonItem: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
  },
  seasonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1B4332',
    marginBottom: 4,
  },
  seasonGrowth: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D6A4F',
    marginBottom: 4,
  },
  seasonDetail: {
    fontSize: 14,
    color: '#666',
  },
  healthCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#fff',
  },
  healthMetrics: {
    gap: 16,
  },
  metricItem: {
    gap: 8,
  },
  metricLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1B4332',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D6A4F',
    textAlign: 'right',
  },
  maintenanceCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#fff',
  },
  maintenanceHistory: {
    gap: 16,
  },
  maintenanceItem: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 8,
  },
  maintenanceContent: {
    flex: 1,
  },
  maintenanceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B4332',
  },
  maintenanceDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  maintenanceDesc: {
    fontSize: 14,
    color: '#666',
  },
  predictionCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#fff',
  },
  predictions: {
    gap: 16,
  },
  predictionItem: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
  },
  predictionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B4332',
    marginBottom: 4,
  },
  predictionValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D6A4F',
    marginBottom: 4,
  },
  predictionDetail: {
    fontSize: 14,
    color: '#666',
  },
  downloadSection: {
    padding: 20,
    gap: 12,
  },
  downloadButton: {
    backgroundColor: '#2D6A4F',
  },
  shareButton: {
    borderColor: '#2D6A4F',
  },
}); 