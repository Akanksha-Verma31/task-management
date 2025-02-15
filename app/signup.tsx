import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { FirebaseError } from 'firebase/app';
import { AuthStyles } from '~/styles/AuthStyles';

export default function SignupScreen() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      await signUp(email, password);
      router.replace('/(tabs)');
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            Alert.alert('Error', 'Email is already registered');
            break;
          case 'auth/invalid-email':
            Alert.alert('Error', 'Invalid email address');
            break;
          case 'auth/weak-password':
            Alert.alert('Error', 'Password is too weak');
            break;
          default:
            Alert.alert('Error', 'An error occurred during signup');
        }
      }
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={AuthStyles.container}>
      <Text style={AuthStyles.title}>Create Account</Text>

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

      <TextInput
        style={AuthStyles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        editable={!isLoading}
      />

      <Pressable
        onPress={handleSignup}
        style={({ pressed }) => [
          AuthStyles.button,
          isLoading && AuthStyles.buttonDisabled,
          { opacity: pressed ? 0.6 : 1 },
        ]}
        disabled={isLoading}>
        <Text style={AuthStyles.buttonText}>{isLoading ? 'Creating Account...' : 'Sign Up'}</Text>
      </Pressable>

      <Pressable style={AuthStyles.linkButton} onPress={() => router.back()}>
        <Text style={AuthStyles.linkText}>Already have an account? Log In</Text>
      </Pressable>
    </View>
  );
}
