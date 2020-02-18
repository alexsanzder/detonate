import * as React from "react";
import { UseGoogleType } from "../hooks/useGoogleLogin";

const GoogleAuthContext = React.createContext<Partial<UseGoogleType>>({
  currentUser: undefined,
  isSignedIn: false,
  isInitialized: false,
  handleSignIn: null,
  handleSignOut: null
});

export default GoogleAuthContext;
