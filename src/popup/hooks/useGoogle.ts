/* global gapi */
import { useCallback, useState, useEffect } from "react";
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
  spreadsheetId: string;
  tableName: string;
}
export interface UseGoogleType {
  currentUser: any | undefined;
  isSignedIn: boolean;
  isInitialized: boolean;
  handleSignIn: () => Promise<void> | undefined;
  handleSignOut: () => Promise<void> | undefined;
  projects: any;
  records: any;
  tickets: any;
  loadTable: () => Promise<void> | undefined;
  addProject: (project: string[]) => Promise<any> | undefined;
  addRecord: (record: string[]) => Promise<any> | undefined;
  updateRecord: (
    range: string,
    record: (string | number | null)[]
  ) => Promise<any> | undefined;
  deleteRecord: (index: number) => Promise<string> | undefined;
  sheetProperties: any;
}
export interface RecordType {
  id?: string;
  name?: string;
  date?: string;
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

export const useGoogle = ({
  clientId,
  apiKey,
  scope,
  discoveryDocs,
  spreadsheetId,
  tableName
}: UseGoogleOptions): Partial<UseGoogleType> => {
  const [isScriptLoaded] = useScript(GOOGLE_API_SOURCE, "gapi");
  const [GoogleAuth, setGoogleAuth] = useState<any | undefined>();
  const [isInitialized, setInitialized] = useState<boolean>(false);
  const [isSignedIn, setSignedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any | undefined>();
  const [records, setRecords] = useState<any | undefined>();
  const [projects, setProjects] = useState<any | undefined>();
  const [tickets, setTickets] = useState<any | undefined>();
  const [sheetProperties, setSheetProperties] = useState<any | undefined>();

  const loadTable = useCallback(async (): Promise<void> => {
    gapi.client.load("sheets", "v4", async () => {
      const sheetProperties = await gapi.client.sheets.spreadsheets.getByDataFilter(
        {
          spreadsheetId: spreadsheetId,
          resource: {
            dataFilters: [
              {
                a1Range: tableName
              }
            ]
          }
        }
      );
      const properties =
        sheetProperties.result.sheets &&
        sheetProperties.result.sheets[0].properties;
      setSheetProperties(properties);

      const rowCount = properties?.gridProperties?.rowCount;
      const response = await gapi.client.sheets.spreadsheets.values.batchGet({
        spreadsheetId: spreadsheetId,
        valueRenderOption: "UNFORMATTED_VALUE",
        dateTimeRenderOption: "FORMATTED_STRING",
        majorDimension: "DIMENSION_UNSPECIFIED",
        ranges: [
          "projects!A2:B",
          `${tableName}!A${rowCount && rowCount - 21}:G`,
          `${tableName}!F2:F`
        ]
      });

      const {
        result: { valueRanges }
      } = response;
      const valueProjects =
        valueRanges &&
        valueRanges[0].values &&
        valueRanges[0].values
          .map(
            (value: any[], index: number): Project => {
              return {
                id: `${tableName}!A${index + 2}`,
                company: value[0],
                project: value[1]
              };
            }
          )
          .reverse();
      setProjects(valueProjects);

      const valueRecords =
        valueRanges &&
        valueRanges[1].values &&
        valueRanges[1].values
          .map(
            (value: any[], index: number): RecordType => {
              return {
                id: `${tableName}!A${rowCount && rowCount - 21 + index}`,
                name: value[0],
                date: value[1],
                company: value[2],
                project: value[3],
                description: value[4],
                ticket: value[5],
                time: value[6]
              };
            }
          )
          .reverse()
          .filter(record => record.time !== undefined);
      setRecords(valueRecords);

      const valueTickets =
        valueRanges &&
        valueRanges[2].values &&
        valueRanges[2].values
          .reduce((prev: any, curr: any): any => prev.concat(curr))
          .filter(
            (value: any, index: number, array: string[]): any =>
              array.indexOf(value) === index
          )
          .map((value: string, index: number): any => {
            return {
              id: index,
              ticket: value
            };
          })
          .reverse();
      setTickets(valueTickets);
    });
  }, [spreadsheetId, tableName]);

  useEffect(() => {
    const initClient = async (): Promise<void> => {
      await gapi.auth.authorize(
        {
          client_id: clientId,
          scope: scope,
          immediate: true
        },
        () => {
          setInitialized(true);
          chrome.identity.getAuthToken({ interactive: true }, token => {
            gapi.client.setToken({ access_token: token });
            setSignedIn(true);
          });
        }
      );
    };

    const initClientAuth2 = async (): Promise<void> => {
      await gapi.client.init({ apiKey, clientId, discoveryDocs, scope });
      setInitialized(true);
      const gAuth = gapi.auth2.getAuthInstance();
      setGoogleAuth(gAuth);

      const currentUser = gAuth.currentUser.get().getBasicProfile();
      setCurrentUser(currentUser);
      //Load spredsheet data
      loadTable();
    };

    if (isScriptLoaded && !chrome.identity) {
      // ? gapi.load("client", initClient)
      gapi.load("client:auth2", initClientAuth2);
    } else {
      setInitialized(true);
      setSignedIn(true);
    }
  }, [clientId, apiKey, discoveryDocs, scope, isScriptLoaded, loadTable]);

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
  }, [GoogleAuth, loadTable]);

  const handleSignIn = async (): Promise<void> => {
    await gapi.auth2.getAuthInstance().signIn();
  };

  const handleSignOut = async (): Promise<void> => {
    gapi.auth2.getAuthInstance().signOut();
    //gapi.auth2.getAuthInstance().disconnect();
  };

  const addProject = async (project: string[]): Promise<any> => {
    return await gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: spreadsheetId,
      range: `projects!A2:G2`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      resource: {
        values: [project]
      }
    });
  };

  const addRecord = async (record: string[]): Promise<any> => {
    return await gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: spreadsheetId,
      range: `${tableName}!A2:G2`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      resource: {
        values: [record]
      }
    });
  };

  const updateRecord = async (
    range: string,
    record: (string | number | null)[]
  ): Promise<any> => {
    return await gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: spreadsheetId,
      range: range,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [record]
      }
    });
  };

  const deleteRecord = async (index: number): Promise<any> => {
    return await gapi.client.sheets.spreadsheets.batchUpdate({
      spreadsheetId: spreadsheetId,
      resource: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: sheetProperties?.sheetId,
                dimension: "ROWS",
                startIndex: index - 1,
                endIndex: index
              }
            }
          }
        ]
      }
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
    tickets,
    loadTable,
    addProject,
    addRecord,
    updateRecord,
    deleteRecord,
    sheetProperties
  };
};
