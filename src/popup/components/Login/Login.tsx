import * as React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Link from "@material-ui/core/Link";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";

import GoogleAuthContext from "../../contexts/useGoogleAuth";
import { ReactComponent as Logo } from "../../../logo.svg";

const Copyright = (): JSX.Element => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      <Link color="inherit" href="https://github.com/alexsanzder/detonate/">
        Detonate - Time Tracker
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      marginTop: theme.spacing(8),
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    },
    avatar: {
      margin: theme.spacing(2),
      width: theme.spacing(7),
      height: theme.spacing(7),
      backgroundColor: theme.palette.secondary.main
    },
    form: {
      width: "100%",
      marginTop: theme.spacing(1)
    },
    divider: { margin: theme.spacing(2, 0, 3) },
    icon: {
      "& path": {
        fill: "white"
      }
    }
  })
);

const DetonateIcon = (props: SvgIconProps): JSX.Element => (
  <SvgIcon {...props} component={Logo} />
);

const Login = (): JSX.Element => {
  const classes = useStyles();

  const { handleSignIn } = React.useContext(GoogleAuthContext);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <DetonateIcon
            viewBox="0 0 512 512"
            style={{ fontSize: 40 }}
            className={classes.icon}
          />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="sheedId"
            placeholder="Google Sheet ID"
            name="sheedId"
            autoComplete="sheedId"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="sheedName"
            placeholder="Google Sheet Name"
            id="sheedName"
            autoComplete="sheedName"
          />
          <Divider className={classes.divider} />
          <Button
            fullWidth
            variant="contained"
            size="large"
            color="primary"
            onClick={handleSignIn}
          >
            Sign in with Google
          </Button>
        </form>
      </div>
      <Box mt={10}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default Login;
