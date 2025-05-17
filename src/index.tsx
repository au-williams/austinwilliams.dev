import { HashRouter, Routes, Route } from 'react-router';
import { Provider } from 'react-redux';
import { RedirectRoutes } from '@/config/app-config';
import { store } from './redux';
import App from './app/app';
import React from 'react';
import ReactDOM from 'react-dom/client';
import PageRedirect from './components/page-redirect/page-redirect';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import './index.scss';

/**
 * Get a mapped Route and PageRedirect component for the RedirectRoute key.
 * @param {string} key
 * @returns {React.ReactElement}
 */
const mapRedirectRoute = (key: string): React.ReactElement =>
  <Route path={key} element={<PageRedirect href={RedirectRoutes[key]} />} />

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <Provider store={store}>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        {Object.keys(RedirectRoutes).map(mapRedirectRoute)}
      </Routes>
    </HashRouter>
  </Provider>
);
