import React, { useState, useRef } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Text, Avatar, Surface, IconButton, TextInput, Button, Divider } from 'react-native-paper';
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
    <View style={[styles.messageRow, item.sender === 'user' ? styles.userRow : styles.farmerRow]}>
      {item.sender === 'farmer' && (
        <Avatar.Image source={{ uri: FARMER_DATA.avatar }} size={32} style={styles.msgAvatar} />
      )}
      <View style={[styles.messageBubble, item.sender === 'user' ? styles.userBubble : styles.farmerBubble]}>
        <Text style={[styles.messageText, item.sender === 'user' && { color: '#fff' }]}>{item.text}</Text>
        <Text style={styles.messageTime}>{item.timestamp}</Text>
      </View>
      {item.sender === 'user' && (
        <Avatar.Icon icon="account" size={32} style={styles.msgAvatarUser} color="#2D6A4F" backgroundColor="#E8F5E9" />
      )}
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.bg}>
        {/* Header */}
        <Surface style={styles.header} elevation={3}>
          <IconButton icon="arrow-left" size={26} iconColor="#2D6A4F" onPress={() => router.back()} />
          <Avatar.Image source={{ uri: FARMER_DATA.avatar }} size={44} style={styles.headerAvatar} />
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>{FARMER_DATA.name}</Text>
            <Text style={styles.headerStatus}>Çevrimiçi</Text>
          </View>
          <IconButton icon="information" size={24} iconColor="#2D6A4F" onPress={() => router.push({ pathname: '/farmer/[id]' as const, params: { id: FARMER_DATA.id } })} />
        </Surface>
        <Divider />
        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesList}
          onLayout={() => flatListRef.current?.scrollToEnd()}
          showsVerticalScrollIndicator={false}
        />
        {/* Input */}
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
          <Surface style={styles.inputBar} elevation={4}>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Mesajınızı yazın..."
              style={styles.input}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              right={<TextInput.Icon icon="send" onPress={sendMessage} disabled={!message.trim()} color={message.trim() ? '#2D6A4F' : '#BDBDBD'} />} />
          </Surface>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#F5F7F3' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    zIndex: 10,
  },
  headerAvatar: { marginHorizontal: 8, borderWidth: 2, borderColor: '#E8F5E9', backgroundColor: '#fff' },
  headerInfo: { flex: 1 },
  headerName: { fontSize: 18, fontWeight: 'bold', color: '#1B4332' },
  headerStatus: { fontSize: 13, color: '#2D6A4F', fontWeight: '500' },
  messagesList: { padding: 16, paddingBottom: 8 },
  messageRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 10, maxWidth: '100%' },
  userRow: { justifyContent: 'flex-end', alignSelf: 'flex-end' },
  farmerRow: { justifyContent: 'flex-start', alignSelf: 'flex-start' },
  messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 18, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  userBubble: { backgroundColor: '#2D6A4F', borderTopRightRadius: 6 },
  farmerBubble: { backgroundColor: '#fff', borderTopLeftRadius: 6, borderWidth: 1, borderColor: '#E0E0E0' },
  messageText: { fontSize: 15, color: '#222' },
  messageTime: { fontSize: 12, color: '#888', marginTop: 4, alignSelf: 'flex-end' },
  msgAvatar: { marginRight: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E8F5E9' },
  msgAvatarUser: { marginLeft: 8, backgroundColor: '#E8F5E9' },
  inputBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E0E0E0', padding: 0, margin: 0, borderRadius: 0 },
  input: { flex: 1, backgroundColor: '#F8F9FA', borderRadius: 16, margin: 8, paddingHorizontal: 16, fontSize: 15 },
}); 