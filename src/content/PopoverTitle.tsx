import * as React from "react";

import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import DialogTitle from "@material-ui/core/DialogTitle";
import ButtonBase from "@material-ui/core/ButtonBase";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";

import Close from "@material-ui/icons/Close";
import DetonateIcon from "./DetonateIcon";

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
    },
    icon: {
      fontSize: 24,
      margin: theme.spacing(0, 0.25, 0.5)
    },
    startButton: {
      padding: theme.spacing(0, 0.5)
    },
    underline: {
      color: theme.palette.grey[700],
      "&:hover": {
        borderBottom: "1.5px solid currentColor",
        display: "inline-block",
        lineHeight: 1.2
      }
    }
  })
);

export interface PopoverTitleProps {
  children: React.ReactNode;
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
      <ButtonBase onClick={onStop} className={classes.startButton}>
        <DetonateIcon className={classes.icon} />
        <Typography
          component="span"
          variant="subtitle2"
          className={classes.underline}
        >
          {children}
        </Typography>
      </ButtonBase>
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
