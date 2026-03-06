import { ScrollView, Pressable, Text, StyleSheet } from 'react-native';
import type { SortOption, FeatureStatus } from '@/src/lib/features';
import { useAppTheme } from '@/src/theme/ThemeContext';

type Props = {
  activeSort: SortOption;
  activeFilter: FeatureStatus | null;
  onSortChange: (sort: SortOption) => void;
  onFilterChange: (filter: FeatureStatus | null) => void;
};

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'most_voted', label: 'Most Voted' },
  { value: 'newest', label: 'Newest' },
  { value: 'trending', label: 'Trending' },
];

const FILTER_OPTIONS: { value: FeatureStatus | null; label: string }[] = [
  { value: null, label: 'All' },
  { value: 'requested', label: 'Requested' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'shipped', label: 'Shipped' },
];

export function SortFilterBar({ activeSort, activeFilter, onSortChange, onFilterChange }: Props) {
  const { colors } = useAppTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {SORT_OPTIONS.map((opt) => {
        const active = activeSort === opt.value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onSortChange(opt.value)}
            style={[
              styles.chip,
              { borderColor: active ? colors.primary : colors.border },
              active && { backgroundColor: colors.primary + '22' },
            ]}
            accessibilityLabel={`Sort by ${opt.label}`}
          >
            <Text style={[styles.chipText, { color: active ? colors.primary : colors.textSecondary }]}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}

      <Text style={[styles.divider, { color: colors.border }]}>|</Text>

      {FILTER_OPTIONS.map((opt) => {
        const active = activeFilter === opt.value;
        return (
          <Pressable
            key={opt.value ?? 'all'}
            onPress={() => onFilterChange(opt.value)}
            style={[
              styles.chip,
              { borderColor: active ? colors.primary : colors.border },
              active && { backgroundColor: colors.primary + '22' },
            ]}
            accessibilityLabel={`Filter by ${opt.label}`}
          >
            <Text style={[styles.chipText, { color: active ? colors.primary : colors.textSecondary }]}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    fontSize: 16,
    marginHorizontal: 4,
  },
});
