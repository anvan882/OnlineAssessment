import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@/src/theme/ThemeContext';

const DISMISS_MS = 2500;

type Props = {
  message: string | null;
  type?: 'success' | 'error';
  onDismiss: () => void;
};

export function Toast({ message, type = 'success', onDismiss }: Props) {
  const { colors } = useAppTheme();

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onDismiss, DISMISS_MS);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  const bg = type === 'error' ? colors.error : colors.primary;

  return (
    <View style={[styles.container, { backgroundColor: bg }]} accessibilityLiveRegion="polite">
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  text: { color: '#fff', fontSize: 14, fontWeight: '600', textAlign: 'center' },
});
