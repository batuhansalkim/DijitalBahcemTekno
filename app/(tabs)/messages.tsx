import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Text, Searchbar, Avatar, Surface, IconButton, Badge, Divider } from 'react-native-paper';
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
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => router.push({ pathname: '/chat/[id]' as const, params: { id: item.id } })}
    >
      <Surface style={styles.chatCard} elevation={2}>
        <View style={styles.chatContent}>
          <View style={styles.avatarContainer}>
            <Avatar.Image source={{ uri: item.avatar }} size={56} style={styles.avatar} />
            {item.type === 'farmer' && (
              <IconButton
                icon="tree"
                size={18}
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
            <Badge style={styles.unreadBadge}>{item.unreadCount}</Badge>
          )}
        </View>
      </Surface>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Mesajlar</Text>
        <IconButton icon="plus" size={26} iconColor="#2D6A4F" style={styles.newMsgBtn} onPress={() => {}} />
      </View>
      <Divider style={{ marginBottom: 4 }} />
      <Searchbar
        placeholder="İsim veya ağaç adı ile ara..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchBar}
        inputStyle={styles.searchInput}
        iconColor="#2D6A4F"
      />
      <FlatList
        data={filteredChats}
        renderItem={renderChatItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatList}
        ItemSeparatorComponent={() => <View style={{ height: 6 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F3',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 18,
    paddingBottom: 8,
    paddingHorizontal: 18,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B4332',
  },
  newMsgBtn: {
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    margin: 0,
  },
  searchBar: {
    margin: 16,
    marginBottom: 0,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 0,
  },
  searchInput: {
    fontSize: 15,
    color: '#222',
  },
  chatList: {
    padding: 12,
    paddingTop: 8,
  },
  chatCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  chatContent: {
    flexDirection: 'row',
    padding: 14,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 14,
  },
  avatar: {
    borderWidth: 2,
    borderColor: '#E8F5E9',
    backgroundColor: '#fff',
  },
  typeIcon: {
    position: 'absolute',
    right: -8,
    bottom: -8,
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    margin: 0,
    elevation: 0,
  },
  messageInfo: {
    flex: 1,
    marginRight: 8,
  },
  headerRowInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B4332',
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    marginLeft: 8,
  },
  treeName: {
    fontSize: 13,
    color: '#2D6A4F',
    marginBottom: 2,
    fontWeight: '500',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  unreadBadge: {
    backgroundColor: '#2D6A4F',
    fontWeight: 'bold',
    fontSize: 13,
    alignSelf: 'flex-start',
    marginLeft: 8,
    marginTop: 2,
  },
}); 