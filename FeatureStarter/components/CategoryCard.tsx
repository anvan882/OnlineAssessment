import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import type { Category } from '@/src/lib/categories';
import { useAppTheme } from '@/src/theme/ThemeContext';

export type { Category };

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
      <Image
        source={{ uri: category.image }}
        style={styles.image}
        resizeMode="cover"
      />
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
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 100,
  },
  content: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  name: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
  description: { fontSize: 12, lineHeight: 16 },
});
