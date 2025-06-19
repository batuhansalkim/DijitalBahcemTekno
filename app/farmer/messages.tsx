import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Text, Searchbar, Avatar, Surface, IconButton, Badge, Divider } from 'react-native-paper';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

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
  isOnline?: boolean;
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
    treeName: 'Zeytin Ağacı #123',
    isOnline: true
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
    treeName: 'Portakal Ağacı #456',
    isOnline: false
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
    treeName: 'Fındık Ağacı #789',
    isOnline: true
  },
  {
    id: '4',
    name: 'Fatma Özkan',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    lastMessage: 'Yeni ağaç dikimi hakkında bilgi alabilir miyim?',
    timestamp: '5 gün önce',
    unreadCount: 0,
    type: 'user',
    treeId: '4',
    treeName: 'Elma Ağacı #101',
    isOnline: false
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
    <TouchableOpacity 
      style={styles.chatCardContainer}
      onPress={() => router.push(`/farmer/chat/${item.id}`)}
      activeOpacity={0.7}
    >
      <Surface style={styles.chatCard} elevation={1}>
        <View style={styles.chatContent}>
          <View style={styles.avatarContainer}>
            <Avatar.Image 
              source={{ uri: item.avatar }} 
              size={56} 
              style={styles.avatar} 
            />
            {item.isOnline && <View style={styles.onlineIndicator} />}
            <View style={styles.typeIconContainer}>
              <IconButton
                icon="tree"
                size={14}
                iconColor="#2E7D32"
                style={styles.typeIcon}
              />
            </View>
          </View>
          
          <View style={styles.messageInfo}>
            <View style={styles.headerRowInner}>
              <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.timestamp}>{item.timestamp}</Text>
            </View>
            <Text style={styles.treeName} numberOfLines={1}>{item.treeName}</Text>
            <Text style={styles.lastMessage} numberOfLines={2}>{item.lastMessage}</Text>
          </View>
          
          <View style={styles.rightSection}>
            {item.unreadCount > 0 && (
              <Badge style={styles.unreadBadge} size={20}>
                {item.unreadCount > 99 ? '99+' : item.unreadCount}
              </Badge>
            )}
            <IconButton
              icon="chevron-right"
              size={20}
              iconColor="#BDBDBD"
              style={styles.chevronIcon}
            />
          </View>
        </View>
      </Surface>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header with gradient */}
      <LinearGradient
        colors={['#2E7D32', '#388E3C']}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Mesajlar</Text>
            <Text style={styles.headerSubtitle}>
              {filteredChats.length} aktif konuşma
            </Text>
          </View>
          <IconButton 
            icon="plus" 
            size={24} 
            iconColor="#fff" 
            style={styles.newMsgBtn} 
            onPress={() => {}} 
          />
        </View>
      </LinearGradient>

      {/* Search Section */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="İsim veya ağaç adı ile ara..."
          value={searchQuery}
          onChangeText={handleSearch}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
          iconColor="#2E7D32"
          placeholderTextColor="#9E9E9E"
        />
      </View>

      {/* Chat List */}
      <FlatList
        data={filteredChats}
        renderItem={renderChatItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatList}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E8F5E9',
    fontWeight: '500',
  },
  newMsgBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    margin: 0,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchBar: {
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 0,
    height: 48,
  },
  searchInput: {
    fontSize: 16,
    color: '#212121',
    fontWeight: '500',
  },
  chatList: {
    padding: 16,
    paddingTop: 8,
  },
  chatCardContainer: {
    marginBottom: 4,
  },
  chatCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  chatContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    borderWidth: 3,
    borderColor: '#E8F5E9',
    backgroundColor: '#fff',
  },
  onlineIndicator: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  typeIconContainer: {
    position: 'absolute',
    right: -6,
    bottom: -6,
    backgroundColor: '#E8F5E9',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#fff',
  },
  typeIcon: {
    margin: 0,
    elevation: 0,
  },
  messageInfo: {
    flex: 1,
    marginRight: 12,
  },
  headerRowInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1B5E20',
    flex: 1,
    marginRight: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#9E9E9E',
    fontWeight: '500',
  },
  treeName: {
    fontSize: 14,
    color: '#2E7D32',
    marginBottom: 4,
    fontWeight: '600',
  },
  lastMessage: {
    fontSize: 15,
    color: '#616161',
    lineHeight: 20,
  },
  rightSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadBadge: {
    backgroundColor: '#2E7D32',
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 8,
  },
  chevronIcon: {
    margin: 0,
  },
}); 