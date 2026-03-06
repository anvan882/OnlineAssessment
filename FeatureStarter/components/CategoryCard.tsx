import { View, Text, Pressable, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useAppTheme } from '@/src/theme/ThemeContext';

export type Category = {
  id: string;
  name: string;
  description: string;
  icon: string;
  icon_color: string;
  created_at: string;
};

type Props = {
  category: Category;
  onPress: () => void;
};

export function CategoryCard({ category, onPress }: Props) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={category.name}
      style={[styles.card, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}
    >
      <View style={[styles.iconContainer, { backgroundColor: category.icon_color + '33' }]}>
        <MaterialIcons
          name={category.icon as 'star'}
          size={26}
          color={category.icon_color}
        />
      </View>
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {category.name}
        </Text>
        {category.description ? (
          <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
            {category.description}
          </Text>
        ) : null}
      </View>
      <MaterialIcons name="chevron-right" size={22} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1.5,
    marginHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1 },
  name: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  description: { fontSize: 13, lineHeight: 18 },
});
