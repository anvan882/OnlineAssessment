import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import 'react-native-reanimated';

import { AppThemeProvider, useAppTheme } from '@/src/theme/ThemeContext';

SplashScreen.preventAutoHideAsync();

function InnerLayout() {
  const { mode, colors } = useAppTheme();

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background);
    SplashScreen.hideAsync();
  }, [colors.background]);

  const baseTheme = mode === 'dark' ? DarkTheme : DefaultTheme;
  const navTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      background: colors.background,
      card: colors.card,
      border: colors.border,
      text: colors.text,
      primary: colors.primary,
    },
  };

  const router = useRouter();

  const closeButton = () => (
    <Pressable onPress={() => router.back()} style={layoutStyles.closeButton} accessibilityLabel="Go back">
      <Text style={[layoutStyles.closeText, { color: colors.text }]}>✕</Text>
    </Pressable>
  );

  return (
    <ThemeProvider value={navTheme}>
      <Stack screenOptions={{ contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="create"
          options={{
            presentation: 'modal',
            title: 'New Feature Request',
            headerStyle: { backgroundColor: colors.card },
            headerTintColor: colors.text,
            headerLeft: closeButton,
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            presentation: 'modal',
            title: 'Settings',
            headerStyle: { backgroundColor: colors.card },
            headerTintColor: colors.text,
            headerLeft: closeButton,
          }}
        />
      </Stack>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

const layoutStyles = StyleSheet.create({
  closeButton: { padding: 8, marginLeft: 4 },
  closeText: { fontSize: 18, fontWeight: '600' },
});

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <InnerLayout />
    </AppThemeProvider>
  );
}
