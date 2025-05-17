import { BrowserRouter, Routes, Route } from 'react-router';
import { ExternalLinks } from '@/config/app-config';
import { Provider } from 'react-redux';
import { store } from './redux';
import App from './app/app';
import React from 'react';
import ReactDOM from 'react-dom/client';
import PageRedirect from './components/page-redirect/page-redirect';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import './index.scss';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/linkedin" element={<PageRedirect href={ExternalLinks.LINKEDIN} />} />
        <Route path="/resume" element={<PageRedirect href={ExternalLinks.RESUME} />} />
      </Routes>
    </BrowserRouter>
  </Provider>,
);
