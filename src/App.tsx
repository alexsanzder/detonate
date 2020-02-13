import React, { useState, useEffect } from "react";
import SheetProvider from "./SheetProvider";

import { Button, Navbar, Toolbar } from "sancho";
import "./App.css";

const App = () => {
  const [state, setstate] = useState({ signedIn: false });

  return (
    <SheetProvider>
      <div className="App"></div>
    </SheetProvider>
  );
};

export default App;
