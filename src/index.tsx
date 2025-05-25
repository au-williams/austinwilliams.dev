import { HashRouter, Routes, Route, Navigate } from 'react-router';
import { Provider } from 'react-redux';
import { RedirectPopupRoutes } from '@/config/app-config';
import { store } from './redux';
import App from './app/app';
import React from 'react';
import ReactDOM from 'react-dom/client';
import RouteConfig from './types/route-config';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import './index.scss';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <Provider store={store}>
    <HashRouter>
      <Routes>
        {/* Use 404 page as redirect applying /# to page URL */}
        {/* This is hacky but needed for clean sharable URLs */}
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/" element={<App />} />
        {/* Create the routes in /config/app-config.ts */}
        {RedirectPopupRoutes.map((route: RouteConfig) => (
          <Route
            key={route.key}
            path={route.path}
            element={
              <App
                redirectFavicon={route.favicon}
                redirectDestination={route.destination}
                redirectName={route.name}
                redirectShareLink={route.shareLink}
              />
            }
          />
        ))}
      </Routes>
    </HashRouter>
  </Provider>,
);
