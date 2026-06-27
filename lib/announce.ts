/**
 * Announces a message to screen readers via the global aria-live region.
 *
 * Clears the region first to ensure repeated identical messages are re-announced.
 * Requires an element with `id="announcer"` and `aria-live="polite"` to be mounted in the DOM.
 *
 * @example
 * announce("Link copied to clipboard");
 * announce(`Switched to ${theme} mode`);
 */
export function announce(message: string) {
  const element = document.getElementById("announcer");

  if (!element) return;

  element.textContent = "";
  requestAnimationFrame(() => {
    element.textContent = message;
  });
}
