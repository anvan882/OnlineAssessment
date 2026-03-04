import { View, Text, Pressable, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { FeatureWithVotes, VoteValue } from '@/src/lib/features';
import { useAppTheme } from '@/src/theme/ThemeContext';

type Props = {
  item: FeatureWithVotes;
  onVote?: (featureId: string, nextVote: VoteValue) => void;
};

function formatScore(n: number): string {
  if (Math.abs(n) >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function FeatureCard({ item, onVote }: Props) {
  const { colors } = useAppTheme();

  const upColor = item.my_vote === 1 ? colors.primary : colors.textMuted;
  const downColor = item.my_vote === -1 ? colors.error : colors.textMuted;
  const scoreColor =
    item.my_vote === 1 ? colors.primary : item.my_vote === -1 ? colors.error : colors.scoreNeutral;

  const handleUp = () => onVote?.(item.id, item.my_vote === 1 ? 0 : 1);
  const handleDown = () => onVote?.(item.id, item.my_vote === -1 ? 0 : -1);

  return (
    <View style={[styles.card, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
      <View style={styles.voteColumn}>
        <Pressable onPress={handleUp} style={styles.voteButton} accessibilityLabel="Upvote">
          <MaterialIcons name="arrow-drop-up" size={32} color={upColor} />
        </Pressable>
        <Text style={[styles.score, { color: scoreColor }]}>
          {formatScore(Number(item.score ?? 0))}
        </Text>
        <Pressable onPress={handleDown} style={styles.voteButton} accessibilityLabel="Downvote">
          <MaterialIcons name="arrow-drop-down" size={32} color={downColor} />
        </Pressable>
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={3}>
          {item.description}
        </Text>
        <View style={styles.metaRow}>
          <Text style={[styles.voteCounts, { color: colors.textMuted }]}>
            {Number(item.upvotes_count ?? 0)}↑ · {Number(item.downvotes_count ?? 0)}↓
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 12,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  voteColumn: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 8,
    paddingBottom: 12,
    width: 48,
  },
  voteButton: { padding: 2 },
  score: { fontSize: 13, fontWeight: '700', textAlign: 'center' },
  content: { flex: 1, paddingVertical: 14, paddingRight: 14, paddingLeft: 2 },
  title: { fontSize: 15, fontWeight: '600', marginBottom: 6, lineHeight: 21 },
  description: { fontSize: 13, lineHeight: 19, marginBottom: 10 },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  voteCounts: { fontSize: 12 },
});
