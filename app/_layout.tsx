import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';

export default function RootLayout() {
  return (
    <PaperProvider>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="farmer" />
        <Stack.Screen 
          name="garden/[id]" 
          options={{ 
            headerShown: true,
            title: 'Bahçe Detayı',
            headerBackTitle: 'Geri'
          }} 
        />
        <Stack.Screen 
          name="tree/[id]" 
          options={{ 
            headerShown: true,
            title: 'Ağaç Detayı',
            headerBackTitle: 'Geri'
          }} 
        />
        <Stack.Screen 
          name="farmer/gardens/add" 
          options={{ 
            headerShown: true,
            title: 'Yeni Bahçe',
            headerBackTitle: 'Geri'
          }} 
        />
        <Stack.Screen 
          name="farmer/trees/add" 
          options={{ 
            headerShown: true,
            title: 'Yeni Ağaç',
            headerBackTitle: 'Geri'
          }} 
        />
      </Stack>
    </PaperProvider>
  );
}
