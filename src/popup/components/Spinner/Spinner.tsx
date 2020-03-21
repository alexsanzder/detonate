import React from "react";

import Paper from "@material-ui/core/Paper";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

export const Spinner = (): JSX.Element => (
  <Paper>
    <Backdrop open={true} color="inherit">
      <CircularProgress color="inherit" />
    </Backdrop>
  </Paper>
);

export default Spinner;
