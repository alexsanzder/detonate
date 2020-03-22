import * as React from "react";

import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";

import Close from "@material-ui/icons/Close";
import ButtonDetonate from "./ButtonDetonate";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      margin: 0,
      padding: theme.spacing(1.5, 0),
      color: theme.palette.grey[500],
      cursor: "pointer"
    },
    closeButton: {
      position: "absolute",
      top: theme.spacing(1),
      right: theme.spacing(1),
      color: theme.palette.grey[500]
    }
  })
);

export interface PopoverTitleProps {
  children: string;
  onClose: () => void;
  onStop: () => void;
}

const PopoverTitle = ({
  children,
  onClose,
  onStop,
  ...other
}: PopoverTitleProps) => {
  const classes = useStyles();
  return (
    <DialogTitle disableTypography={true} className={classes.title} {...other}>
      <ButtonDetonate onClick={onStop} title={children} />
      {onClose && (
        <IconButton
          className={classes.closeButton}
          onClick={onClose}
          size={"small"}
        >
          <Close />
        </IconButton>
      )}
    </DialogTitle>
  );
};

export default PopoverTitle;
