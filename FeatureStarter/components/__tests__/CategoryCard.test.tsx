import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { CategoryCard } from '../CategoryCard';
import type { Category } from '../CategoryCard';
import { AppThemeProvider } from '@/src/theme/ThemeContext';

// Mock MaterialIcons to avoid native module issues in tests
jest.mock('@expo/vector-icons/MaterialIcons', () => {
  const { Text } = require('react-native');
  return function MockIcon({ name, ...props }: { name: string }) {
    return <Text {...props}>{name}</Text>;
  };
});

function makeCategory(overrides: Partial<Category> = {}): Category {
  return {
    id: 'c1',
    name: 'Test Category',
    description: 'A test description',
    icon: 'star',
    icon_color: '#10B981',
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

  it('renders chevron icon', async () => {
    const { getByText } = renderCard(
      <CategoryCard category={makeCategory()} onPress={() => {}} />
    );
    await waitFor(() => expect(getByText('chevron-right')).toBeTruthy());
  });
});
