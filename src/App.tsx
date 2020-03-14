import * as React from "react";
import { CssBaseline } from "@material-ui/core";
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

const discoveryDocs = [
  "https://sheets.googleapis.com/$discovery/rest?version=v4"
];
const scope = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive.metadata"
].join(" ");

const App = () => {
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
          <div>
            <CssBaseline />
            {googleAuth.isSignedIn ? (
              <React.Fragment>
                <NavBar />
                <Timer />
                <Summary />
                <Grid container justify="center">
                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    target="_blank"
                    style={{
                      margin: "0px 0px 32px"
                    }}
                    href={`https://docs.google.com/spreadsheets/d/1aPo1wlEXueb6poGt7X3XjYVy-VPDaGJhOO5pNBMdl48/edit#gid=${googleAuth.sheetProperties?.sheetId}`}
                  >
                    See more on Google Sheets
                  </Button>
                </Grid>
              </React.Fragment>
            ) : (
              <Login />
            )}
          </div>
        ) : (
          <Spinner />
        )}
      </GoogleAuthContext.Provider>
    </AppProvider>
  );
};

export default App;
