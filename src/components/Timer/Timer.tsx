import * as React from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Fab from "@material-ui/core/Fab";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
      flexGrow: 1,
      "& > *": {
        width: "100%",
        height: "90px"
      }
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: "center"
    },
    text: {
      width: "87%"
    },
    fab: {
      float: "right"
    }
  })
);

export default function SimplePaper() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} elevation={0}>
        <Grid container justify="space-between" alignItems="center" spacing={0}>
          <Grid item xs={10}>
            <TextField
              id="outlined-basic"
              label="Description"
              placeholder="What are you working on?"
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs>
            <Fab color="primary" className={classes.fab} aria-label="add">
              <PlayArrowIcon />
            </Fab>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}
