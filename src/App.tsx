/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from "react";
import { Container, Content, Footer } from "rsuite";
import Header from "./components/AppHeader";
import Login from "./components/Login";
import Spinner from "./components/Spinner";

import GoogleContext from "./contexts/useGoogleAuth";
import { useGoogleLogin } from "./hooks/useGoogleLogin";

import "rsuite/dist/styles/rsuite-default.css";

const discoveryDocs = [
  "https://sheets.googleapis.com/$discovery/rest?version=v4"
];
const scope = [
  "https://www.googleapis.com/auth/spreadsheets.readonly",
  "https://www.googleapis.com/auth/drive.metadata.readonly"
].join(" ");

const App = () => {
  const googleAuth = useGoogleLogin({
    apiKey: process.env.REACT_APP_GOOGLE_APP_ID,
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    discoveryDocs,
    scope
  });
  return (
    <GoogleContext.Provider value={googleAuth}>
      {googleAuth.isInitialized ? (
        <Container>
          {googleAuth.isSignedIn ? (
            <Container>
              <Header />
              <Content>Content</Content>
              <Footer>Footer</Footer>
            </Container>
          ) : (
            <Login />
          )}
        </Container>
      ) : (
        <Spinner />
      )}
    </GoogleContext.Provider>
  );
};

export default App;
