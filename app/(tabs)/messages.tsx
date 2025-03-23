import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Image } from 'react-native';
import { Text, Searchbar, Avatar, Surface, IconButton, Badge } from 'react-native-paper';
import { router } from 'expo-router';

// Chat tipi tanımı
interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  type: 'farmer' | 'user';
  treeId?: string;
  treeName?: string;
}

// Örnek sohbet verileri
const SAMPLE_CHATS: Chat[] = [
  {
    id: '1',
    name: 'Ahmet Çiftçi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    lastMessage: 'Zeytinleriniz bu sezon çok verimli görünüyor!',
    timestamp: '14:30',
    unreadCount: 2,
    type: 'farmer',
    treeId: '1',
    treeName: 'Zeytin Ağacı',
  },
  {
    id: '2',
    name: 'Mehmet Yılmaz',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
    lastMessage: 'Portakal ağacınızın son durumu hakkında bilgi verebilir misiniz?',
    timestamp: '12:45',
    unreadCount: 0,
    type: 'farmer',
    treeId: '2',
    treeName: 'Portakal Ağacı',
  },
  {
    id: '3',
    name: 'Ayşe Demir',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
    lastMessage: 'Fındık hasadı için en uygun zaman bu hafta sonu olacak.',
    timestamp: 'Dün',
    unreadCount: 1,
    type: 'farmer',
    treeId: '3',
    treeName: 'Fındık Ağacı',
  },
];

export default function MessagesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [chats, setChats] = useState<Chat[]>(SAMPLE_CHATS);

  // Sohbetleri filtrele
  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (chat.treeName && chat.treeName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderChatItem = ({ item }: { item: Chat }) => (
    <Surface
      style={styles.chatCard}
      elevation={1}
      onTouchEnd={() => router.push({
        pathname: '/chat/[id]' as const,
        params: { id: item.id }
      })}
    >
      <View style={styles.chatContent}>
        <View style={styles.avatarContainer}>
          <Avatar.Image source={{ uri: item.avatar }} size={50} />
          {item.type === 'farmer' && (
            <IconButton
              icon="tree"
              size={16}
              style={styles.typeIcon}
              iconColor="#2E7D32"
            />
          )}
        </View>
        
        <View style={styles.messageInfo}>
          <View style={styles.headerRow}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
          
          {item.treeName && (
            <Text style={styles.treeName}>{item.treeName}</Text>
          )}
          
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
        </View>

        {item.unreadCount > 0 && (
          <Badge style={styles.unreadBadge}>
            {item.unreadCount}
          </Badge>
        )}
      </View>
    </Surface>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mesajlar</Text>
      </View>

      <Searchbar
        placeholder="İsim veya ağaç adı ile ara..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchBar}
      />

      <FlatList
        data={filteredChats}
        renderItem={renderChatItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    backgroundColor: '#2E7D32',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchBar: {
    margin: 16,
    backgroundColor: '#fff',
  },
  chatList: {
    padding: 16,
  },
  chatCard: {
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  chatContent: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  typeIcon: {
    position: 'absolute',
    right: -8,
    bottom: -8,
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    margin: 0,
  },
  messageInfo: {
    flex: 1,
    marginRight: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  treeName: {
    fontSize: 12,
    color: '#2E7D32',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
  unreadBadge: {
    backgroundColor: '#2E7D32',
  },
}); 