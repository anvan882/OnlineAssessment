import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { StatusBadge } from './StatusBadge';
import { fetchTrendingFeatures, type FeatureWithVotes } from '@/src/lib/features';
import { useVoterId } from '@/src/hooks/useVoterId';
import { useAppTheme } from '@/src/theme/ThemeContext';

const LIMIT = 5;

export function TrendingSection() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { voterId } = useVoterId();
  const [features, setFeatures] = useState<FeatureWithVotes[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!voterId) return;
    let cancelled = false;
    setLoading(true);
    fetchTrendingFeatures(voterId, LIMIT)
      .then((data) => { if (!cancelled) setFeatures(data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [voterId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }

  if (features.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={[styles.heading, { color: colors.text }]}>Trending</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {features.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => router.push({ pathname: '/feature/[id]', params: { id: item.id } })}
            style={[styles.card, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}
            accessibilityRole="button"
          >
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
              {item.title}
            </Text>
            <View style={styles.meta}>
              <StatusBadge status={item.status} />
              <Text style={[styles.score, { color: colors.scoreNeutral }]}>
                {item.score > 0 ? '+' : ''}{item.score}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { paddingTop: 12, paddingBottom: 4 },
  heading: { fontSize: 16, fontWeight: '700', paddingHorizontal: 16, marginBottom: 10 },
  row: { paddingHorizontal: 12, gap: 10 },
  card: {
    width: 180,
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    gap: 10,
    justifyContent: 'space-between',
  },
  title: { fontSize: 13, fontWeight: '600', lineHeight: 18 },
  meta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  score: { fontSize: 13, fontWeight: '700' },
  loadingContainer: { height: 120, justifyContent: 'center', alignItems: 'center' },
});
