import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Content from './Content';

import '../styles/tailwind.css';

const modalMountingPoint = document.createElement('div');
modalMountingPoint.setAttribute('id', 'detonate-modal');
document.querySelector('body').append(modalMountingPoint);

const mountingPoint = document.createElement('span');
mountingPoint.setAttribute('id', 'detonate-button');
mountingPoint.setAttribute('class', 'select-none fixed top-0 pt-3');

const observer = new MutationObserver((mutations: MutationRecord[], observer: MutationObserver) => {
  console.log(mutations);
  const targetNode =
    document.querySelector('.ghx-statistic-group') ||
    document.querySelector('.aui-nav-breadcrumbs'); //#key-val

  // (targetNode.parentNode as Element).insertBefore(mountingPoint, targetNode);
  (targetNode as Element).append(mountingPoint);
  ReactDOM.render(<Content />, mountingPoint);
  observer.disconnect();
});

const observedNodes = document.querySelectorAll(
  // "#summary-val, .ghx-detail-view-blanket"
  'body', // Board
);
observedNodes.forEach((observedNode) => {
  observer.observe(observedNode, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['value', 'data-issue-key', 'data-issuekey', 'style'],
    attributeOldValue: false,
  });
});

// chrome.runtime.onConnect.addListener((port) => {
//   port.onMessage.addListener((request) => {
//     const { message } = request;
//     if (message === 'complete') {
//       port.postMessage({ message: 'Content rendered!' });
//     }
//   });
// });
