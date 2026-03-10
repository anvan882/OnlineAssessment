import { View, Text, Pressable, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { FeatureWithVotes, VoteValue } from '@/src/lib/features';
import { useAppTheme } from '@/src/theme/ThemeContext';
import { StatusBadge } from './StatusBadge';
import { timeAgo } from '@/src/lib/timeAgo';

type Props = {
  item: FeatureWithVotes;
  onVote?: (featureId: string, nextVote: VoteValue) => void;
  onPress?: (featureId: string) => void;
};

function formatScore(n: number): string {
  if (Math.abs(n) >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function FeatureCard({ item, onVote, onPress }: Props) {
  const { colors } = useAppTheme();

  const upColor = item.my_vote === 1 ? colors.primary : colors.textMuted;
  const downColor = item.my_vote === -1 ? colors.error : colors.textMuted;
  const scoreColor =
    item.my_vote === 1 ? colors.primary : item.my_vote === -1 ? colors.error : colors.scoreNeutral;

  const handleUp = () => onVote?.(item.id, item.my_vote === 1 ? 0 : 1);
  const handleDown = () => onVote?.(item.id, item.my_vote === -1 ? 0 : -1);

  return (
    <Pressable
      onPress={onPress ? () => onPress(item.id) : undefined}
      style={[styles.card, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}
      accessibilityRole={onPress ? 'button' : undefined}
    >
      <View style={styles.voteColumn}>
        <Pressable onPress={handleUp} style={styles.voteButton} accessibilityLabel="Upvote">
          <MaterialIcons name="arrow-drop-up" size={28} color={upColor} />
        </Pressable>
        <Text style={[styles.score, { color: scoreColor }]}>
          {formatScore(Number(item.score ?? 0))}
        </Text>
        <Pressable onPress={handleDown} style={styles.voteButton} accessibilityLabel="Downvote">
          <MaterialIcons name="arrow-drop-down" size={28} color={downColor} />
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
          <StatusBadge status={item.status ?? 'requested'} />
          <Text style={[styles.voteCounts, { color: colors.textMuted }]}>
            {Number(item.upvotes_count ?? 0)}↑ · {Number(item.downvotes_count ?? 0)}↓
          </Text>
          <Text style={[styles.timeAgo, { color: colors.textDimmed }]}>
            {timeAgo(item.created_at)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
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
  score: { fontSize: 13, fontWeight: '600', textAlign: 'center' },
  content: { flex: 1, paddingVertical: 16, paddingRight: 14, paddingLeft: 2 },
  title: { fontSize: 15, fontWeight: '600', marginBottom: 6, lineHeight: 21 },
  description: { fontSize: 13, lineHeight: 19, marginBottom: 10 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  voteCounts: { fontSize: 12 },
  timeAgo: { fontSize: 12, marginLeft: 'auto' },
});
