import * as React from "react";
import { Container, CssBaseline, createMuiTheme } from "@material-ui/core";

import AppProvider from "./contexts/AppProvider";

import GoogleAuthContext from "./contexts/useGoogleAuth";
import { useGoogle } from "./hooks/useGoogle";

import NavBar from "./components/NavBar/NavBar";
import Login from "./components/Login/Login";
import Spinner from "./components/Spinner/Spinner";
import Timer from "./components/Timer/Timer";
import Summary from "./components/Summary/Summary";

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
                {/*  <Content
                  style={{
                    marginTop: "56px"
                  }}
                >
                  <Timer />
                  <Summary />
                </Content>
                <Footer
                  style={{
                    padding: "0px 0px 20px"
                  }}
                >
                  <FlexboxGrid justify="center">
                    <Button
                      target="_blank"
                      href={`https://docs.google.com/spreadsheets/d/1aPo1wlEXueb6poGt7X3XjYVy-VPDaGJhOO5pNBMdl48/edit#gid=${googleAuth.sheetProperties?.sheetId}`}
                      appearance="ghost"
                    >
                      <Icon icon="google" />
                      See more on Google Sheets
                    </Button>
                  </FlexboxGrid>
                </Footer> */}
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
