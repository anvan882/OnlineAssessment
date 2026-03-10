import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { StatusBadge } from '@/components/StatusBadge';
import {
  applyVoteOptimistically,
  fetchFeatureById,
  voteFeature,
  type FeatureWithVotes,
  type VoteValue,
} from '@/src/lib/features';
import { useVoterId } from '@/src/hooks/useVoterId';
import { useAppTheme } from '@/src/theme/ThemeContext';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function FeatureDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useAppTheme();
  const { voterId, loading: voterLoading } = useVoterId();
  const [feature, setFeature] = useState<FeatureWithVotes | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!voterId || !id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFeatureById(voterId, id);
      setFeature(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load feature');
    } finally {
      setLoading(false);
    }
  }, [voterId, id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleVote = useCallback(
    async (nextVote: VoteValue) => {
      if (!voterId || !feature) return;
      const snapshot = feature;
      setFeature(applyVoteOptimistically(feature, nextVote));
      try {
        await voteFeature(feature.id, voterId, nextVote);
      } catch {
        setFeature(snapshot);
      }
    },
    [voterId, feature]
  );

  const isInitialLoad = voterLoading || (loading && !feature);

  if (isInitialLoad) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (error || !feature) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>
          {error ?? 'Feature not found.'}
        </Text>
        <Pressable
          onPress={load}
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
        >
          <Text style={[styles.retryText, { color: colors.onPrimary }]}>Try again</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const upColor = feature.my_vote === 1 ? colors.primary : colors.textMuted;
  const downColor = feature.my_vote === -1 ? colors.error : colors.textMuted;
  const scoreColor =
    feature.my_vote === 1
      ? colors.primary
      : feature.my_vote === -1
      ? colors.error
      : colors.scoreNeutral;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>{feature.title}</Text>
          <View style={styles.metaRow}>
            <StatusBadge status={feature.status} />
            <Text style={[styles.date, { color: colors.textMuted }]}>
              {formatDate(feature.created_at)}
            </Text>
          </View>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {feature.description}
          </Text>
          {feature.rationale ? (
            <>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <Text style={[styles.rationaleHeader, { color: colors.text }]}>
                Why this feature?
              </Text>
              <Text style={[styles.rationaleText, { color: colors.textSecondary }]}>
                {feature.rationale}
              </Text>
            </>
          ) : null}
        </View>

        <View style={[styles.voteCard, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
          <View style={styles.scoreRow}>
            <Text style={[styles.scoreLabel, { color: colors.label }]}>Score</Text>
            <Text style={[styles.scoreValue, { color: scoreColor }]}>{feature.score}</Text>
          </View>
          <Text style={[styles.voteCounts, { color: colors.textMuted }]}>
            {feature.upvotes_count}↑ · {feature.downvotes_count}↓
          </Text>
          <View style={styles.voteButtons}>
            <Pressable
              onPress={() => handleVote(feature.my_vote === 1 ? 0 : 1)}
              style={[styles.voteButton, feature.my_vote === 1 && { borderColor: colors.primary }]}
              accessibilityLabel="Upvote"
            >
              <MaterialIcons name="arrow-drop-up" size={32} color={upColor} />
              <Text style={[styles.voteLabel, { color: upColor }]}>Upvote</Text>
            </Pressable>
            <Pressable
              onPress={() => handleVote(feature.my_vote === -1 ? 0 : -1)}
              style={[styles.voteButton, feature.my_vote === -1 && { borderColor: colors.error }]}
              accessibilityLabel="Downvote"
            >
              <MaterialIcons name="arrow-drop-down" size={32} color={downColor} />
              <Text style={[styles.voteLabel, { color: downColor }]}>Downvote</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  content: { padding: 16, maxWidth: 672, width: '100%', alignSelf: 'center', gap: 12 },
  card: { borderRadius: 12, borderWidth: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '700', lineHeight: 28, marginBottom: 10 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  date: { fontSize: 12 },
  description: { fontSize: 15, lineHeight: 22 },
  voteCard: { borderRadius: 12, borderWidth: 1, padding: 16, alignItems: 'center', gap: 8 },
  scoreRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  scoreLabel: { fontSize: 14, fontWeight: '600' },
  scoreValue: { fontSize: 28, fontWeight: '700' },
  voteCounts: { fontSize: 13 },
  voteButtons: { flexDirection: 'row', gap: 16, marginTop: 4 },
  voteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    gap: 4,
  },
  voteLabel: { fontSize: 14, fontWeight: '600' },
  divider: { height: 1, marginVertical: 14 },
  rationaleHeader: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
  rationaleText: { fontSize: 15, lineHeight: 22 },
  errorText: { fontSize: 15, textAlign: 'center', marginBottom: 16 },
  retryButton: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 8 },
  retryText: { fontWeight: '600', fontSize: 15 },
});
