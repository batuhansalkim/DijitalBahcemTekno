import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';

export default function RootLayout() {
  return (
    <PaperProvider>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="farmer" options={{ headerShown: false }} />
        <Stack.Screen 
          name="garden/[id]" 
          options={{ 
            title: 'Bahçe Detayı',
            headerBackTitle: 'Geri'
          }} 
        />
        <Stack.Screen 
          name="tree/[id]" 
          options={{ 
            title: 'Ağaç Detayı',
            headerBackTitle: 'Geri'
          }} 
        />
        <Stack.Screen 
          name="farmer/gardens/add" 
          options={{ 
            title: 'Yeni Bahçe',
            headerBackTitle: 'Geri'
          }} 
        />
        <Stack.Screen 
          name="farmer/trees/add" 
          options={{ 
            title: 'Yeni Ağaç',
            headerBackTitle: 'Geri'
          }} 
        />
      </Stack>
    </PaperProvider>
  );
}
