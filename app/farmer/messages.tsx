import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Image } from 'react-native';
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

// Örnek chat verileri
const CHATS_DATA: Chat[] = [
  {
    id: '1',
    name: 'Mehmet Yılmaz',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    lastMessage: 'Ağacımın durumu nasıl?',
    timestamp: '2 saat önce',
    unreadCount: 2,
    type: 'user',
    treeId: '1',
    treeName: 'Zeytin Ağacı #123'
  },
  {
    id: '2',
    name: 'Ayşe Demir',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786',
    lastMessage: 'Hasat zamanı yaklaşıyor',
    timestamp: '1 gün önce',
    unreadCount: 0,
    type: 'user',
    treeId: '2',
    treeName: 'Portakal Ağacı #456'
  },
  {
    id: '3',
    name: 'Ali Kaya',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    lastMessage: 'Bakım yapıldı mı?',
    timestamp: '3 gün önce',
    unreadCount: 1,
    type: 'user',
    treeId: '3',
    treeName: 'Fındık Ağacı #789'
  }
];

export default function FarmerMessagesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredChats, setFilteredChats] = useState(CHATS_DATA);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredChats(CHATS_DATA);
    } else {
      const filtered = CHATS_DATA.filter(chat =>
        chat.name.toLowerCase().includes(query.toLowerCase()) ||
        chat.treeName?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredChats(filtered);
    }
  };

  const renderChatItem = ({ item }: { item: Chat }) => (
    <Surface style={styles.chatCard} elevation={2}>
      <View style={styles.chatContent}>
        <View style={styles.avatarContainer}>
          <Avatar.Image source={{ uri: item.avatar }} size={50} style={styles.avatar} />
          <IconButton
            icon="tree"
            size={16}
            iconColor="#2D6A4F"
            style={styles.typeIcon}
          />
        </View>
        <View style={styles.messageInfo}>
          <View style={styles.headerRowInner}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
          <Text style={styles.treeName}>{item.treeName}</Text>
          <Text style={styles.lastMessage}>{item.lastMessage}</Text>
        </View>
        {item.unreadCount > 0 && (
          <Badge style={styles.unreadBadge}>{item.unreadCount}</Badge>
        )}
      </View>
    </Surface>
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
        onChangeText={handleSearch}
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