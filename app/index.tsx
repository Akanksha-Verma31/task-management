import React, { useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.push('/login');
    });
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/graph.png')}
        style={styles.backgroundImage}
        resizeMode="cover">
        <View style={styles.gradient}>
          <View style={styles.content}>
            <Animated.View
              style={[
                styles.logoContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}>
              <Text style={styles.logo}>TaskMaster</Text>
              <Text style={styles.tagline}>Manage your tasks efficiently</Text>
            </Animated.View>
            <Animated.View
              style={[
                styles.buttonContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}>
              <Pressable
                onPress={handlePress}
                style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
                <Text style={styles.buttonText}>Get Started</Text>
              </Pressable>

              <Text style={styles.subText}>Your personal task management solution</Text>
            </Animated.View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundImage: {
    width,
    height,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  content: {
    gap: 48,
  },
  logoContainer: {
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  tagline: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 16,
    marginBottom: 48,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  subText: {
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'center',
    fontSize: 14,
  },
});
