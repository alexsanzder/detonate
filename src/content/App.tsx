import * as React from "react";

import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Autocomplete, { RenderInputParams } from "@material-ui/lab/Autocomplete";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import ButtonBase from "@material-ui/core/ButtonBase";
import Divider from "@material-ui/core/Divider";
import Popover from "@material-ui/core/Popover";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import DetonateIcon from "./DetonateIcon";
import PopoverTitle from "./PopoverTitle";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      height: "328px"
    },
    form: {
      width: "100%",
      marginTop: theme.spacing(1)
    },
    divider: {
      margin: theme.spacing(2, 0, 3)
    },
    startButton: {
      padding: theme.spacing(0, 0.5)
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

export interface ProjectType {
  id: string;
  company: string;
  project: string;
  details: string;
}

export interface RecordType {
  id?: string;
  name?: string;
  date?: string;
  company: string;
  project: string;
  description: string;
  ticket: string;
  time: number;
}

export interface ContentProps {
  description: string;
  ticket?: string;
  project?: ProjectType;
  projects?: ProjectType[];
  time?: number;
}

const App = ({
  description,
  ticket,
  project,
  projects
}: ContentProps): JSX.Element => {
  const classes = useStyles();
  const [anchor, setAnchor] = React.useState<HTMLButtonElement | null>(null);
  const [isRunning, setIsRunning] = React.useState<boolean>(false);
  const [record, setRecord] = React.useState<RecordType>({
    name: "",
    date: "",
    company: "",
    project: "",
    description: "",
    ticket: "",
    time: 0
  });
  const inputEl = React.useRef<HTMLInputElement>(null);
  const open = Boolean(anchor);

  React.useEffect(() => {
    setRecord({ ...record, description: description, ticket });
    chrome.storage.sync.get("isRunning", item => setIsRunning(item.isRunning));
    chrome.storage.onChanged.addListener(changes => {
      setIsRunning(changes.isRunning.newValue);
    });
  }, [description, record, ticket]);

  const today = new Date().toLocaleDateString("de-DE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!isRunning) {
      handleStart();
      setAnchor(event.currentTarget);
      if (inputEl && inputEl.current) {
        inputEl.current.focus();
        inputEl.current.setSelectionRange(0, 0);
      }
    } else {
      handleStop();
    }
  };

  const handleClose = () => {
    setAnchor(null);
  };

  const handleStart = () => {
    chrome.storage.sync.set({ isRunning: true });
    chrome.storage.sync.set({ start: Date.now() });
    const addRecord = [
      null,
      today,
      record.company,
      record.project,
      record.description,
      record.ticket,
      0
    ];

    chrome.runtime.sendMessage(
      { message: "addRecord", record: addRecord },
      response => {
        console.log("Start addRecord response ", response);
      }
    );
  };

  const handleDone = () => {
    chrome.storage.sync.get(["range", "start"], items => {
      const updateRecord = [
        null,
        today,
        record.company,
        record.project,
        record.description,
        record.ticket,
        0
      ];
      chrome.runtime.sendMessage(
        {
          message: "updateRecord",
          range: items.range,
          record: updateRecord
        },
        function(response) {
          console.log("Stop updateRecord response ", response);
        }
      );
      setAnchor(null);
    });
  };

  const handleStop = () => {
    chrome.storage.sync.set({ isRunning: false });
    chrome.storage.sync.get(["range", "start"], items => {
      var hours = Math.abs(Date.now() - items.start) / 36e5;
      const updateRecord = [
        null,
        today,
        record.company,
        record.project,
        record.description,
        record.ticket,
        hours
      ];
      chrome.runtime.sendMessage(
        {
          message: "updateRecord",
          range: items.range,
          record: updateRecord
        },
        (response: any) => {
          console.log("Stop updateRecord response ", response);
        }
      );
      setAnchor(null);
    });
  };

  return (
    <React.Fragment>
      <ButtonBase onClick={handleClick} className={classes.startButton}>
        <DetonateIcon className={classes.icon} />
        <Typography
          component="span"
          variant="subtitle2"
          className={classes.underline}
        >
          {isRunning ? "Stop timer" : "Start timer"}
        </Typography>
      </ButtonBase>
      <Popover
        keepMounted
        open={open}
        anchorEl={anchor}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left"
        }}
      >
        <Container component="main" maxWidth="xs" className={classes.container}>
          <PopoverTitle onClose={handleClose} onStop={handleStop}>
            Stop timer
          </PopoverTitle>
          <form className={classes.form} noValidate={true}>
            <TextField
              variant="outlined"
              margin="dense"
              fullWidth
              id="description"
              placeholder="What are you doing?"
              name="description"
              value={description}
              inputRef={inputEl}
              autoFocus
            />
            <Autocomplete
              className={classes.autoComplete}
              value={project}
              options={projects}
              onChange={(
                _event: React.ChangeEvent<{}>,
                newValue: ProjectType | null
              ): void => {
                setRecord({
                  ...record,
                  project: newValue.project,
                  company: newValue.company
                });
              }}
              groupBy={(object: ProjectType): string => object.company}
              getOptionLabel={(object: ProjectType): string => object.project}
              renderInput={(params: RenderInputParams): React.ReactNode => (
                <TextField
                  {...params}
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  name="project"
                  placeholder="Add project"
                />
              )}
            />
            <TextField
              variant="outlined"
              margin="dense"
              fullWidth
              name="ticket"
              placeholder="Add ticket"
              id="ticket"
              value={ticket}
            />
            <Divider className={classes.divider} />
            <Button
              fullWidth
              variant="contained"
              size="medium"
              color="secondary"
              onClick={handleDone}
            >
              Done
            </Button>
          </form>
        </Container>
      </Popover>
    </React.Fragment>
  );
};

export default App;
