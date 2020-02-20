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
  projects: any;
  records: any;
}

export interface Record {
  id: string;
  name: string;
  date: string;
  company: string;
  project: string;
  description: string;
  ticket: string;
  time: string;
}

const tablName = 'aSa';

export const useGoogle = ({
  clientId,
  apiKey,
  scope,
  discoveryDocs,
  spreadsheetId,
}: UseGoogleOptions) => {
  const [isScriptLoaded] = useScript(GOOGLE_API_SOURCE, 'gapi');
  const [GoogleAuth, setGoogleAuth] = useState();
  const [isInitialized, setInitialized] = useState(false);
  const [isSignedIn, setSignedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const [records, setRecords] = useState();
  const [projects, setProjects] = useState();

  const parseProjects = (value: any, index: number) => {
    return {
      id: `${tablName}!A${index + 2}`,
      company: value[0],
      project: value[1],
    };
  };

  const parseRecords = (value: any, index: number) => {
    return {
      id: `${tablName}!A${index + 2}`,
      name: value[0],
      date: value[1],
      company: value[2],
      project: value[3],
      description: value[4],
      ticket: value[5],
      time: value[6],
    };
  };

  const groupBy = (array: any, key: any) => {
    return array.reduce((result: any, currentValue: string) => {
      // If an array already present for key, push it to the array. Else create an array and push the object
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
      );
      return result;
    }, {});
  };

  const loadTable = async () => {
    gapi.client.load('sheets', 'v4', async () => {
      const response = await gapi.client.sheets.spreadsheets.values.batchGet({
        spreadsheetId: '1aPo1wlEXueb6poGt7X3XjYVy-VPDaGJhOO5pNBMdl48',
        ranges: ['projects!A2:B', `${tablName}!A2:G`],
      });
      const valueRanges = response.result.valueRanges;
      const projects =
        valueRanges && valueRanges[0].values?.map(parseProjects).reverse();
      setProjects(groupBy(projects, 'company'));

      const records =
        valueRanges && valueRanges[1].values?.map(parseRecords).reverse();
      setRecords(groupBy(records, 'date'));
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
      loadTable();
    };

    if (isScriptLoaded) {
      gapi.load('client:auth2', initClient);
    }
  }, [clientId, apiKey, discoveryDocs, scope, isScriptLoaded]);

  useEffect(() => {
    if (GoogleAuth) {
      GoogleAuth.isSignedIn.listen(async (signedIn: boolean) => {
        setSignedIn(signedIn);
        if (signedIn) {
          const profile = GoogleAuth.currentUser.get().getBasicProfile();
          setCurrentUser(profile);

          //Load spredsheet data
          loadTable();
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
