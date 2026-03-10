import { useLocalSearchParams, useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryListHeader } from '@/components/CategoryListHeader';
import { FeatureCard } from '@/components/FeatureCard';
import { Toast } from '@/components/Toast';
import {
  applyVoteOptimistically,
  fetchFeatures,
  filterFeaturesByStatus,
  searchFeatures,
  sortFeatures,
  voteFeature,
  type FeatureStatus,
  type FeatureWithVotes,
  type SortOption,
  type VoteValue,
} from '@/src/lib/features';
import { useVoterId } from '@/src/hooks/useVoterId';
import { useAppTheme } from '@/src/theme/ThemeContext';

export default function CategoryScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const isFocused = useIsFocused();
  const { colors } = useAppTheme();
  const { voterId, loading: voterLoading } = useVoterId();
  const [features, setFeatures] = useState<FeatureWithVotes[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('most_voted');
  const [filterStatus, setFilterStatus] = useState<FeatureStatus | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const displayedFeatures = searchFeatures(
    sortFeatures(filterFeaturesByStatus(features, filterStatus), sortOption),
    searchQuery
  );

  useEffect(() => {
    navigation.setOptions({ title: name ?? 'Features' });
  }, [name, navigation]);

  const load = useCallback(
    async (isRefresh = false) => {
      if (!voterId || !id) return;
      isRefresh ? setRefreshing(true) : setLoading(true);
      setError(null);
      try {
        const data = await fetchFeatures(voterId, id);
        setFeatures(data);
        setLastUpdated(new Date());
      } catch (e) {
        const msg =
          e instanceof Error
            ? e.message
            : typeof e === 'object' && e !== null && 'message' in e
            ? String((e as { message: unknown }).message)
            : 'Failed to load features';
        setError(msg);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [voterId, id]
  );

  const handleVote = useCallback(
    async (featureId: string, nextVote: VoteValue) => {
      if (!voterId) return;
      const snapshot = features;
      const direction = nextVote === 1 ? 'UPVOTE' : nextVote === -1 ? 'DOWNVOTE' : 'CLEAR';
      console.log(`[Vote] ${direction} | feature=${featureId} | voter=${voterId}`);
      setFeatures((prev) =>
        prev.map((f) =>
          f.id === featureId ? applyVoteOptimistically(f, nextVote) : f
        )
      );
      try {
        await voteFeature(featureId, voterId, nextVote);
        if (nextVote !== 0) {
          setToastType('success');
          setToastMsg('Vote saved!');
        }
      } catch {
        setFeatures(snapshot);
        setToastType('error');
        setToastMsg('Vote failed. Try again.');
      }
    },
    [voterId, features]
  );

  useEffect(() => {
    if (voterId && isFocused) load();
  }, [voterId, isFocused, load]);

  const isInitialLoad = voterLoading || (loading && features.length === 0);

  if (isInitialLoad) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (error && features.length === 0) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        <Pressable
          onPress={() => load()}
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
        >
          <Text style={[styles.retryText, { color: colors.onPrimary }]}>Try again</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <FlatList
        data={displayedFeatures}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FeatureCard
            item={item}
            onVote={handleVote}
            onPress={(featureId) => router.push({ pathname: '/feature/[id]', params: { id: featureId } })}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => load(true)}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListHeaderComponent={
          <CategoryListHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeSort={sortOption}
            activeFilter={filterStatus}
            onSortChange={setSortOption}
            onFilterChange={setFilterStatus}
            onAddPress={() => router.push({ pathname: '/create', params: { categoryId: id } })}
            lastUpdated={lastUpdated}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              No feature requests yet.
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textDimmed }]}>
              Be the first to submit one!
            </Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={
          displayedFeatures.length === 0
            ? [styles.listContent, styles.listEmpty]
            : styles.listContent
        }
      />
      <Toast
        message={toastMsg}
        type={toastType}
        onDismiss={() => setToastMsg(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  listContent: { paddingVertical: 10, width: '100%', maxWidth: 672, alignSelf: 'center' },
  listEmpty: { flexGrow: 1 },
  separator: { height: 10 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyText: { fontSize: 16, fontWeight: '600' },
  emptySubtext: { fontSize: 14, marginTop: 4 },
  errorText: { fontSize: 15, textAlign: 'center', marginBottom: 16 },
  retryButton: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 8 },
  retryText: { fontWeight: '600', fontSize: 15 },
});
