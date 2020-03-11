import * as React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Avatar from "@material-ui/core/Avatar";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import IconButton from "@material-ui/core/IconButton";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import SyncIcon from "@material-ui/icons/Sync";
import Tooltip from "@material-ui/core/Tooltip";
import Divider from "@material-ui/core/Divider";

import { ThemeContext } from "../../contexts/ThemeProvider";
import GoogleAuthContext from "../../contexts/useGoogleAuth";

import logo from "../../logo-detonate-white.svg";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    small: {
      width: theme.spacing(3),
      height: theme.spacing(3)
    },
    logo: {
      height: 30,
      marginBottom: theme.spacing(1),
      cursor: "none"
    },
    rightToolbar: {
      marginLeft: "auto",
      marginRight: -12
    }
  })
);

const NavBar = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { themeName, setThemeName } = React.useContext(ThemeContext);
  const { currentUser, handleSignOut, sheetProperties } = React.useContext(
    GoogleAuthContext
  );

  const handleTheme = (): void => {
    setThemeName(themeName === "darkTheme" ? "lightTheme" : "darkTheme");
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <img src={logo} alt="detonate" className={classes.logo} />
          <section className={classes.rightToolbar}>
            <IconButton color="inherit" aria-label="Sync Google Sheets">
              <Tooltip title="Sync Google Sheets" arrow>
                <SyncIcon fontSize="small" />
              </Tooltip>
            </IconButton>
            <IconButton
              color="inherit"
              aria-label="Open Google Sheets"
              target="_blank"
              href={`https://docs.google.com/spreadsheets/d/1aPo1wlEXueb6poGt7X3XjYVy-VPDaGJhOO5pNBMdl48/edit#gid=${sheetProperties?.sheetId}`}
            >
              <Tooltip title="Open Google Sheets" arrow>
                <OpenInNewIcon fontSize="small" />
              </Tooltip>
            </IconButton>
            <IconButton
              color="inherit"
              aria-label="Toggle Dark/Light mode"
              onClick={handleTheme}
            >
              <Tooltip title="Toggle Dark/Light mode" arrow>
                {themeName === "lightTheme" ? (
                  <Brightness4Icon fontSize="small" />
                ) : (
                  <Brightness7Icon fontSize="small" />
                )}
              </Tooltip>
            </IconButton>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar
                className={classes.small}
                alt={currentUser?.getName()}
                src={currentUser?.getImageUrl()}
              />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>Settings</MenuItem>
              <Divider />
              <MenuItem onClick={handleSignOut}>Log out</MenuItem>
            </Menu>
          </section>
        </Toolbar>
      </AppBar>
    </div>
  );
};
export default NavBar;
