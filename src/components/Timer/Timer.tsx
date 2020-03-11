import * as React from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import Fab from "@material-ui/core/Fab";
import PlayArrowRoundedIcon from "@material-ui/icons/PlayArrowRounded";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import StopRoundedIcon from "@material-ui/icons/StopRounded";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";

import { AppContext } from "../../contexts/AppProvider";
import GoogleAuthContext from "../../contexts/useGoogleAuth";

import { getFraction, getTimeFromSeconds } from "../../utils/time";

const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} {...props} />;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
      flexGrow: 1,
      "& > *": {
        width: "100%",
        height: theme.spacing(9)
      }
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: "center"
    },
    item: {
      flexGrow: 0,
      maxWidth: "87%",
      flexBasis: "87%"
    },
    input: {},
    text: {
      width: "87%"
    },
    fab: {
      float: "right"
    }
  })
);

const Timer = () => {
  const classes = useStyles();
  const {
    appendRecord,
    updateRecord,
    currentUser,
    deleteRecord,
    projects,
    records
  } = React.useContext(GoogleAuthContext);

  const {
    locale,
    running,
    toggleRunning,
    reload,
    toggleReload,
    range,
    toggleRange
  } = React.useContext(AppContext);

  const [seconds, setSeconds] = React.useState<number>(0);
  const [description, setDescription] = React.useState<string>("");
  const [company, setCompany] = React.useState<string | null>(null);
  const [project, setProject] = React.useState<string | null>(null);
  const [ticket, setTicket] = React.useState<string | null>(null);

  const [message, setMessage] = React.useState<string>("");
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    let interval: number | undefined = undefined;
    if (running) {
      interval = window.setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!running && seconds !== 0) {
      window.clearInterval(interval);
    }
    return (): void => {
      window.clearInterval(interval);
    };
  }, [running, seconds]);

  const handlePlay = async (): Promise<void> => {
    toggleRunning && toggleRunning(!running);
    setDescription(description ? description : "(no description)");

    const today = new Date().toLocaleDateString(locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
    const append =
      appendRecord &&
      (await appendRecord([
        currentUser.getName(),
        today,
        "(no company)",
        "(no project)",
        description,
        "(no ticket)",
        "0"
      ]));

    const {
      result: {
        updates: { updatedRange }
      }
    } = append;

    toggleRange && toggleRange(updatedRange);
  };
  const handleStop = async (): Promise<void> => {
    toggleRunning && toggleRunning(!running);
    const update =
      updateRecord &&
      (await updateRecord(range ? range : "", [
        null,
        null,
        company,
        project,
        description,
        ticket,
        getFraction(seconds)
      ]));
    setDescription("");

    const {
      result: { updatedRange }
    } = update;
    setMessage(updatedRange);
    setOpen(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setDescription(event.target.value);
  };

  const handleClose = (
    _event: React.SyntheticEvent | React.MouseEvent,
    reason?: string
  ): void => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success">
          {`Time tracking added successfully - ${message}!`}
        </Alert>
      </Snackbar>
      <Paper className={classes.paper} elevation={0}>
        <Grid
          container
          justify={running ? "space-between" : "flex-end"}
          alignItems="center"
          spacing={running ? 1 : 0}
        >
          <Grid item xs={running ? 8 : 10}>
            <InputBase
              fullWidth
              className={classes.input}
              placeholder="What are you working on?"
              inputProps={{ "aria-label": "What are you working on?" }}
              value={description}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs>
            {running ? (
              <Grid container justify="space-between" alignItems="center">
                <Grid item xs={5}>
                  <InputBase
                    className={classes.input}
                    placeholder="00:00:00"
                    value={getTimeFromSeconds(seconds)}
                    inputProps={{
                      "aria-label": "What are you working on?",
                      readOnly: true
                    }}
                  />
                </Grid>
                <Grid item xs>
                  <Fab color="primary" size="small" aria-label="edit">
                    <EditRoundedIcon />
                  </Fab>
                  <Fab
                    color="secondary"
                    size="small"
                    className={classes.fab}
                    aria-label="stop"
                    onClick={handleStop}
                  >
                    <StopRoundedIcon />
                  </Fab>
                </Grid>
              </Grid>
            ) : (
              <Fab
                color="primary"
                size="small"
                className={classes.fab}
                aria-label="add"
                onClick={handlePlay}
              >
                <PlayArrowRoundedIcon />
              </Fab>
            )}
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default Timer;
