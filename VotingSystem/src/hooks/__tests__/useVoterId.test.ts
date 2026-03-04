import { renderHook, waitFor } from '@testing-library/react-native';
import { Platform } from 'react-native';

// Mock expo-crypto
jest.mock('expo-crypto', () => ({
  randomUUID: jest.fn(() => 'mock-uuid-1234'),
}));

// Provide a fake localStorage for the web code path
const store: Record<string, string> = {};
const fakeLocalStorage = {
  getItem: jest.fn((key: string): string | null => store[key] ?? null),
  setItem: jest.fn((key: string, val: string) => { store[key] = val; }),
  removeItem: jest.fn((key: string) => { delete store[key]; }),
  clear: jest.fn(() => { Object.keys(store).forEach((k) => delete store[k]); }),
};
Object.defineProperty(globalThis, 'localStorage', { value: fakeLocalStorage, writable: true });

// Use web platform so the hook uses localStorage
const originalOS = Platform.OS;
beforeAll(() => {
  Object.defineProperty(Platform, 'OS', { value: 'web', writable: true });
});
afterAll(() => {
  Object.defineProperty(Platform, 'OS', { value: originalOS, writable: true });
});

beforeEach(() => {
  jest.clearAllMocks();
  // Clear fake storage
  Object.keys(store).forEach((k) => delete store[k]);
});

// Import after mocks are set up
import { useVoterId } from '../useVoterId';

describe('useVoterId', () => {
  it('returns existing voter ID from storage', async () => {
    store['voter_id'] = 'existing-id';

    const { result } = renderHook(() => useVoterId());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.voterId).toBe('existing-id');
    expect(fakeLocalStorage.setItem).not.toHaveBeenCalled();
  });

  it('generates and stores new ID when none exists', async () => {
    const { result } = renderHook(() => useVoterId());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.voterId).toBe('mock-uuid-1234');
    expect(fakeLocalStorage.setItem).toHaveBeenCalledWith('voter_id', 'mock-uuid-1234');
  });

  it('starts with loading true and voterId null', () => {
    const { result } = renderHook(() => useVoterId());

    expect(result.current.loading).toBe(true);
    expect(result.current.voterId).toBeNull();
  });

  it('falls back to in-memory ID when storage fails', async () => {
    fakeLocalStorage.getItem.mockImplementation(() => {
      throw new Error('Storage unavailable');
    });

    const { result } = renderHook(() => useVoterId());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.voterId).toBe('mock-uuid-1234');
  });
});
