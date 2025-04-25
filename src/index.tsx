import { Provider } from 'react-redux';
import { store } from './stores';
import App from './app/app';
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import './index.scss';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<Provider store={store}><App /></Provider>);
