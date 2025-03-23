import React, { useState, useRef } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Avatar, Surface, IconButton, TextInput, Button } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';

interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: 'user' | 'farmer';
}

// Örnek mesaj verileri
const SAMPLE_MESSAGES: Message[] = [
  {
    id: '1',
    text: 'Merhaba, ağaçlarınızın son durumu hakkında bilgi verebilir misiniz?',
    timestamp: '14:30',
    sender: 'user',
  },
  {
    id: '2',
    text: 'Tabii ki! Zeytinleriniz bu sezon çok verimli görünüyor. Geçen haftaki yağmurlar çok iyi geldi.',
    timestamp: '14:32',
    sender: 'farmer',
  },
  {
    id: '3',
    text: 'Hasat zamanı yaklaşıyor mu?',
    timestamp: '14:33',
    sender: 'user',
  },
  {
    id: '4',
    text: 'Evet, tahminen 2-3 hafta içinde hasada başlayabiliriz. Size detaylı bir plan göndereceğim.',
    timestamp: '14:35',
    sender: 'farmer',
  },
];

// Örnek çiftçi verisi
const FARMER_DATA = {
  id: '1',
  name: 'Ahmet Çiftçi',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
  experience: '15 yıl',
  treeCount: 250,
  rating: 4.8,
};

export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(SAMPLE_MESSAGES);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message.trim(),
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        sender: 'user',
      };
      
      setMessages([...messages, newMessage]);
      setMessage('');
      
      // Otomatik scroll
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'user' ? styles.userMessage : styles.farmerMessage
    ]}>
      <Surface style={[
        styles.messageBubble,
        item.sender === 'user' ? styles.userBubble : styles.farmerBubble
      ]}>
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.messageTime}>{item.timestamp}</Text>
      </Surface>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Surface style={styles.header} elevation={2}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => router.back()}
        />
        <Avatar.Image
          source={{ uri: FARMER_DATA.avatar }}
          size={40}
          style={styles.avatar}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{FARMER_DATA.name}</Text>
          <Text style={styles.status}>Çevrimiçi</Text>
        </View>
        <IconButton
          icon="information"
          size={24}
          onPress={() => router.push({
            pathname: '/farmer/[id]' as const,
            params: { id: FARMER_DATA.id }
          })}
        />
      </Surface>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        onLayout={() => flatListRef.current?.scrollToEnd()}
      />

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <Surface style={styles.inputContainer} elevation={4}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Mesajınızı yazın..."
            style={styles.input}
            right={
              <TextInput.Icon
                icon="send"
                onPress={sendMessage}
                disabled={!message.trim()}
              />
            }
          />
        </Surface>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#fff',
  },
  avatar: {
    marginHorizontal: 8,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 12,
    color: '#2E7D32',
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  farmerMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: '#2E7D32',
  },
  farmerBubble: {
    backgroundColor: '#fff',
  },
  messageText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#fff',
  },
  messageTime: {
    fontSize: 10,
    color: '#666',
    alignSelf: 'flex-end',
  },
  inputContainer: {
    padding: 8,
    backgroundColor: '#fff',
  },
  input: {
    backgroundColor: '#fff',
  },
}); 