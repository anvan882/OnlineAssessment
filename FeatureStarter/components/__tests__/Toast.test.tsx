import React from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import { Toast } from '../Toast';
import { AppThemeProvider } from '@/src/theme/ThemeContext';

jest.useFakeTimers();

function renderToast(props: React.ComponentProps<typeof Toast>) {
  return render(<Toast {...props} />, {
    wrapper: ({ children }) => <AppThemeProvider>{children}</AppThemeProvider>,
  });
}

describe('Toast', () => {
  it('renders nothing when message is null', () => {
    const { queryByText } = renderToast({ message: null, onDismiss: jest.fn() });
    expect(queryByText(/.+/)).toBeNull();
  });

  it('renders the message when provided', () => {
    const { getByText } = renderToast({ message: 'Vote saved!', onDismiss: jest.fn() });
    expect(getByText('Vote saved!')).toBeTruthy();
  });

  it('calls onDismiss after the timeout', async () => {
    const onDismiss = jest.fn();
    renderToast({ message: 'Done!', onDismiss });
    expect(onDismiss).not.toHaveBeenCalled();
    act(() => { jest.advanceTimersByTime(2500); });
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('does not call onDismiss before the timeout', () => {
    const onDismiss = jest.fn();
    renderToast({ message: 'Wait...', onDismiss });
    act(() => { jest.advanceTimersByTime(1000); });
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('clears timer when message becomes null', () => {
    const onDismiss = jest.fn();
    const { rerender } = renderToast({ message: 'Hello', onDismiss });
    rerender(
      <AppThemeProvider>
        <Toast message={null} onDismiss={onDismiss} />
      </AppThemeProvider>
    );
    act(() => { jest.advanceTimersByTime(3000); });
    expect(onDismiss).not.toHaveBeenCalled();
  });
});
