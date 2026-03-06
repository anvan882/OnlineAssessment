import React from 'react';
import { render } from '@testing-library/react-native';
import { StatusBadge } from '../StatusBadge';
import { AppThemeProvider } from '@/src/theme/ThemeContext';
import type { FeatureStatus } from '@/src/lib/features';

function renderBadge(status: FeatureStatus) {
  return render(<StatusBadge status={status} />, {
    wrapper: ({ children }) => <AppThemeProvider>{children}</AppThemeProvider>,
  });
}

describe('StatusBadge', () => {
  it('renders "Requested" for requested status', () => {
    const { getByText } = renderBadge('requested');
    expect(getByText('Requested')).toBeTruthy();
  });

  it('renders "In Progress" for in_progress status', () => {
    const { getByText } = renderBadge('in_progress');
    expect(getByText('In Progress')).toBeTruthy();
  });

  it('renders "Shipped" for shipped status', () => {
    const { getByText } = renderBadge('shipped');
    expect(getByText('Shipped')).toBeTruthy();
  });
});
