import { Tabs } from 'expo-router';
import { TabBarIcon } from '~/components/TabBarIcon';

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: 'black',
        tabBarStyle: {
          minHeight: 60,
          backgroundColor: '#fff',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarShowLabel: false,
          title: 'Tasks',
          headerStyle: {
            backgroundColor: '#87CEEB',
          },
          headerTitleStyle: {
            color: 'white',
          },
          tabBarIcon: ({ color }) => <TabBarIcon name="tasks" color={color} />,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Settings',
          tabBarShowLabel: false,
          headerStyle: {
            backgroundColor: '#87CEEB',
          },
          headerTitleStyle: {
            color: 'white',
          },
          tabBarIcon: ({ color }) => <TabBarIcon name="cog" color={color} />,
        }}
      />
    </Tabs>
  );
}
