/* global gapi */
import { useState, useEffect } from 'react';
import { useScript } from './useScript';

const GOOGLE_API_SOURCE = 'https://apis.google.com/js/api.js';

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
  spreadsheetId?: string | '1Lqm0iIOp5BYMtws8B5LOEy-wRC-fhOH6aPVFb5-N7Us';
}
export interface UseGoogleType {
  currentUser: any | undefined;
  isSignedIn: boolean;
  isInitialized: boolean;
  handleSignIn: () => Promise<void> | undefined;
  handleSignOut: () => Promise<void> | undefined;
  projects: string[];
  records: string[];
}

export const useGoogle = ({
  clientId,
  apiKey,
  scope,
  discoveryDocs,
  spreadsheetId,
}: UseGoogleOptions) => {
  const [isLoaded] = useScript(GOOGLE_API_SOURCE, 'gapi');
  const [GoogleAuth, setGoogleAuth] = useState();
  const [isInitialized, setInitialized] = useState(false);
  const [isSignedIn, setSignedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const [records, setRecords] = useState();
  const [projects, setProjects] = useState();

  const load = async () => {
    gapi.client.load('sheets', 'v4', async () => {
      const response = await gapi.client.sheets.spreadsheets.values.batchGet({
        spreadsheetId: '1aPo1wlEXueb6poGt7X3XjYVy-VPDaGJhOO5pNBMdl48',
        ranges: ['projects!A2:B', 'aSa!A2:G'],
      });
      const valueRanges = response.result.valueRanges;
      const projects = valueRanges && valueRanges[0].values;
      setProjects(projects);
      const records = valueRanges && valueRanges[1].values;
      setRecords(records);
    });
  };

  useEffect(() => {
    const initClient = async () => {
      await gapi.client.init({ apiKey, clientId, discoveryDocs, scope });
      setInitialized(true);
      const gAuth = gapi.auth2.getAuthInstance();
      setGoogleAuth(gAuth);

      const currentUser = gAuth.currentUser.get().getBasicProfile();
      setCurrentUser(currentUser);

      //Load spredsheet data
      load();
    };

    if (isLoaded) {
      gapi.load('client:auth2', initClient);
    }
  }, [clientId, apiKey, discoveryDocs, scope, isLoaded]);

  useEffect(() => {
    if (GoogleAuth) {
      GoogleAuth.isSignedIn.listen(async (signedIn: boolean) => {
        setSignedIn(signedIn);
        if (signedIn) {
          const profile = GoogleAuth.currentUser.get().getBasicProfile();
          setCurrentUser(profile);
          load();
        }
      });

      setSignedIn(GoogleAuth.isSignedIn.get());
    }
  }, [GoogleAuth]);

  const handleSignIn = async () => {
    await gapi.auth2.getAuthInstance().signIn();
  };

  const handleSignOut = async () => {
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
    isSignedIn,
    projects,
    records,
  };
};
