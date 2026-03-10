import { timeAgo } from '../timeAgo';

function isoSecondsAgo(n: number) {
  return new Date(Date.now() - n * 1000).toISOString();
}

describe('timeAgo', () => {
  it('returns "just now" for less than 60 seconds ago', () => {
    expect(timeAgo(isoSecondsAgo(30))).toBe('just now');
  });

  it('returns "just now" for 0 seconds ago', () => {
    expect(timeAgo(new Date().toISOString())).toBe('just now');
  });

  it('returns minutes for 1–59 minutes ago', () => {
    expect(timeAgo(isoSecondsAgo(60))).toBe('1m ago');
    expect(timeAgo(isoSecondsAgo(90))).toBe('1m ago');
    expect(timeAgo(isoSecondsAgo(59 * 60))).toBe('59m ago');
  });

  it('returns hours for 1–23 hours ago', () => {
    expect(timeAgo(isoSecondsAgo(60 * 60))).toBe('1h ago');
    expect(timeAgo(isoSecondsAgo(23 * 60 * 60))).toBe('23h ago');
  });

  it('returns days for 1–29 days ago', () => {
    expect(timeAgo(isoSecondsAgo(24 * 60 * 60))).toBe('1d ago');
    expect(timeAgo(isoSecondsAgo(29 * 24 * 60 * 60))).toBe('29d ago');
  });

  it('returns months for 1–11 months ago', () => {
    expect(timeAgo(isoSecondsAgo(30 * 24 * 60 * 60))).toBe('1mo ago');
    expect(timeAgo(isoSecondsAgo(11 * 30 * 24 * 60 * 60))).toBe('11mo ago');
  });

  it('returns years for 12+ months ago', () => {
    expect(timeAgo(isoSecondsAgo(12 * 30 * 24 * 60 * 60))).toBe('1y ago');
    expect(timeAgo(isoSecondsAgo(24 * 30 * 24 * 60 * 60))).toBe('2y ago');
  });
});
