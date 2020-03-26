import * as React from "react";

import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Autocomplete, { RenderInputParams } from "@material-ui/lab/Autocomplete";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Popover from "@material-ui/core/Popover";
import TextField from "@material-ui/core/TextField";

import PopoverTitle from "./components/PopoverTitle";
import ButtonDetonate from "./components/ButtonDetonate";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      height: "303px"
    },
    divider: {
      margin: theme.spacing(2, 0, 2.5)
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
export interface ProfileType {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export interface ContentProps {
  description?: string;
  ticket?: string;
}

const Content = ({ description, ticket }: ContentProps): JSX.Element => {
  const classes = useStyles();
  const [anchor, setAnchor] = React.useState<HTMLButtonElement | null>(null);
  const [isRunning, setIsRunning] = React.useState<boolean>(false);
  const [projects, setProjects] = React.useState<ProjectType[]>();
  const [project, setProject] = React.useState<ProjectType>();
  const [profile, setProfile] = React.useState<ProfileType>();
  const [record, setRecord] = React.useState<RecordType>({
    name: "",
    date: "",
    company: "",
    project: "",
    description: "",
    ticket: "",
    time: 0
  });
  const inputRef = React.useRef<HTMLInputElement>(null);
  const open = Boolean(anchor);

  React.useEffect(() => {
    setRecord({ ...record, description: description, ticket });
    chrome.storage.sync.get(
      ["isRunning", "projects", "profile"],
      (items: any) => {
        setIsRunning(items.isRunning);
        setProjects(items.projects);
        setProfile(items.profile);
      }
    );
    chrome.storage.onChanged.addListener((changes: any) => {
      if (changes.isRunning) {
        setIsRunning(changes.isRunning.newValue);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const today = new Date().toLocaleDateString("de-DE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!isRunning) {
      handleStart();
      setAnchor(event.currentTarget);
    } else {
      handleStop();
    }
  };

  const handleClose = () => {
    setAnchor(null);
  };

  const handleStart = () => {
    const addRecord = [
      profile,
      today,
      record.company,
      record.project,
      record.description,
      record.ticket,
      0
    ];

    chrome.runtime.sendMessage(
      { message: "addRecord", record: addRecord },
      (response: any) => {
        console.log("Start addRecord response ", response);
      }
    );
  };

  const handleDone = () => {
    chrome.storage.sync.get(["range", "start"], (items: any) => {
      const updateRecord = [
        profile.name,
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
        (response: any) => {
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
        profile.name,
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
      <ButtonDetonate
        onClick={handleClick}
        title={isRunning ? "Stop timer" : "Start timer"}
      />
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
          <TextField
            variant="outlined"
            margin="dense"
            fullWidth
            id="description"
            placeholder="What are you doing?"
            name="description"
            defaultValue={description}
            inputRef={inputRef}
          />
          <Autocomplete
            className={classes.autoComplete}
            defaultValue={project}
            options={projects ? projects : []}
            onChange={(
              _event: React.ChangeEvent<{}>,
              newValue: ProjectType | null
            ): void => {
              setRecord({
                ...record,
                project: newValue?.project,
                company: newValue?.company
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
            defaultValue={ticket}
          />
          <Divider className={classes.divider} />
          <Button
            fullWidth
            variant="contained"
            size="medium"
            color="secondary"
            onClick={handleDone}
            style={{ textTransform: "none" }}
          >
            Done
          </Button>
        </Container>
      </Popover>
    </React.Fragment>
  );
};

export default Content;
