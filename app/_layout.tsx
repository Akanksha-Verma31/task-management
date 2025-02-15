import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { FirebaseAuthRepository } from '../repositories/FirebaseAuthRepository';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

SplashScreen.preventAutoHideAsync();

const authRepository = new FirebaseAuthRepository();

function RootLayoutNav() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(tabs)';

    if (user && !inAuthGroup) {
      router.replace('/(tabs)');
    } else if (!user && inAuthGroup) {
      router.replace('/login');
    }
  }, [user, segments, isLoading]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="login"
        options={{
          title: 'Login',
          headerBackVisible: false,
          headerTitleStyle: { color: 'white' },
          headerStyle: { backgroundColor: '#007AFF' },
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          title: 'Sign Up',
          headerTintColor: 'white',
          headerTitleStyle: { color: 'white' },
          headerStyle: { backgroundColor: '#007AFF' },
        }}
      />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AuthProvider authRepository={authRepository}>
        <RootLayoutNav />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
