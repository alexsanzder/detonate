import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Content from './Content';

const mountingPoint = document.createElement('span');
mountingPoint.setAttribute('id', 'ghx-detoante-button');

const scrapeIssueInfo = () => {
  // Jira Issue description
  const description = document.querySelector('#summary-val').innerHTML;

  // Jira Issue ticket
  const issuekey =
    (document.querySelector('#ghx-detail-issue') as HTMLDivElement) || //Board
    (document.querySelector('#comment') as HTMLDivElement);
  const ticket = issuekey && issuekey.dataset.issuekey;

  return { description: `${ticket} ${description}`, ticket };
};

const observer = new MutationObserver((mutations: MutationRecord[], observer: MutationObserver) => {
  console.log(mutations);
  const { description, ticket } = scrapeIssueInfo();
  const targetNode =
    document.querySelector('.ghx-statistic-group') ||
    document.querySelector('.aui-nav-breadcrumbs'); //#key-val

  // (targetNode.parentNode as Element).insertBefore(mountingPoint, targetNode);
  (targetNode as Element).append(mountingPoint);
  ReactDOM.render(<Content description={description} ticket={ticket} />, mountingPoint);
  observer.disconnect();
});

const observedNodes = document.querySelectorAll(
  // "#summary-val, .ghx-detail-view-blanket"
  '#ghx-detail-issue', // Board
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

// chrome.runtime.onConnect.addListener(port => {
//   port.onMessage.addListener(request => {
//     const { message } = request;
//     if (message === "complete") {
//       port.postMessage({ message: "Content rendered!" });
//     }
//   });
// });
