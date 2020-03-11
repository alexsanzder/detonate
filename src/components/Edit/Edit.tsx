import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Slide from "@material-ui/core/Slide";
import { TransitionProps } from "@material-ui/core/transitions";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";

import { AppContext } from "../../contexts/AppProvider";
import GoogleAuthContext from "../../contexts/useGoogleAuth";
import { getSeconds, getFraction, getTimeFormated } from "../../utils/time";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      marginTop: theme.spacing(8),
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    },
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(1)
    },
    timer: {
      textAlign: "center",
      fontSize: 30
    },
    divider: { margin: theme.spacing(2, 0, 3) }
  })
);

const Transition = React.forwardRef<unknown, TransitionProps>(
  function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  }
);

export interface EditProps {
  open: boolean;
  handleClose: () => void;
  timer: string;
  record: any;
  setRecord: (value: any) => void;
}

const Edit: React.FC<EditProps> = ({
  open,
  handleClose,
  timer,
  record,
  setRecord
}) => {
  const classes = useStyles();
  const { toggleReload, toggleRunning } = React.useContext(AppContext);
  const { projects, records, updateRecord, deleteRecord } = React.useContext(
    GoogleAuthContext
  );

  const handleUpdate = async (): Promise<void> => {
    const seconds = timer ? getSeconds(timer) : 0;
    const fraction = getFraction(seconds);
    const response =
      updateRecord &&
      (await updateRecord(record.range, [
        null,
        null,
        record.company,
        record.project,
        record.description,
        record.ticket,
        fraction
      ]));
    toggleReload(true);
    handleClose();
  };

  const handleDelete = async (): Promise<void> => {
    const index = record.range.replace(/(^.+\D)(\d+)(\D.+$)/i, "$2");
    const response = deleteRecord && (await deleteRecord(parseInt(index)));
    toggleReload(true);
    toggleRunning(false);
    handleClose();
  };

  const handleChangeInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setRecord({ ...record, [event.target.name]: event.target.value });
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <CssBaseline />
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="timer"
              name="timer"
              inputProps={{ className: classes.timer }}
              InputProps={{
                readOnly: true
              }}
              value={timer}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              name="description"
              placeholder="What are you working on?"
              id="description"
              autoComplete="description"
              value={record.description}
              onChange={handleChangeInput}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              name="project"
              placeholder="In what project?"
              id="project"
              autoComplete="project"
              value={record.project}
              onChange={handleChangeInput}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              name="ticket"
              placeholder="Which ticket?"
              id="ticket"
              autoComplete="ticket"
              value={record.ticket}
              onChange={handleChangeInput}
            />
            <Divider className={classes.divider} />
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  color="primary"
                  onClick={handleUpdate}
                >
                  Done
                </Button>
              </Grid>
              <Grid item xs>
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  color="default"
                  onClick={handleUpdate}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item xs>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  color="secondary"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </Dialog>
  );
};

export default Edit;
