import * as React from "react";
import { UseGoogleType } from "../hooks/useGoogle";

const GoogleAuthContext = React.createContext<Partial<UseGoogleType>>({
  currentUser: undefined,
  isSignedIn: false,
  isInitialized: false,
  handleSignIn: undefined,
  handleSignOut: undefined,
  projects: undefined,
  records: undefined,
  tickets: undefined,
  loadTable: undefined,
  appendRecord: undefined,
  updateRecord: undefined,
  deleteRecord: undefined
});

export default GoogleAuthContext;
