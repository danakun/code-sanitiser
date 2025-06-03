import { logo } from '../constants/assets.js';

/**
 * Renders the main application content
 * @returns {void}
 */
export function renderApp() {
  document.querySelector('#app').innerHTML = `
    <div>
      <a href="https://vitejs.dev" target="_blank">
        <img src="${logo.vite}" class="logo" alt="Vite logo" />
      </a>
      <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
        <img src="${logo.js}" class="logo vanilla" alt="JavaScript logo" />
      </a>
      <h1>Vanilla JS Template</h1>
      <div class="card">
        <button id="counter" type="button"></button>
      </div>
      <p class="read-the-docs">
        Click on the Vite logo to learn more
      </p>
    </div>
  `;
}