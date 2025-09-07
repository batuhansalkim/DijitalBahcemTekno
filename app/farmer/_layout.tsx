import { Stack } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function FarmerLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="trees" />
      <Stack.Screen name="gardens" />
      <Stack.Screen name="messages" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
