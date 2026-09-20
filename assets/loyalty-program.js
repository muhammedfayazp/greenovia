/**
 * Handles the "copy code" buttons on the loyalty program page.
 */

const COPIED_DISPLAY_DURATION = 2000;

document.addEventListener('click', (event) => {
  const button = /** @type {HTMLElement | null} */ (event.target)?.closest('[data-copy-code]');
  if (!(button instanceof HTMLElement)) return;

  const code = button.dataset.copyCode;
  if (!code) return;

  navigator.clipboard
    ?.writeText(code)
    .then(() => {
      const copiedLabel = button.dataset.copiedLabel || 'Copied!';
      const copyLabel = button.dataset.copyLabel || button.textContent || '';
      const previousTimeoutId = button.dataset.copyTimeoutId;

      if (previousTimeoutId) clearTimeout(Number(previousTimeoutId));

      button.textContent = copiedLabel;
      button.classList.add('is-copied');

      const timeoutId = setTimeout(() => {
        button.textContent = copyLabel;
        button.classList.remove('is-copied');
      }, COPIED_DISPLAY_DURATION);

      button.dataset.copyTimeoutId = String(timeoutId);
    })
    .catch((error) => {
      console.error('Failed to copy loyalty code:', error);
    });
});
