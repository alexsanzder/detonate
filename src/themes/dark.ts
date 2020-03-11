import { createMuiTheme } from "@material-ui/core";
import grey from "@material-ui/core/colors/grey";
import color from "@material-ui/core/colors/amber";

export const darkTheme = createMuiTheme({
  props: {
    MuiAppBar: {
      position: "sticky"
    },
    MuiCard: {
      elevation: 0
    }
  },
  palette: {
    type: "dark",
    primary: {
      main: "#2196f3"
    },
    background: {
      default: grey[800],
      paper: grey[700]
    }
  },
  overrides: {
    MuiAppBar: {
      colorPrimary: {
        backgroundColor: grey[800]
      }
    },
    MuiTable: {
      root: {
        background: "transparent !important"
      }
    },
    MuiTypography: {
      root: {
        color: grey[400]
      }
    }
  }
});
