import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Surface, Card, Title, Paragraph } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';

export default function GrowthDetailsScreen() {
  const { id } = useLocalSearchParams();

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.surface}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Ağaç Büyüme Detayları</Title>
            <Paragraph>Ağaç ID: {id}</Paragraph>
            <Paragraph>Bu sayfa ağaç büyüme detaylarını gösterecek.</Paragraph>
          </Card.Content>
        </Card>
        
        <Button
          mode="outlined"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          Geri Dön
        </Button>
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  surface: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  backButton: {
    marginTop: 16,
  },
});
