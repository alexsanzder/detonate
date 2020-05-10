import React from 'react';
import ReactDOM from 'react-dom';
import GlobalStateProvider from '../store/GlobalStateProvider';

import Popup from './Popup';

import '../styles/tailwind.css';

ReactDOM.render(
  <GlobalStateProvider>
    <Popup />
  </GlobalStateProvider>,
  document.getElementById('root'),
);
