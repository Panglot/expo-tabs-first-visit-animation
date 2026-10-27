import { Tabs } from 'expo-router';

// Bug: the first switch to `settings` shows it instantly (only `index` fades out).
// Every later switch fades both ways. Adding `lazy: false` here fixes it.
export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ animation: 'fade' }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
