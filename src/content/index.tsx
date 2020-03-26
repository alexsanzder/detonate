import * as React from "react";
import * as ReactDOM from "react-dom";

import Content from "./Content";

const newNode = document.createElement("li");
newNode.setAttribute("class", "ghx-detoante-button");

const rafAsync = () => {
  return new Promise(resolve => {
    requestAnimationFrame(resolve); //faster than set time out
  });
};

const checkElement = async selector => {
  const querySelector = document.querySelector(selector);
  while (querySelector === null) {
    await rafAsync();
  }
  return querySelector;
};

checkElement(".aui-nav-breadcrumbs") //use whichever selector you want
  .then(element => {
    element.appendChild(newNode);

    const description = document.getElementById("summary-val").innerHTML;
    const ticket = document.getElementById("key-val").innerHTML;

    ReactDOM.render(
      <Content description={`${ticket} ${description}`} ticket={ticket} />,
      newNode
    );
  });
