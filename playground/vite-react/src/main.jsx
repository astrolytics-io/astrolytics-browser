import Astrolytics from 'astrolytics-browser';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App.jsx';
import MyPage from './pages/MyPage.jsx';
import './index.css';

const APP_ID = '64b831f52e614c4ac76b4684';

Astrolytics.init(APP_ID, {
  debug: true,
  endpoint: 'ws://localhost:3002',
  reportInterval: 4 * 1000,
  sessionTimeout: 1000 * 10,
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/my-page" element={<MyPage />} />
      </Routes>
    </Router>
  </React.StrictMode>,
);
