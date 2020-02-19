/* global gapi */
import { useState, useEffect } from "react";
import { useScript } from "./useScript";

const GOOGLE_API_SOURCE = "https://apis.google.com/js/api.js";

export interface GoogleUser extends gapi.auth2.GoogleUser {
  googleId?: string;
  tokenObj?: gapi.auth2.AuthResponse;
  tokenId?: string;
  accessToken?: string;
}
export interface UseGoogleOptions {
  clientId?: string | undefined;
  apiKey?: string | undefined;
  scope?: string | undefined;
  discoveryDocs?: string[] | undefined;
}
export interface UseGoogleType {
  currentUser: any | undefined;
  isSignedIn: boolean;
  isInitialized: boolean;
  handleSignIn: () => Promise<void> | undefined;
  handleSignOut: () => void | undefined;
}

export const useGoogleLogin = ({
  clientId,
  apiKey,
  scope,
  discoveryDocs
}: UseGoogleOptions) => {
  const [isLoaded] = useScript(GOOGLE_API_SOURCE, "gapi");
  const [isInitialized, setInitialized] = useState(false);
  const [isSignedIn, setSignedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    const initClient = async () => {
      await gapi.client.init({
        apiKey,
        clientId,
        discoveryDocs,
        scope
      });
      setInitialized(true);
      const gAuth = gapi.auth2.getAuthInstance();
      gAuth.isSignedIn.listen(setSignedIn);
      // Handle the initial sign-in state.
      setSignedIn(gAuth.isSignedIn.get());
      const currentUser = gAuth.currentUser.get().getBasicProfile();
      setCurrentUser(currentUser);
    };

    if (isLoaded) {
      gapi.load("client:auth2", initClient);
    }
  }, [clientId, apiKey, discoveryDocs, scope, isLoaded]);

  const handleSignIn = async () => {
    const gAuth = gapi.auth2.getAuthInstance();
    await gAuth.signIn();
  };

  const handleSignOut = () => {
    gapi.auth2.getAuthInstance().signOut();
    //gapi.auth2.getAuthInstance().disconnect();
  };

  if (!isInitialized) {
    return { isInitialized };
  }

  return {
    handleSignIn,
    handleSignOut,
    currentUser,
    isInitialized,
    isSignedIn
  };
};
