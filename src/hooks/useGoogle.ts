/* global gapi */
import { useState, useEffect } from "react";
import { useScript } from "./useScript";

const GOOGLE_API_SOURCE = "https://apis.google.com/js/api.js";

export interface UseGoogleOptions {
  scope?: string | undefined;
  discoveryDocs?: string[] | undefined;
}

export const useGoogle = ({ scope, discoveryDocs }: UseGoogleOptions): any => {
  const [isLoaded] = useScript(GOOGLE_API_SOURCE, "gapi");
  const [isInitialized, setInitialized] = useState(false);
  const [isAuthorized, setAuthorized] = useState(false);
  const [googleUser, setGoogleUser] = useState();

  useEffect(() => {
    const initClient = async () => {
      await gapi.client.init({
        apiKey: process.env.REACT_APP_GOOGLE_APP_ID,
        clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        discoveryDocs,
        scope
      });
      setInitialized(true);
      const GoogleAuth = gapi.auth2.getAuthInstance();
      GoogleAuth.isSignedIn.listen(signedIn => {
        setAuthorized(signedIn);
      });
      const currentUser = GoogleAuth.currentUser.get();
      setAuthorized(currentUser.isSignedIn());
      setGoogleUser(currentUser.getBasicProfile());
    };

    if (isLoaded) {
      gapi.load("client:auth2", initClient);
    }
  }, [discoveryDocs, isLoaded, scope]);

  if (!isInitialized) {
    return { isInitialized };
  }

  return {
    isInitialized,
    isAuthorized,
    googleUser,
    signIn: gapi.auth2.getAuthInstance().signIn,
    signOut: gapi.auth2.getAuthInstance().signOut,
    client: gapi.client
  };
};
