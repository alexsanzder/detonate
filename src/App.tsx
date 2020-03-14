import * as React from "react";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({ offset: theme.mixins.toolbar })
);

const App = (): JSX.Element => {
  const classes = useStyles();

  const googleAuth = useGoogle({
    apiKey: process.env.REACT_APP_GOOGLE_APP_ID,
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    discoveryDocs,
    scope,
    spreadsheetId: "1aPo1wlEXueb6poGt7X3XjYVy-VPDaGJhOO5pNBMdl48",
    tableName: "aSa"
  });

  return (
    <AppProvider>
      <GoogleAuthContext.Provider value={googleAuth}>
        {googleAuth.isInitialized ? (
          <React.Fragment>
            <CssBaseline />
            {googleAuth.isSignedIn ? (
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
