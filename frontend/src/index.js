import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Playlists from './Playlists';
import reportWebVitals from './reportWebVitals';

const rootEl = document.getElementById('playlists');

if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <Playlists />
    </React.StrictMode>
  );
}

reportWebVitals();