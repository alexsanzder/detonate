/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from "react";
import { Grommet, Button, Box, Layer } from "grommet";
import { Login, Logout } from "grommet-icons";
import { GoogleContext } from "./contexts/GoogleContext";

import { useGoogle } from "./hooks/useGoogle";

// import SheetProvider from './SheetProvider';
import Header from "./components/Header";
import Spinner from "./components/Spinner";

const theme = {
  global: {
    font: {
      family: "Roboto",
      size: "18px",
      height: "20px"
    }
  }
};

const discoveryDocs = [
  "https://sheets.googleapis.com/$discovery/rest?version=v4"
];
const scope = [
  "https://www.googleapis.com/auth/spreadsheets.readonly",
  "https://www.googleapis.com/auth/drive.metadata.readonly"
].join(" ");

const App = () => {
  const {
    isInitialized,
    isAuthorized,
    signIn,
    signOut,
    googleUser
  } = useGoogle({
    scope,
    discoveryDocs
  });
  return (
    <GoogleContext.Provider value={{ isAuthorized, googleUser }}>
      <Grommet theme={theme} full>
        {isInitialized ? (
          <Layer full animation="fadeIn">
            {!isAuthorized ? (
              <Box fill align="center" justify="center">
                <Button icon={<Login />} label="Sign In" onClick={signIn} />
              </Box>
            ) : (
              <>
                <Header gridArea="" />
                <Box fill align="center" justify="center">
                  <Button
                    icon={<Logout />}
                    label="Sign out"
                    onClick={signOut}
                  />
                </Box>
              </>
            )}
          </Layer>
        ) : (
          <Layer full>
            <Spinner />
          </Layer>
        )}
      </Grommet>
    </GoogleContext.Provider>
  );
};

export default App;
