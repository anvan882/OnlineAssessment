import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { SortFilterBar } from './SortFilterBar';
import { useAppTheme } from '@/src/theme/ThemeContext';
import { timeAgo } from '@/src/lib/timeAgo';
import type { FeatureStatus, SortOption } from '@/src/lib/features';

type Props = {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeSort: SortOption;
  activeFilter: FeatureStatus | null;
  onSortChange: (s: SortOption) => void;
  onFilterChange: (f: FeatureStatus | null) => void;
  onAddPress: () => void;
  lastUpdated?: Date | null;
};

export function CategoryListHeader({
  searchQuery,
  onSearchChange,
  activeSort,
  activeFilter,
  onSortChange,
  onFilterChange,
  onAddPress,
  lastUpdated,
}: Props) {
  const { colors } = useAppTheme();

  return (
    <View>
      <View style={styles.topRow}>
        <Pressable
          onPress={onAddPress}
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          accessibilityLabel="Submit a new feature request"
        >
          <Text style={[styles.addButtonText, { color: colors.onPrimary }]}>+ New Post</Text>
        </Pressable>
      </View>
      <View style={[styles.searchRow, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
        <TextInput
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholder="Search features…"
          placeholderTextColor={colors.placeholder}
          style={[styles.searchInput, { color: colors.text }]}
          clearButtonMode="while-editing"
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      <SortFilterBar
        activeSort={activeSort}
        activeFilter={activeFilter}
        onSortChange={onSortChange}
        onFilterChange={onFilterChange}
      />
      {lastUpdated ? (
        <Text style={[styles.lastUpdated, { color: colors.textDimmed }]}>
          Last updated {timeAgo(lastUpdated.toISOString())}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 4,
    alignItems: 'flex-end',
  },
  addButton: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20 },
  addButtonText: { fontSize: 14, fontWeight: '700' },
  searchRow: {
    marginHorizontal: 12,
    marginBottom: 4,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: { fontSize: 15 },
  lastUpdated: { fontSize: 11, textAlign: 'center', paddingVertical: 4 },
});
