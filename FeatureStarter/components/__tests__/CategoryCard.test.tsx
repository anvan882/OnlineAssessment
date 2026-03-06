import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { CategoryCard } from '../CategoryCard';
import type { Category } from '@/src/lib/categories';
import { AppThemeProvider } from '@/src/theme/ThemeContext';

function makeCategory(overrides: Partial<Category> = {}): Category {
  return {
    id: 'c1',
    name: 'Test Category',
    description: 'A test description',
    image: 'https://example.com/test.jpg',
    created_at: '2026-01-01T00:00:00Z',
    ...overrides,
  };
}

function renderCard(ui: React.ReactElement) {
  return render(ui, {
    wrapper: ({ children }) => <AppThemeProvider>{children}</AppThemeProvider>,
  });
}

describe('CategoryCard', () => {
  it('renders category name', async () => {
    const { getByText } = renderCard(
      <CategoryCard category={makeCategory()} onPress={() => {}} />
    );
    await waitFor(() => expect(getByText('Test Category')).toBeTruthy());
  });

  it('renders category description', async () => {
    const { getByText } = renderCard(
      <CategoryCard category={makeCategory()} onPress={() => {}} />
    );
    await waitFor(() => expect(getByText('A test description')).toBeTruthy());
  });

  it('calls onPress when pressed', async () => {
    const onPress = jest.fn();
    const { getByLabelText } = renderCard(
      <CategoryCard category={makeCategory()} onPress={onPress} />
    );
    await waitFor(() => expect(getByLabelText('Test Category')).toBeTruthy());
    fireEvent.press(getByLabelText('Test Category'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not crash when description is empty string', async () => {
    const { getByText } = renderCard(
      <CategoryCard category={makeCategory({ description: '' })} onPress={() => {}} />
    );
    await waitFor(() => expect(getByText('Test Category')).toBeTruthy());
  });

  it('renders the image element', async () => {
    const { UNSAFE_getByType } = renderCard(
      <CategoryCard category={makeCategory()} onPress={() => {}} />
    );
    const { Image } = require('react-native');
    await waitFor(() => expect(UNSAFE_getByType(Image)).toBeTruthy());
  });
});
