import * as React from "react";

export const GoogleContext = React.createContext({
  isAuthorized: false,
  googleUser: undefined
});
