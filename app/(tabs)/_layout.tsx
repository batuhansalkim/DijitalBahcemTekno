import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#2E7D32',
          tabBarInactiveTintColor: '#666666',
          headerShown: false,
          tabBarStyle: {
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#E8F0E3',
            elevation: 8,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: -2 },
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            marginTop: 2,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Ana Sayfa',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" size={size || 24} co sartolor={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Keşfet',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="compass" size={size || 24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            title: 'Mesajlar',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="message" size={size || 24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="my-trees"
          options={{
            title: 'Ağaçlarım',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="tree" size={size || 24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profil',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account" size={size || 24} color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
