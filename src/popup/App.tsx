import * as React from "react";

import { CssBaseline } from "@material-ui/core";
import Container from "@material-ui/core/Container";

import AppProvider from "./contexts/AppProvider";
import GoogleAuthContext from "./contexts/useGoogleAuth";
import { useGoogle } from "./hooks/useGoogle";

import NavBar from "./components/NavBar";
import Login from "./components/Login";
import Spinner from "./components/Spinner";
import Timer from "./components/Timer";
import Summary from "./components/Summary";
import Footer from "./components/Footer";

const discoveryDocs = [
  "https://sheets.googleapis.com/$discovery/rest?version=v4"
];
const scope = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive.metadata"
].join(" ");

const App = (): JSX.Element => {
  const googleAuth = useGoogle({
    apiKey: process.env.REACT_APP_API_KEY,
    clientId: process.env.REACT_APP_CLIENT_ID,
    spreadsheetId: process.env.REACT_APP_SPREADSHEET_ID,
    tableName: process.env.REACT_APP_TABLE_NAME,
    discoveryDocs,
    scope
  });

  return (
    <AppProvider>
      <GoogleAuthContext.Provider value={googleAuth}>
        {googleAuth.isInitialized ? (
          <React.Fragment>
            <CssBaseline />
            {true ? (
              <React.Fragment>
                <NavBar />
                <Timer />
                <Container fixed>
                  <Summary />
                </Container>
                <Footer />
              </React.Fragment>
            ) : (
              <Login />
            )}
          </React.Fragment>
        ) : (
          <Spinner />
        )}
      </GoogleAuthContext.Provider>
    </AppProvider>
  );
};

export default App;
