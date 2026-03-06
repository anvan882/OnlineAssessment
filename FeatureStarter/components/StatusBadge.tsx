import { View, Text, StyleSheet } from 'react-native';
import type { FeatureStatus } from '@/src/lib/features';
import { useAppTheme } from '@/src/theme/ThemeContext';

const LABELS: Record<FeatureStatus, string> = {
  requested: 'Requested',
  in_progress: 'In Progress',
  shipped: 'Shipped',
};

export function StatusBadge({ status }: { status: FeatureStatus }) {
  const { colors } = useAppTheme();

  const bgColor =
    status === 'shipped' ? colors.statusShipped
    : status === 'in_progress' ? colors.statusInProgress
    : colors.statusRequested;

  return (
    <View style={[styles.badge, { backgroundColor: bgColor + '22' }]}>
      <Text style={[styles.label, { color: bgColor }]}>{LABELS[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
  },
});
