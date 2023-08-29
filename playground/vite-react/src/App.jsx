import Astrolytics from 'astrolytics-browser';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg'; // eslint-disable-line import/no-absolute-path
import './App.css';
import './index.css';

function App() {
  const [count, setCount] = useState(0);
  const [trackingEnabled, setTrackingEnabled] = useState(true);

  function trackClick() {
    if (trackingEnabled) {
      Astrolytics.track('click');
      toast.success('Tracked click', { position: 'top-right' });
    }
  }

  function trackWithMetadata(val) {
    if (!trackingEnabled) return;

    Astrolytics.track('custom', { foo: val });
    toast.success(`Tracked custom event with { foo: "${val}" } metadata`, { position: 'top-right' });
  }

  function identify() {
    Astrolytics.identify('18710830', {
      email: 'ernest@astrolytics.io',
      firstName: 'Ernest',
      lastName: 'Rutherford',
    });

    toast.success('Identified user with ID 18710830', { position: 'top-right' });
  }

  function pageview() {
    if (!trackingEnabled) return;

    Astrolytics.page('/blog', { scrollHeight: 1123 });
    toast.success('Tracked pageview for /blog', { position: 'top-right' });
  }

  function disableTracking() {
    Astrolytics.disableTracking();
    toast.success('Disabled tracking', { position: 'top-right' });
    setTrackingEnabled(false);
  }

  function enableTracking() {
    Astrolytics.enableTracking();
    toast.success('Enabled tracking', { position: 'top-right' });
    setTrackingEnabled(true);
  }

  function throwError() {
    toast.error('This is an unhandled test error', { position: 'top-right' });
    throw new Error('This is an unhandled test error');
  }

  return (
    <>
      <Toaster />
      <div className='flex flex-col my-12 items-center gap-y-12'>
        <div className='flex flex-row gap-x-12 items-center'>
          <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
            <img src={viteLogo} className="w-32" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" rel="noreferrer">
            <img src={reactLogo} className="w-32" alt="React logo" />
          </a>
        </div>
        <h1 className='text-xl font-medium'>Vite + React</h1>
        <p className={`${trackingEnabled ? 'text-green-400' : 'text-red-400'}`}>
          Tracking {trackingEnabled ? 'enabled' : 'disabled'}.
        </p>
        <div className="grid grid-cols-3 gap-4">
          <button onClick={() => setCount((value) => value + 1)}>
            count is {count}
          </button>
          <button onClick={() => trackClick()}>
            Track click
          </button>
          <button onClick={() => trackWithMetadata('bar')}>
            Track foo: bar
          </button>
          <button onClick={() => trackWithMetadata('baz')}>
            Track foo: baz
          </button>
          <button onClick={() => identify()}>
            Identify user
          </button>
          <button onClick={() => pageview()}>
            Simulate page navigation
          </button>
          <button onClick={() => disableTracking()} className="bg-red-500 text-white">
            Disable tracking
          </button>
          <button onClick={() => enableTracking()} className="bg-blue-500 text-white">
            Enable tracking
          </button>
          <button onClick={() => throwError()} className="bg-red-500 text-white">
            Throw error
          </button>
        </div>
        <Link
          to="/my-page"
          className="read-the-docs"
        >
          Navigate to /my-page
        </Link>
      </div>
    </>
  );
}

export default App;
