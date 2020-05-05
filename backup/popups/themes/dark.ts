import { createMuiTheme } from "@material-ui/core";
import grey from "@material-ui/core/colors/grey";
import green from "@material-ui/core/colors/green";

export const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#2196f3"
    },
    secondary: {
      main: "#F50057"
    },
    background: {
      default: grey[800],
      paper: grey[700]
    }
  },
  typography: {
    button: {
      textTransform: "none"
    }
  },
  props: {
    MuiAppBar: {
      position: "sticky"
    },
    MuiCard: {
      elevation: 0
    }
  },

  overrides: {
    MuiAppBar: {
      colorSecondary: {
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
        color: grey[300]
      }
    },
    MuiFab: {
      root: {
        backgroundColor: green[500],
        color: "#fff",
        "&:hover": {
          backgroundColor: green[700]
        }
      }
    },
    MuiCardHeader: {
      content: {
        marginRight: "8px"
      },
      action: {
        marginTop: "0",
        marginRight: "0"
      }
    }
  }
});
