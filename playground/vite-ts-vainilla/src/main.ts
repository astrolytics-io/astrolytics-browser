import Astrolytics from 'astrolytics-browser';
import './style.css';
import typescriptLogo from './typescript.svg';
import viteLogo from '/vite.svg'; // eslint-disable-line import/no-absolute-path
import { setupCounter } from './counter';

const APP_ID = '64b72d3576d14e90860b8956';

Astrolytics.init(APP_ID, {
  debug: true,
  endpoint: 'ws://localhost:3002',
  reportInterval: 4 * 1000,
  sessionTimeout: 1000 * 10,
});

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="flex flex-col items-center">
    <div class="flex flex-row items-center gap-x-4">
      <a href="https://vitejs.dev" target="_blank">
        <img src="${viteLogo}" class="logo" alt="Vite logo" />
      </a>
      <a href="https://www.typescriptlang.org/" target="_blank">
        <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
      </a>
    </div>
    <h1>Vite + TypeScript</h1>
    <span>
      tracking: <span class="text-green-400" id="tracking">enabled</span>
    </span>
    <div class="card grid gap-4 grid-cols-3">
      <button id="counter" type="button"></button>
      <button id="trackButton" type="button">Track Click</button>
      <button id="trackFooBar" type="button">Track Custom Foo Bar</button>
      <button id="trackFooBaz" type="button">Track Custom Foo Baz</button>
      <button id="trackError" type="button">Track Error</button>
      <button id="identify" type="button">Identify</button>
      <button id="trackPage" type="button">Track hypothetic pageview</button>
      <button
        class="bg-red-400 text-black hover:border border-black focus:ring-2 ring-black"
        id="disableTracking"
        type="button"
      >
        Disable tracking
      </button>
      <button
        class="bg-green-400 text-black hover:border border-black focus:ring-2 ring-black"
        id="enableTracking"
        type="button"
      >
        Enable tracking
      </button>
    </div>
    <a href="/my-page">Going to other pages will trigger pageview by default!</button>
    <p class="self-center text-center italic font-light text-sm text-gray-100">
      identify arguments: Astrolytics.identify('18710830', {
        email: 'ernest@astrolytics.io',
        firstName: 'Ernest',
        lastName: 'Rutherford'
      });
    </p>
  </div>
`;

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!);

document.querySelector<HTMLButtonElement>('#trackButton')!.addEventListener('click', () => {
  Astrolytics.track('click');
});

document.querySelector<HTMLButtonElement>('#trackFooBar')!.addEventListener('click', () => {
  Astrolytics.track('custom', { foo: 'bar' });
});

document.querySelector<HTMLButtonElement>('#trackFooBaz')!.addEventListener('click', () => {
  Astrolytics.track('custom', { foo: 'baz' });
});

document.querySelector<HTMLButtonElement>('#identify')!.addEventListener('click', () => {
  Astrolytics.identify('18710830', {
    email: 'ernest@astrolytics.io',
    firstName: 'Ernest',
    lastName: 'Rutherford',
  });
});

document.querySelector<HTMLButtonElement>('#trackPage')!.addEventListener('click', () => {
  Astrolytics.page('/blog', { scrollHeight: 1123 });
});

document.querySelector<HTMLButtonElement>('#disableTracking')!.addEventListener('click', () => {
  Astrolytics.disableTracking();
  document.querySelector<HTMLSpanElement>('#tracking')!.innerText = 'disabled';
  document.querySelector<HTMLSpanElement>('#tracking')!.classList.remove('text-green-400');
  document.querySelector<HTMLSpanElement>('#tracking')!.classList.add('text-red-400');
});

document.querySelector<HTMLButtonElement>('#enableTracking')!.addEventListener('click', () => {
  Astrolytics.enableTracking();
  document.querySelector<HTMLSpanElement>('#tracking')!.innerText = 'enabled';
  document.querySelector<HTMLSpanElement>('#tracking')!.classList.remove('text-red-400');
  document.querySelector<HTMLSpanElement>('#tracking')!.classList.add('text-green-400');
});

document.querySelector<HTMLButtonElement>('#trackError')!.addEventListener('click', () => {
  try {
    throw new Error('This is a handled test error');
  } catch (e) {
    Astrolytics.trackError(e);
  }

  throw new Error('This is an unhandled test error');
});
