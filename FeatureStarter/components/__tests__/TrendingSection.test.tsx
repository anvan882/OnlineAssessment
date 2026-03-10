import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { TrendingSection } from '../TrendingSection';
import { AppThemeProvider } from '@/src/theme/ThemeContext';

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

// Mock useVoterId
jest.mock('@/src/hooks/useVoterId', () => ({
  useVoterId: () => ({ voterId: 'voter-1', loading: false }),
}));

// Mock MaterialIcons (used by StatusBadge indirectly — no-op needed)
jest.mock('@expo/vector-icons/MaterialIcons', () => {
  const { Text } = require('react-native');
  return function MockIcon({ name }: { name: string }) {
    return <Text>{name}</Text>;
  };
});

function renderSection() {
  return render(<TrendingSection />, {
    wrapper: ({ children }) => <AppThemeProvider>{children}</AppThemeProvider>,
  });
}

describe('TrendingSection', () => {
  it('renders the Trending heading', async () => {
    const { getByText } = renderSection();
    await waitFor(() => expect(getByText('Trending')).toBeTruthy());
  });

  it('renders feature cards', async () => {
    const { getAllByRole } = renderSection();
    await waitFor(() => {
      const buttons = getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  it('renders no more than 5 cards', async () => {
    const { getAllByRole } = renderSection();
    await waitFor(() => {
      const buttons = getAllByRole('button');
      expect(buttons.length).toBeLessThanOrEqual(5);
    });
  });
});
