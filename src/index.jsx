import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/app';
import './index.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
