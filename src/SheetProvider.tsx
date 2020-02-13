import * as React from 'react';
import scriptLoader from 'react-async-script-loader';

import Login from './components/Login';

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const API_KEY = process.env.REACT_APP_API_KEY;
const SHEET_ID = process.env.REACT_APP_SHEET_ID;

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = [
  'https://sheets.googleapis.com/$discovery/rest?version=v4',
];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES =
  'https://www.googleapis.com/auth/spreadsheets.readonly https://www.googleapis.com/auth/drive.metadata.readonly';

declare global {
  interface Window {
    gapi: any;
  }
}

export interface SheetProviderProps {
  children: React.ReactChild;
  isScriptLoaded?: boolean;
}

const SheetProvider: React.FunctionComponent<SheetProviderProps> = ({
  children,
  isScriptLoaded,
}) => {
  const [isSignedIn, setSignedIn] = React.useState<boolean>(false);
  React.useEffect(() => {
    console.log('render');
    if (isScriptLoaded) {
      window.gapi.load('client:auth2', async () => {
        await window.gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES,
        });
        window.gapi.auth2.getAuthInstance().isSignedIn.listen(signedInChanged);
        signedInChanged(window.gapi.auth2.getAuthInstance().isSignedIn.get());
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScriptLoaded]);

  const signedInChanged = (isSignedIn: any) => {
    console.log(isSignedIn);

    setSignedIn(isSignedIn);
    if (isSignedIn) {
      load();
    }
  };

  const load = async () => {
    const response = await window.gapi.client.sheets.spreadsheets.values.batchGet(
      {
        spreadsheetId: SHEET_ID,
        ranges: [
          'Data!A2:A50',
          'Data!E2:E50',
          'Expenses!A2:F',
          'Current!H1',
          'Previous!H1',
        ],
      }
    );
    console.log(response.result.valueRanges);
  };

  const handleAuthClick = () => {
    window.gapi.auth2.getAuthInstance().signIn();
  };

  const handleSignoutClick = async () => {
    await window.gapi.auth2.getAuthInstance().signOut();
    signedInChanged(window.gapi.auth2.getAuthInstance().isSignedIn.get());
  };

  const checkIsSignedIn = () => {
    if (
      !window.gapi ||
      !window.gapi.auth2 ||
      !window.gapi.auth2.getAuthInstance()
    ) {
      return false;
    }
    return window.gapi.auth2.getAuthInstance().isSignedIn.get();
  };

  return isScriptLoaded && checkIsSignedIn() ? (
    <div>{children}</div>
  ) : (
    <Login>Login</Login>
  );
};

export default scriptLoader('https://apis.google.com/js/api.js')(SheetProvider);
