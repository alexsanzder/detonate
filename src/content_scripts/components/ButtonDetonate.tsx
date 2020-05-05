import * as React from "react";
import clsx from "clsx";

import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";

import IconDetonate from "./IconDetonate";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    startButton: {
      // padding: theme.spacing(0, 0.5),
      "&:focus": {
        boxShadow: "none"
      }
    },
    icon: {
      fontSize: 24,
      margin: theme.spacing(0, 0.25, 0.5),
      "&:hover": {
        fill: theme.palette.secondary.dark
      }
    },
    underline: {
      color: theme.palette.grey[700],
      "&:hover": {
        borderBottom: "1.5px solid currentColor",
        display: "inline-block",
        lineHeight: 1.2
      }
    },
    autoComplete: {
      width: "396px"
    }
  })
);

export interface ButtonDetonateProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  title: string;
  className?: any;
}

const ButtonDetonate = ({
  onClick,
  title,
  className
}: ButtonDetonateProps): JSX.Element => {
  const classes = useStyles();

  return (
    <ButtonBase
      onClick={onClick}
      className={clsx(className, classes.startButton)}
    >
      <IconDetonate className={classes.icon} viewBox="0 0 512 512" />
      <Typography
        component="span"
        variant="subtitle2"
        className={classes.underline}
      >
        {title}
      </Typography>
    </ButtonBase>
  );
};

export default ButtonDetonate;
