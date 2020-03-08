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
  loadTable: () => Promise<void> | undefined;
  appendRecord: (record: string[]) => Promise<any> | undefined;
  updateRecord: (
    range: string,
    record: (string | number | null)[]
  ) => Promise<any> | undefined;
  sheetProperties: any;
}

export interface Record {
  id: string;
  name: string;
  date: string;
  company: string;
  project: string;
  description: string;
  ticket: string;
  time: number;
}

export interface Project {
  id: string;
  company: string;
  project: string;
}

const tablName = 'aSa';

export const useGoogle = ({
  clientId,
  apiKey,
  scope,
  discoveryDocs,
}: UseGoogleOptions): Partial<UseGoogleType> => {
  const [isScriptLoaded] = useScript(GOOGLE_API_SOURCE, 'gapi');
  const [GoogleAuth, setGoogleAuth] = useState();
  const [isInitialized, setInitialized] = useState(false);
  const [isSignedIn, setSignedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const [records, setRecords] = useState();
  const [projects, setProjects] = useState();
  const [sheetProperties, setSheetProperties] = useState();

  const parseProjects = (value: any[], index: number): Project => {
    return {
      id: `${tablName}!A${index + 2}`,
      company: value[0],
      project: value[1],
    };
  };

  const parseRecords = (value: any[], index: number): Record => {
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

  const loadTable = async (): Promise<void> => {
    gapi.client.load('sheets', 'v4', async () => {
      const request = {
        // The spreadsheet to request.
        spreadsheetId: '1aPo1wlEXueb6poGt7X3XjYVy-VPDaGJhOO5pNBMdl48', // TODO: Update placeholder value.

        resource: {
          dataFilters: [
            {
              a1Range: tablName,
            },
          ],

          includeGridData: false,
        },
      };

      const sheetProperties = await gapi.client.sheets.spreadsheets.getByDataFilter(
        request
      );
      const properties =
        sheetProperties.result.sheets &&
        sheetProperties.result.sheets[0].properties;
      setSheetProperties(properties);

      const rowCount = properties?.gridProperties?.rowCount;
      const response = await gapi.client.sheets.spreadsheets.values.batchGet({
        spreadsheetId: '1aPo1wlEXueb6poGt7X3XjYVy-VPDaGJhOO5pNBMdl48',
        valueRenderOption: 'UNFORMATTED_VALUE',
        dateTimeRenderOption: 'FORMATTED_STRING',
        majorDimension: 'ROWS',
        ranges: [
          'projects!A2:B',
          `${tablName}!A${rowCount && rowCount - 20}:G`,
        ],
      });

      const valueRanges = response.result.valueRanges;
      const projects =
        valueRanges &&
        valueRanges[0].values &&
        valueRanges[0].values.map(parseProjects).reverse();
      setProjects(projects);

      const records =
        valueRanges &&
        valueRanges[1].values &&
        valueRanges[1].values
          .map(parseRecords)
          .reverse()
          .filter(record => record.time !== undefined);
      setRecords(records);
    });
  };

  useEffect(() => {
    const initClient = async (): Promise<void> => {
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

  const handleSignIn = async (): Promise<void> => {
    await gapi.auth2.getAuthInstance().signIn();
  };

  const handleSignOut = async (): Promise<void> => {
    gapi.auth2.getAuthInstance().signOut();
    //gapi.auth2.getAuthInstance().disconnect();
  };

  const appendRecord = async (record: string[]) => {
    return await gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: '1aPo1wlEXueb6poGt7X3XjYVy-VPDaGJhOO5pNBMdl48',
      range: `${tablName}!A2:G2`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [record],
      },
    });
  };

  const updateRecord = async (
    range: string,
    record: (string | number | null)[]
  ): Promise<any> => {
    return await gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: '1aPo1wlEXueb6poGt7X3XjYVy-VPDaGJhOO5pNBMdl48',
      range: range,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [record],
      },
    });
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
    loadTable,
    appendRecord,
    updateRecord,
    sheetProperties,
  };
};
