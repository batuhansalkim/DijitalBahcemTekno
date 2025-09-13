import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Image } from "react-native";
import { Text, Button, Surface, Avatar, ProgressBar } from "react-native-paper";
import { router } from "expo-router";
import { getAnomalyAlerts, getAnomalyGraph } from "../services/aiServices";

const SAMPLE_MY_TREES = [
  {
    id: "1",
    name: "Zeytin Ağacı #123",
    location: "İzmir, Seferihisar",
    farmer: "Ahmet Çiftçi",
    status: "Sağlıklı",
    health: 0.9,
    nextHarvest: "2024 Kasım",
    image: "https://images.unsplash.com/photo-1445264718234-a623be589d37",
  },
  {
    id: "2",
    name: "Portakal Ağacı #456",
    location: "Antalya, Finike",
    farmer: "Mehmet Yılmaz",
    status: "Bakım Gerekiyor",
    health: 0.7,
    nextHarvest: "2024 Aralık",
    image: "https://images.unsplash.com/photo-1590086783191-a0694c7d1e6e",
  },
];

interface TreeItem {
  id: string;
  name: string;
  location: string;
  farmer: string;
  status: string;
  health: number;
  nextHarvest: string;
  image: string;
}

export default function MyTreesScreen() {
  const [alerts, setAlerts] = useState<any>(null);
  const [graphUri, setGraphUri] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const data = await getAnomalyAlerts("C0001");
        setAlerts(data);

        const graph = await getAnomalyGraph("C0001");
        setGraphUri(graph);
      } catch (err) {
        console.error("Anomaly fetch error", err);
      }
    }
    fetchAlerts();
  }, []);

  const renderTreeCard = ({ item }: { item: TreeItem }) => (
    <Surface style={styles.treeCard} elevation={3}>
      <View style={styles.cardTopRow}>
        <Avatar.Image
          source={{ uri: item.image }}
          size={64}
          style={styles.treeAvatar}
        />
        <View style={styles.cardInfo}>
          <Text style={styles.treeName}>{item.name}</Text>
          <Text style={styles.treeLocation}>{item.location}</Text>
          <Text style={styles.farmerName}>Çiftçi: {item.farmer}</Text>
        </View>
      </View>
      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>Durum: </Text>
        <Text
          style={[
            styles.statusValue,
            { color: item.health > 0.8 ? "#2E7D32" : "#FFA000" },
          ]}
        >
          {item.status}
        </Text>
        <Text style={styles.harvestInfo}>
          Sonraki Hasat: {item.nextHarvest}
        </Text>
      </View>
      <View style={styles.healthContainer}>
        <Text style={styles.healthLabel}>Ağaç Sağlığı</Text>
        <ProgressBar
          progress={item.health}
          color={item.health > 0.8 ? "#2E7D32" : "#FFA000"}
          style={styles.healthBar}
        />
      </View>
      <View style={styles.cardActions}>
        <Button
          mode="contained"
          style={styles.detailsBtn}
          onPress={() =>
            router.push({
              pathname: "/tree/[id]" as const,
              params: { id: item.id },
            })
          }
        >
          Detaylar
        </Button>
        <Button
          mode="outlined"
          style={styles.msgBtn}
          onPress={() => router.push("/messages")}
        >
          Mesaj Gönder
        </Button>
      </View>
    </Surface>
  );

  return (
    <FlatList
      data={SAMPLE_MY_TREES}
      renderItem={renderTreeCard}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.treeList}
      ListHeaderComponent={
        <View>
          <View style={styles.header}>
            <Text style={styles.title}>Ağaçlarım</Text>
            <Text style={styles.subtitle}>
              Toplam {SAMPLE_MY_TREES.length} ağaç kiralıyorsunuz
            </Text>
          </View>

          {/* 🔹 Anomali grafiği sadece veri varsa göster */}
          {graphUri && (
            <View style={styles.graphCard}>
              <Text style={styles.graphTitle}>
                📊 Yıllık Hasat Karşılaştırması
              </Text>
              <Image
                source={{ uri: graphUri }}
                style={styles.graphImage}
                resizeMode="contain"
              />
              <Text style={styles.graphFooter}>
                {alerts?.alerts?.length > 0
                  ? `⚠ Anomali tespit edildi`
                  : "✅ Her şey normal görünüyor"}
              </Text>
            </View>
          )}
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: "#F5F7F3" },
  header: {
    padding: 24,
    backgroundColor: "#2D6A4F",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 8,
  },
  title: { fontSize: 26, fontWeight: "bold", color: "#fff", marginBottom: 4 },
  subtitle: { fontSize: 16, color: "#fff", opacity: 0.92 },
  treeList: { padding: 16, paddingTop: 8 },
  treeCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginBottom: 18,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTopRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  treeAvatar: {
    marginRight: 16,
    borderWidth: 2,
    borderColor: "#E8F5E9",
    backgroundColor: "#fff",
  },
  cardInfo: { flex: 1 },
  treeName: { fontSize: 18, fontWeight: "bold", color: "#1B4332" },
  treeLocation: { fontSize: 14, color: "#666", marginBottom: 2 },
  farmerName: { fontSize: 14, color: "#2D6A4F", fontWeight: "500", marginBottom: 2 },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    justifyContent: "space-between",
  },
  statusLabel: { fontSize: 14, color: "#666" },
  statusValue: { fontSize: 14, fontWeight: "bold" },
  harvestInfo: { fontSize: 13, color: "#2D6A4F", fontWeight: "500" },
  healthContainer: { marginBottom: 8 },
  healthLabel: { fontSize: 14, color: "#666", marginBottom: 4 },
  healthBar: { height: 8, borderRadius: 4 },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 8,
  },
  detailsBtn: { backgroundColor: "#2D6A4F", borderRadius: 8 },
  msgBtn: { borderColor: "#2D6A4F", borderRadius: 8 },
  graphCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    margin: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    alignItems: "center",
  },
  graphTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2D6A4F",
    marginBottom: 12,
  },
  graphImage: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    backgroundColor: "#FAFAFA",
  },
  graphFooter: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "500",
    color: "#E65100",
  },
});
