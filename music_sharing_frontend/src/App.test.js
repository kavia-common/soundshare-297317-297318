import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders SoundShare shell", () => {
  render(<App />);
  expect(screen.getByText(/SoundShare/i)).toBeInTheDocument();
});
