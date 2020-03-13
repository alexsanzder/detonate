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

import Edit from "../Edit/Edit";

import { AppContext } from "../../contexts/AppProvider";
import GoogleAuthContext from "../../contexts/useGoogleAuth";
import { RecordType } from "../../hooks/useGoogle";

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
      textAlign: "center",
      borderRadius: 0
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

const Timer = (): JSX.Element => {
  const classes = useStyles();
  const {
    appendRecord,
    updateRecord,
    currentUser,
    loadTable
  } = React.useContext(GoogleAuthContext);

  const {
    locale,
    running,
    toggleRunning,
    reload,
    toggleReload
  } = React.useContext(AppContext);

  const [record, setRecord] = React.useState<any | null>({
    id: "",
    seconds: "",
    description: "",
    company: "",
    project: "",
    ticket: ""
  });

  const [seconds, setSeconds] = React.useState<number>(0);

  const [openEdit, setOpenEdit] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);

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

  React.useEffect(() => {
    if (reload && !running) {
      setSeconds(0);
    }
  }, [reload, running]);

  const handlePlay = async (): Promise<void> => {
    const today = new Date().toLocaleDateString(locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
    const response =
      appendRecord &&
      (await appendRecord([
        currentUser.getName(),
        today,
        record.company ? record.company : "(no company)",
        record.project ? record.project : "(no project)",
        record.description ? record.description : "(no description)",
        record.ticket ? record.ticket : "(no ticket)",
        "0"
      ]));

    const {
      result: {
        updates: { updatedRange }
      }
    } = response;

    setRecord({
      ...record,
      id: updatedRange,
      company: record.company ? record.company : "(no company)",
      project: record.project ? record.project : "(no project)",
      description: record.description ? record.description : "(no description)",
      ticket: record.ticket ? record.ticket : "(no ticket)"
    });

    toggleRunning(!running);
  };

  const handleStop = async (): Promise<void> => {
    toggleRunning(!running);
    const response =
      updateRecord &&
      (await updateRecord(record.id, [
        null,
        null,
        record.company,
        record.project,
        record.description,
        record.ticket,
        getFraction(seconds)
      ]));

    const {
      result: { updatedRange }
    } = response;
    toggleReload(true);
    setOpenAlert(true);
  };

  const handleOpenEdit = (): void => {
    setOpenEdit(!openEdit);
  };

  const handleCloseEdit = (): void => {
    setOpenEdit(false);
    loadTable && loadTable();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRecord({ ...record, [event.target.name]: event.target.value });
  };

  const handleCloseAlert = (
    _event: React.SyntheticEvent | React.MouseEvent,
    reason?: string
  ): void => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
  };

  return (
    <div className={classes.root}>
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
              name="description"
              className={classes.input}
              placeholder="What are you working on?"
              inputProps={{ "aria-label": "What are you working on?" }}
              value={record.description}
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
                  <Fab
                    color="primary"
                    size="small"
                    aria-label="edit"
                    onClick={handleOpenEdit}
                  >
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
                color="default"
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
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
        open={openAlert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <Alert onClose={handleCloseAlert} severity="success">
          {`Time tracked successfully - ${record.id}!`}
        </Alert>
      </Snackbar>
      <Edit
        open={openEdit}
        handleClose={handleCloseEdit}
        timer={getTimeFromSeconds(seconds)}
        record={record}
        setRecord={setRecord}
      />
    </div>
  );
};

export default Timer;
