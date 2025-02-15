import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { StyleSheet } from 'react-native';

export const TabBarIcon = (props: {
  name: React.ComponentProps<typeof FontAwesome5>['name'];
  color: string;
}) => {
  return <FontAwesome5 size={28} style={styles.tabBarIcon} {...props} />;
};

export const styles = StyleSheet.create({
  tabBarIcon: {
    marginBottom: -20,
  },
});
