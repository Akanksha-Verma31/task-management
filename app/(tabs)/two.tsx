import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '~/context/AuthContext';

export default function Home() {
  const { signOut } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Goodbye for now!</Text>
      <Text style={styles.subtitle}>
        You are about to sign out from this device. Sign back in anytime to access your tasks,
        schedules, and progress tracking.
      </Text>
      <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 20,
    textAlign: 'center',
  },
  signOutButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    alignSelf: 'center',
  },
  signOutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
