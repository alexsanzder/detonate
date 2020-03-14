import * as React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

import GoogleAuthContext from "../../contexts/useGoogleAuth";

const useStyles = makeStyles((theme: Theme) => createStyles({}));

const Footer = (): JSX.Element => {
  const { sheetProperties } = React.useContext(GoogleAuthContext);
  return (
    <Grid container justify="center">
      <Button
        variant="outlined"
        color="primary"
        size="large"
        target="_blank"
        style={{
          margin: "0px 0px 24px"
        }}
        href={`https://docs.google.com/spreadsheets/d/1aPo1wlEXueb6poGt7X3XjYVy-VPDaGJhOO5pNBMdl48/edit#gid=${sheetProperties?.sheetId}`}
      >
        See more on Google Sheets
      </Button>
    </Grid>
  );
};
export default Footer;
