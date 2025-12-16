# SoundShare Frontend Tests

This directory contains Playwright end-to-end tests for the SoundShare frontend application.

## Prerequisites

Ensure you have installed the project dependencies:

```bash
npm install
```

## Running Tests

### Run All Tests
To run all tests in headless mode:
```bash
npx playwright test
```

### Run Specific Test File
To run a specific test suite (e.g., player tests):
```bash
npx playwright test tests/player.spec.js
```

### Run in UI Mode
To run tests with the interactive UI runner:
```bash
npx playwright test --ui
```

### View Report
To view the HTML report of the last test run:
```bash
npx playwright show-report
```

## Test Structure

- **navigation.spec.js**: Covers generic UI elements, sidebar navigation, search bar visibility, and responsiveness.
- **player.spec.js**: Covers audio playback functionality, including play/pause, volume control, and progress indication.
- **tracks.spec.js**: Covers track listing, detailed views (card details), search functionality, and filtering.
- **actions.spec.js**: Covers user actions such as Liking tracks and validates handling of static assets (images).

## Note
Some tests (TC-12, TC-13, TC-17) are marked as skipped as the corresponding features are not yet implemented in the frontend.
