import * as React from "react";
import * as ReactDOM from "react-dom";

import App, { ProjectType } from "./App";

const newNode = document.createElement("span");
const ticket = document.getElementById("key-val")
  ? document.getElementById("key-val")
  : document.getElementById("issuekey-val");

const heading = document.getElementById("summary-val");
const description = `${
  ticket.innerText
    ? ticket.innerText
    : ticket.getElementsByTagName("a")[0].innerText
} ${heading.innerText}`;

ticket?.parentNode.insertBefore(newNode, ticket.nextSibling);

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const projectKey = urlParams.get("projectKey");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const project = request.projects.find((obj: ProjectType) => {
    return obj.project === projectKey;
  });

  ReactDOM.render(
    <App
      description={description}
      ticket={ticket?.innerText}
      project={project}
      projects={request.projects}
    />,
    newNode
  );
});
