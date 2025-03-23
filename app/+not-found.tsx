import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Text, Button } from 'react-native-paper';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Sayfa Bulunamadı' }} />
      <View style={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>
          Bu sayfa bulunamadı.
        </Text>
        <Link href="/" asChild>
          <Button mode="contained" style={styles.button}>
            Ana Sayfaya Dön
          </Button>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2E7D32',
  },
});
