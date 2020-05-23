import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { browser } from 'webextension-polyfill-ts';

import Content from './Content';

import { scrapeIssueInfo } from '../utils/scrapeIssueInfo';
import '../styles/tailwind.css';

const modalMountingPoint = document.createElement('div');
modalMountingPoint.setAttribute('id', 'detonate-modal');
document.querySelector('body').append(modalMountingPoint);

const render = (tab): void => {
  const { description, project, ticket, contentMountingPoint, targetNode } = scrapeIssueInfo(
    'JIRA',
    tab,
  );
  (targetNode as Element).append(contentMountingPoint);
  ReactDOM.render(
    <Content description={description} project={project} ticket={ticket} />,
    contentMountingPoint,
  );
};

const observe = (tab) => {
  const observer = new MutationObserver(
    (mutations: MutationRecord[], observer: MutationObserver) => {
      render(tab);
      observer.disconnect();
    },
  );

  const observedNode = document.querySelector('.ghx-detail-view-blanket');
  observer.observe(observedNode, {
    // subtree: true,
    // childList: true,
    attributes: true,
    attributeFilter: ['style'],
    attributeOldValue: false,
  });
};

browser.runtime.onMessage.addListener(({ response, tab }, sender) => {
  // listen for messages sent from background.js
  console.log(response);
  switch (response) {
    case 'COMPLETE':
      render(tab);
      break;
    case 'LOADING':
      ReactDOM.unmountComponentAtNode(document.querySelector('#detonate-button'));
      break;
    case 'CHANGE_URL':
      observe(tab);
      break;
    default:
      break;
  }
});
