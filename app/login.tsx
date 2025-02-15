import { useState } from 'react';
import {
  Text,
  TextInput,
  Pressable,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { FirebaseError } from 'firebase/app';
import { AuthStyles } from '~/styles/AuthStyles';

const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            Alert.alert('Error', 'Invalid email or password');
            break;
          case 'auth/invalid-email':
            Alert.alert('Error', 'Invalid email address');
            break;
          default:
            Alert.alert('Error', 'An error occurred during login');
        }
      }
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={AuthStyles.container}>
      <Image source={require('../assets/graph.png')} style={AuthStyles.image} />
      <Text style={AuthStyles.title}>Welcome Back</Text>

      <TextInput
        style={AuthStyles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!isLoading}
      />

      <TextInput
        style={AuthStyles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!isLoading}
      />

      <Pressable
        onPress={handleLogin}
        style={({ pressed }) => [
          AuthStyles.button,
          isLoading && AuthStyles.buttonDisabled,
          { opacity: pressed ? 0.6 : 1 },
        ]}
        disabled={isLoading}>
        <Text style={AuthStyles.buttonText}>{isLoading ? 'Logging in...' : 'Log In'}</Text>
      </Pressable>

      <Link href="/signup" asChild>
        <Pressable style={AuthStyles.linkButton}>
          <Text style={AuthStyles.linkText}>Don't have an account? Sign Up</Text>
        </Pressable>
      </Link>
    </KeyboardAvoidingView>
  );
}
