import { Stack } from 'expo-router';

export default function TreesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="add" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="[id]/blockchain" />
      <Stack.Screen name="[id]/growth-details" />
      <Stack.Screen name="[id]/rent" />
    </Stack>
  );
} 