import React from "react";
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { Surface, Chip, IconButton } from "react-native-paper";
import { AISuggestion } from "../services/aiServices";

interface AISuggestionsProps {
  loading: boolean;
  suggestions: AISuggestion[];
  onActionPress: (suggestion: AISuggestion) => void;
}

export default function AISuggestions({ loading, suggestions, onActionPress }: AISuggestionsProps) {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2D6A4F" />
        <Text style={styles.loadingText}>AI önerileri yükleniyor...</Text>
      </View>
    );
  }

  if (!suggestions || suggestions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Henüz öneri bulunmuyor</Text>
      </View>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#D32F2F';
      case 'medium': return '#FFA000';
      case 'low': return '#2D6A4F';
      default: return '#666';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'maintenance': return 'wrench';
      case 'harvest': return 'fruit-cherries';
      case 'health': return 'heart-pulse';
      case 'weather': return 'weather-cloudy';
      case 'general': return 'lightbulb';
      default: return 'information';
    }
  };

  const getCategoryTitle = (category: string, suggestion: AISuggestion) => {
    // Öneri metninden ilk birkaç kelimeyi alarak dinamik başlık oluştur
    const words = suggestion.description.replace(/^\*/, '').split(' ');
    const firstWords = words.slice(0, 3).join(' ');
    
    // Eğer çok kısa ise kategori bazlı başlık kullan
    if (firstWords.length < 10) {
      switch (category) {
        case 'maintenance': return '🔧 Bakım Gerekli';
        case 'harvest': return '🍎 Hasat Zamanı';
        case 'health': return '⚠️ Dikkat Gerekli';
        case 'weather': return '🌤️ Hava Uyarısı';
        case 'general': return '💡 Öneri';
        default: return '🤖 AI Önerisi';
      }
    }
    
    // İlk kelimeleri başlık olarak kullan, gerekirse kısalt
    return firstWords.length > 25 ? firstWords.substring(0, 25) + '...' : firstWords;
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>🤖 AI Önerileri</Text>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{suggestions.length} öneri</Text>
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollContainer}>
        {suggestions.map((suggestion) => (
          <Surface key={suggestion.id} style={[styles.suggestionCard, { borderLeftColor: getPriorityColor(suggestion.priority) }]} elevation={3}>
            <View style={styles.suggestionHeader}>
              <View style={styles.suggestionIconContainer}>
                <IconButton
                  icon={getCategoryIcon(suggestion.category)}
                  size={24}
                  iconColor="#fff"
                  style={[styles.suggestionIcon, { backgroundColor: getPriorityColor(suggestion.priority) }]}
                />
              </View>
              <Chip 
                style={[
                  styles.priorityChip, 
                  { 
                    backgroundColor: getPriorityColor(suggestion.priority),
                    height: 32,
                    paddingHorizontal: 12,
                    borderRadius: 16
                  }
                ]}
                textStyle={[
                  styles.priorityText,
                  { fontSize: 12, fontWeight: 'bold' }
                ]}
              >
                {suggestion.priority === 'high' 
                  ? 'Yüksek' 
                  : suggestion.priority === 'medium' 
                  ? 'Orta' 
                  : 'Düşük'}
              </Chip>
            </View>
            
            <Text style={styles.suggestionTitle}>{getCategoryTitle(suggestion.category, suggestion)}</Text>
            <Text style={styles.suggestionDescription}>{suggestion.description.replace(/^\*/, '')}</Text>
            
          </Surface>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    marginTop: 0,
    backgroundColor: '#f8fffe',
    borderRadius: 20,
    padding: 16,
    borderWidth: 2,
    borderColor: '#e8f5e8',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B4332',
  },
  badgeContainer: {
    backgroundColor: '#2D6A4F',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scrollContainer: {
    marginHorizontal: -4,
  },
  suggestionCard: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  suggestionIconContainer: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  suggestionIcon: {
    margin: 0,
    width: 50,
    height: 50,
  },
  priorityChip: {
    height: 28,
    borderRadius: 14,
    paddingHorizontal: 10,
  },
  priorityText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: 'bold',
  },
  suggestionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B4332',
    marginBottom: 8,
    marginTop: 8,
  },
  suggestionDescription: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
    marginBottom: 16,
    fontWeight: '500',
  },
  actionButton: {
    backgroundColor: '#2D6A4F',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});
