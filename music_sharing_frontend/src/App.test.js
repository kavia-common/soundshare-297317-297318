import { render, screen, fireEvent, act } from "@testing-library/react";
import App from "./App";

/**
 * Minimal Audio mock for jsdom tests.
 * We only implement what the player uses:
 * - play(), pause(), load()
 * - paused, src, currentTime, duration
 * - add/removeEventListener for play/pause events
 */
class MockAudio {
  constructor() {
    this.preload = "";
    this.src = "";
    this.currentTime = 0;
    this.duration = 120;
    this.volume = 1;
    this.muted = false;
    this.playbackRate = 1;

    this._paused = true;
    this._listeners = {};
  }

  get paused() {
    return this._paused;
  }

  addEventListener(type, cb) {
    this._listeners[type] = this._listeners[type] || new Set();
    this._listeners[type].add(cb);
  }

  removeEventListener(type, cb) {
    this._listeners[type]?.delete(cb);
  }

  _emit(type) {
    for (const cb of this._listeners[type] || []) cb();
  }

  load() {
    // no-op for tests
  }

  play() {
    this._paused = false;
    this._emit("play");
    return Promise.resolve();
  }

  pause() {
    this._paused = true;
    this._emit("pause");
  }
}

test("renders SoundShare shell", () => {
  render(<App />);
  expect(screen.getByText(/SoundShare/i)).toBeInTheDocument();
});

test("play/pause toggles and pauses reliably", async () => {
  // Use a single audio instance so we can assert calls across toggles.
  const audioInstance = new MockAudio();
  const pauseSpy = jest.spyOn(audioInstance, "pause");

  // jsdom doesn't provide `Audio`, so the app must use our mock.
  global.Audio = jest.fn(() => audioInstance);

  render(<App />);

  // Start playback by clicking a track play button (from Home).
  const trackPlay = screen.getAllByRole("button", { name: /Play/i })[0];
  await act(async () => {
    fireEvent.click(trackPlay);
  });

  // Dock button should now be "Pause".
  const dockPause = await screen.findByRole("button", { name: "Pause" });

  // Click pause and ensure HTMLAudioElement.pause() is invoked
  fireEvent.click(dockPause);
  expect(pauseSpy).toHaveBeenCalled();

  // UI should switch back to "Play"
  await screen.findByRole("button", { name: "Play" });
});
