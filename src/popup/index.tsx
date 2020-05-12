import React from 'react';
import ReactDOM from 'react-dom';
import { browser } from 'webextension-polyfill-ts';
import GlobalStateProvider, { GlobalStateType } from '../store/GlobalStateProvider';

import Popup from './Popup';

import '../styles/tailwind.css';

browser.storage.local.get().then((items) => {
  ReactDOM.render(
    <GlobalStateProvider initialState={items as GlobalStateType}>
      <Popup />
    </GlobalStateProvider>,
    document.getElementById('root'),
  );
});
