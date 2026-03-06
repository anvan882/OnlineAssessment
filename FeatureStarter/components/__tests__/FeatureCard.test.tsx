import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { FeatureCard } from '../FeatureCard';
import { AppThemeProvider } from '@/src/theme/ThemeContext';
import type { FeatureWithVotes } from '@/src/lib/features';

// Mock MaterialIcons to avoid native module issues in tests
jest.mock('@expo/vector-icons/MaterialIcons', () => {
  const { Text } = require('react-native');
  return function MockIcon({ name, ...props }: { name: string }) {
    return <Text {...props}>{name}</Text>;
  };
});

function makeItem(overrides: Partial<FeatureWithVotes> = {}): FeatureWithVotes {
  return {
    id: 'f1',
    title: 'Test Feature',
    description: 'A test description',
    status: 'requested',
    voter_id: 'v1',
    category_id: 'cat-1',
    created_at: '2026-01-01T00:00:00Z',
    upvotes_count: 5,
    downvotes_count: 2,
    score: 3,
    my_vote: 0,
    ...overrides,
  };
}

function renderCard(ui: React.ReactElement) {
  return render(ui, {
    wrapper: ({ children }) => <AppThemeProvider>{children}</AppThemeProvider>,
  });
}

describe('FeatureCard', () => {
  it('renders title and description', async () => {
    const { getByText } = renderCard(<FeatureCard item={makeItem()} />);
    await waitFor(() => expect(getByText('Test Feature')).toBeTruthy());
    expect(getByText('A test description')).toBeTruthy();
  });

  it('renders score', async () => {
    const { getByText } = renderCard(<FeatureCard item={makeItem({ score: 7 })} />);
    await waitFor(() => expect(getByText('7')).toBeTruthy());
  });

  it('renders vote counts', async () => {
    const { getByText } = renderCard(
      <FeatureCard item={makeItem({ upvotes_count: 10, downvotes_count: 3 })} />
    );
    await waitFor(() => expect(getByText(/10↑/)).toBeTruthy());
    expect(getByText(/3↓/)).toBeTruthy();
  });

  it('calls onVote with upvote when pressing up from neutral', async () => {
    const onVote = jest.fn();
    const { getByLabelText } = renderCard(
      <FeatureCard item={makeItem({ my_vote: 0 })} onVote={onVote} />
    );
    await waitFor(() => expect(getByLabelText('Upvote')).toBeTruthy());
    fireEvent.press(getByLabelText('Upvote'));
    expect(onVote).toHaveBeenCalledWith('f1', 1);
  });

  it('calls onVote with 0 (clear) when pressing up while already upvoted', async () => {
    const onVote = jest.fn();
    const { getByLabelText } = renderCard(
      <FeatureCard item={makeItem({ my_vote: 1 })} onVote={onVote} />
    );
    await waitFor(() => expect(getByLabelText('Upvote')).toBeTruthy());
    fireEvent.press(getByLabelText('Upvote'));
    expect(onVote).toHaveBeenCalledWith('f1', 0);
  });

  it('calls onVote with downvote when pressing down from neutral', async () => {
    const onVote = jest.fn();
    const { getByLabelText } = renderCard(
      <FeatureCard item={makeItem({ my_vote: 0 })} onVote={onVote} />
    );
    await waitFor(() => expect(getByLabelText('Downvote')).toBeTruthy());
    fireEvent.press(getByLabelText('Downvote'));
    expect(onVote).toHaveBeenCalledWith('f1', -1);
  });

  it('calls onVote with 0 (clear) when pressing down while already downvoted', async () => {
    const onVote = jest.fn();
    const { getByLabelText } = renderCard(
      <FeatureCard item={makeItem({ my_vote: -1 })} onVote={onVote} />
    );
    await waitFor(() => expect(getByLabelText('Downvote')).toBeTruthy());
    fireEvent.press(getByLabelText('Downvote'));
    expect(onVote).toHaveBeenCalledWith('f1', 0);
  });

  it('switches from downvote to upvote', async () => {
    const onVote = jest.fn();
    const { getByLabelText } = renderCard(
      <FeatureCard item={makeItem({ my_vote: -1 })} onVote={onVote} />
    );
    await waitFor(() => expect(getByLabelText('Upvote')).toBeTruthy());
    fireEvent.press(getByLabelText('Upvote'));
    expect(onVote).toHaveBeenCalledWith('f1', 1);
  });

  it('switches from upvote to downvote', async () => {
    const onVote = jest.fn();
    const { getByLabelText } = renderCard(
      <FeatureCard item={makeItem({ my_vote: 1 })} onVote={onVote} />
    );
    await waitFor(() => expect(getByLabelText('Downvote')).toBeTruthy());
    fireEvent.press(getByLabelText('Downvote'));
    expect(onVote).toHaveBeenCalledWith('f1', -1);
  });

  it('does not crash when onVote is not provided', async () => {
    const { getByLabelText } = renderCard(<FeatureCard item={makeItem()} />);
    await waitFor(() => expect(getByLabelText('Upvote')).toBeTruthy());
    expect(() => fireEvent.press(getByLabelText('Upvote'))).not.toThrow();
    expect(() => fireEvent.press(getByLabelText('Downvote'))).not.toThrow();
  });

  it('renders status badge', async () => {
    const { getByText } = renderCard(
      <FeatureCard item={makeItem({ status: 'shipped' })} />
    );
    await waitFor(() => expect(getByText('Shipped')).toBeTruthy());
  });

  it('renders status badge for in_progress', async () => {
    const { getByText } = renderCard(
      <FeatureCard item={makeItem({ status: 'in_progress' })} />
    );
    await waitFor(() => expect(getByText('In Progress')).toBeTruthy());
  });

  it('handles null/undefined counts gracefully', async () => {
    const item = makeItem({
      upvotes_count: undefined as unknown as number,
      downvotes_count: undefined as unknown as number,
      score: undefined as unknown as number,
    });
    const { getByText } = renderCard(<FeatureCard item={item} />);
    await waitFor(() => expect(getByText('0')).toBeTruthy());
  });
});
