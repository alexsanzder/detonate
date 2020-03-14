import * as React from "react";

import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
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
import { useInterval } from "../../hooks/useInterval";
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
    card: {
      borderRadius: 0
    },
    fab: {
      marginLeft: theme.spacing(1)
    },
    chips: {
      display: "flex",
      flexWrap: "wrap",
      "& > *": {
        margin: theme.spacing(0.25)
      }
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
  const defaultRecord = {
    id: "",
    name: "",
    date: "",
    description: "",
    company: "",
    project: "",
    ticket: "",
    time: 0
  };

  const [openEdit, setOpenEdit] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [record, setRecord] = React.useState<RecordType>(defaultRecord);
  const [seconds, setSeconds] = React.useState<number>(0);

  useInterval(() => setSeconds(seconds => seconds + 1), running ? 1000 : null);

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
      setRecord(defaultRecord);
      loadTable && loadTable();
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
        record?.company ? record?.company : "(no company)",
        record?.project ? record?.project : "(no project)",
        record?.description ? record?.description : "(no description)",
        record?.ticket ? record?.ticket : "(no ticket)",
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
      company: record?.company ? record?.company : "(no company)",
      project: record?.project ? record?.project : "(no project)",
      description: record?.description
        ? record?.description
        : "(no description)",
      ticket: record?.ticket ? record?.ticket : "(no ticket)",
      time: record?.time ? record?.time : seconds
    });

    toggleRunning(!running);
  };

  const handleStop = async (): Promise<void> => {
    setRecord({ ...record, description: "Loading..." });

    const response =
      updateRecord &&
      (await updateRecord(record?.id ? record?.id : "", [
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
    toggleRunning(false);
    setOpenAlert(true);
  };

  const handleOpenEdit = (): void => {
    setOpenEdit(!openEdit);
  };

  const handleCloseEdit = (): void => {
    setOpenEdit(false);
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
    <div>
      <Card className={classes.card}>
        <CardHeader
          disableTypography
          title={
            <Grid container>
              <Grid item xs={9}>
                <InputBase
                  fullWidth
                  name="description"
                  placeholder="What are you working on?"
                  inputProps={{ "aria-label": "What are you working on?" }}
                  value={record.description}
                  onChange={handleChange}
                />
              </Grid>
              {running && (
                <Grid item xs={3}>
                  <InputBase
                    fullWidth
                    placeholder="00:00:00"
                    value={getTimeFromSeconds(seconds)}
                    inputProps={{
                      readOnly: true,
                      style: {
                        textAlign: "right"
                      }
                    }}
                  />
                </Grid>
              )}
            </Grid>
          }
          action={
            !running ? (
              <Fab
                color="default"
                size="small"
                aria-label="add"
                onClick={handlePlay}
              >
                <PlayArrowRoundedIcon />
              </Fab>
            ) : (
              <React.Fragment>
                <Fab
                  className={classes.fab}
                  color="primary"
                  size="small"
                  aria-label="edit"
                  onClick={handleOpenEdit}
                >
                  <EditRoundedIcon />
                </Fab>
                <Fab
                  className={classes.fab}
                  color="secondary"
                  size="small"
                  aria-label="stop"
                  onClick={handleStop}
                >
                  <StopRoundedIcon />
                </Fab>
              </React.Fragment>
            )
          }
        />
      </Card>
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
