import React from 'react';
import {createRoot} from 'react-dom/client';
import { Provider } from 'react-redux'

import store from './editor/store';
import App from './editor/App';

const container = document.querySelector('#root');
const root = createRoot(container!);

root.render(
  <Provider store={store}>
    <App/>
  </Provider>
);