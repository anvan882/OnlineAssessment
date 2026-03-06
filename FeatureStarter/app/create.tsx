import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { createFeature } from '@/src/lib/features';
import { useVoterId } from '@/src/hooks/useVoterId';
import { useAppTheme } from '@/src/theme/ThemeContext';

const TITLE_MIN = 3;
const TITLE_MAX = 120;
const DESC_MAX = 500;

export default function CreateScreen() {
  const router = useRouter();
  const { categoryId } = useLocalSearchParams<{ categoryId?: string }>();
  const { colors } = useAppTheme();
  const { voterId, loading: voterLoading } = useVoterId();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [titleError, setTitleError] = useState<string | null>(null);
  const [descError, setDescError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function validate(): boolean {
    let valid = true;
    const trimmedTitle = title.trim();
    if (trimmedTitle.length < TITLE_MIN) {
      setTitleError(`Title must be at least ${TITLE_MIN} characters.`);
      valid = false;
    } else if (trimmedTitle.length > TITLE_MAX) {
      setTitleError(`Title must be ${TITLE_MAX} characters or fewer.`);
      valid = false;
    } else {
      setTitleError(null);
    }
    const trimmedDesc = description.trim();
    if (trimmedDesc.length === 0) {
      setDescError('Description is required.');
      valid = false;
    } else if (trimmedDesc.length > DESC_MAX) {
      setDescError(`Description must be ${DESC_MAX} characters or fewer.`);
      valid = false;
    } else {
      setDescError(null);
    }
    return valid;
  }

  async function handleSubmit() {
    if (!validate()) return;
    if (!voterId) return;
    setSubmitError(null);
    setSubmitting(true);
    try {
      const trimmedTitle = title.trim();
      const trimmedDesc = description.trim();
      console.log(`[Create] title="${trimmedTitle}" | voter=${voterId}`);
      await createFeature({
        title: trimmedTitle,
        description: trimmedDesc,
        voter_id: voterId,
        category_id: categoryId ?? '',
      });
      console.log(`[Create] Success — "${trimmedTitle}"`);
      router.back();
    } catch (e) {
      const msg =
        e instanceof Error
          ? e.message
          : typeof e === 'object' && e !== null && 'message' in e
          ? String((e as { message: unknown }).message)
          : 'Failed to submit. Please try again.';
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  if (voterLoading) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.label, { color: colors.label }]}>Title *</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: colors.inputBg, borderColor: titleError ? colors.error : colors.border, color: colors.text },
            ]}
            value={title}
            onChangeText={(t) => { setTitle(t); if (titleError) setTitleError(null); }}
            placeholder="e.g. Dark mode support"
            placeholderTextColor={colors.placeholder}
            maxLength={TITLE_MAX + 10}
            returnKeyType="next"
            editable={!submitting}
          />
          <View style={styles.row}>
            {titleError ? <Text style={[styles.fieldError, { color: colors.error }]}>{titleError}</Text> : <View />}
            <Text style={[styles.charCount, { color: colors.textMuted }]}>{title.trim().length}/{TITLE_MAX}</Text>
          </View>

          <Text style={[styles.label, styles.labelSpacing, { color: colors.label }]}>Description *</Text>
          <TextInput
            style={[
              styles.input, styles.textArea,
              { backgroundColor: colors.inputBg, borderColor: descError ? colors.error : colors.border, color: colors.text },
            ]}
            value={description}
            onChangeText={(t) => { setDescription(t); if (descError) setDescError(null); }}
            placeholder="Describe the feature and why it's valuable..."
            placeholderTextColor={colors.placeholder}
            multiline
            numberOfLines={5}
            maxLength={DESC_MAX + 10}
            returnKeyType="done"
            editable={!submitting}
          />
          <View style={styles.row}>
            {descError ? <Text style={[styles.fieldError, { color: colors.error }]}>{descError}</Text> : <View />}
            <Text style={[styles.charCount, { color: colors.textMuted }]}>{description.trim().length}/{DESC_MAX}</Text>
          </View>

          {submitError ? <Text style={[styles.submitError, { color: colors.error }]}>{submitError}</Text> : null}

          <Pressable
            style={[styles.submitButton, { backgroundColor: colors.primary }, submitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color={colors.onPrimary} />
            ) : (
              <Text style={[styles.submitText, { color: colors.onPrimary }]}>Submit Feature</Text>
            )}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 16, maxWidth: 672, width: '100%', alignSelf: 'center' },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  labelSpacing: { marginTop: 20 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15 },
  textArea: { minHeight: 110, textAlignVertical: 'top' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, minHeight: 18 },
  fieldError: { fontSize: 12, flex: 1 },
  charCount: { fontSize: 12, marginLeft: 8 },
  submitError: { fontSize: 14, textAlign: 'center', marginTop: 16, marginBottom: 4 },
  submitButton: { borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 28 },
  submitButtonDisabled: { opacity: 0.6 },
  submitText: { fontSize: 16, fontWeight: '700' },
});
