import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SortFilterBar } from '../SortFilterBar';
import { AppThemeProvider } from '@/src/theme/ThemeContext';

function renderBar(overrides = {}) {
  const props = {
    activeSort: 'most_voted' as const,
    activeFilter: null,
    onSortChange: jest.fn(),
    onFilterChange: jest.fn(),
    ...overrides,
  };
  const result = render(<SortFilterBar {...props} />, {
    wrapper: ({ children }) => <AppThemeProvider>{children}</AppThemeProvider>,
  });
  return { ...result, props };
}

describe('SortFilterBar', () => {
  it('renders all sort options', () => {
    const { getByText } = renderBar();
    expect(getByText('Most Voted')).toBeTruthy();
    expect(getByText('Newest')).toBeTruthy();
    expect(getByText('Trending')).toBeTruthy();
  });

  it('renders all filter options', () => {
    const { getByText } = renderBar();
    expect(getByText('All')).toBeTruthy();
    expect(getByText('Requested')).toBeTruthy();
    expect(getByText('In Progress')).toBeTruthy();
    expect(getByText('Shipped')).toBeTruthy();
  });

  it('calls onSortChange when a sort chip is pressed', () => {
    const { getByText, props } = renderBar();
    fireEvent.press(getByText('Newest'));
    expect(props.onSortChange).toHaveBeenCalledWith('newest');
  });

  it('calls onFilterChange when a filter chip is pressed', () => {
    const { getByText, props } = renderBar();
    fireEvent.press(getByText('Shipped'));
    expect(props.onFilterChange).toHaveBeenCalledWith('shipped');
  });

  it('calls onFilterChange with null when All is pressed', () => {
    const { getByText, props } = renderBar({ activeFilter: 'requested' });
    fireEvent.press(getByText('All'));
    expect(props.onFilterChange).toHaveBeenCalledWith(null);
  });
});
