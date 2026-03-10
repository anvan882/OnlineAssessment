# FeatureStarter

A cross-platform feature request voting app built with React Native, Expo, and TypeScript. Users browse categories, view and create feature requests, and vote on them.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- npm (comes with Node.js)
- For Android: [Android Studio](https://developer.android.com/studio) with an emulator configured
- For iOS: Xcode (macOS only)
- Or use [Expo Go](https://expo.dev/go) on a physical device

## Installation

1. Clone the repository

   ```bash
   git clone <your-repo-url>
   cd FeatureStarter
   ```

2. Install dependencies

   ```bash
   npm install
   ```

## Running the App

Start the Expo development server:

```bash
npx expo start
```

Then choose a platform:

| Platform | Command | Notes |
|----------|---------|-------|
| Web | Press `w` in terminal | Opens in your browser |
| Android | Press `a` in terminal | Requires Android emulator running |
| iOS | Press `i` in terminal | Requires Xcode (macOS only) |
| Expo Go | Scan QR code | On a physical device |

You can also start directly on a specific platform:

```bash
npm run web       # Start on web
npm run android   # Start on Android emulator
npm run ios       # Start on iOS simulator
```

## Running Tests

```bash
npm test
```

This runs the full test suite (101 tests across 14 test files) covering unit tests for business logic and component tests for UI.

## Project Structure

```
app/                  # Screens (file-based routing via Expo Router)
  index.tsx           # Home — browse categories
  category/[id].tsx   # Category detail — feature list with sort/filter/search
  feature/[id].tsx    # Feature detail — full info + voting
  create.tsx          # Create feature request (modal)
components/           # Reusable UI components
src/
  lib/                # Business logic, types, mock data
  hooks/              # Custom hooks (useVoterId)
  theme/              # Dark theme colors and context
```

## Tech Stack

- **Framework:** React Native + Expo (managed workflow)
- **Language:** TypeScript
- **Navigation:** Expo Router (file-based)
- **State:** React Context + hooks — Redux was intentionally avoided since the app only shares a theme and a voter ID globally; all other state is local to each screen. Context + hooks keeps the codebase simple with zero boilerplate. If the app scaled to many shared global states (e.g., cached feature lists, user profiles, notification counts), a lightweight library like Zustand or Redux Toolkit would help avoid prop drilling and unnecessary re-renders from Context updates.
- **Storage:** AsyncStorage (native) / localStorage (web)
- **Testing:** Jest + React Testing Library
