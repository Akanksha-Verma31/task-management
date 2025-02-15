import { StyleSheet } from 'react-native';
export const AuthStyles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
      backgroundColor: '#fff',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ddd',
      padding: 15,
      marginBottom: 15,
      borderRadius: 8,
      fontSize: 16,
      width: '100%',
    },
    button: {
      backgroundColor: '#007AFF',
      padding: 15,
      borderRadius: 8,
      marginBottom: 10,
    },
    buttonDisabled: {
      backgroundColor: '#ccc',
    },
    buttonText: {
      color: '#fff',
      textAlign: 'center',
      fontSize: 16,
      fontWeight: 'bold',
    },
    linkButton: {
      padding: 15,
    },
    linkText: {
      color: '#007AFF',
      textAlign: 'center',
      fontSize: 16,
    },
    image: {
        position: 'absolute',
        top: -300,
        right: -150,
      },
  });