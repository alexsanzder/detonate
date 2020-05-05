import * as React from "react";

import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Autocomplete, { RenderInputParams } from "@material-ui/lab/Autocomplete";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Popover from "@material-ui/core/Popover";
import TextField from "@material-ui/core/TextField";

import PopoverTitle from "./components/PopoverTitle";
import ButtonDetonate from "./components/ButtonDetonate";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      height: "280px",
      width: "400px"
    },
    button: {
      margin: theme.spacing(2, 0, 2),
      textTransform: "none"
    }
  })
);

const defaultRecord = {
  name: null,
  date: null,
  company: null,
  project: null,
  description: null,
  ticket: null,
  time: 0
};

export interface ProjectType {
  id?: string;
  company?: string;
  project?: string;
  details?: string;
}

export interface RecordType {
  id?: string;
  name?: string | null;
  date?: string | null;
  company?: string | null;
  project?: string | null;
  description?: string | null;
  ticket?: string | null;
  time?: number | null;
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
  const [projects, setProjects] = React.useState<ProjectType[] | null>(null);
  const [project, setProject] = React.useState<ProjectType | null>(null);
  const [profile, setProfile] = React.useState<ProfileType | null>(null);
  const [record, setRecord] = React.useState<RecordType>(defaultRecord);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const today = new Date().toLocaleDateString("de-DE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });

  React.useEffect(() => {
    chrome.storage.local.get(["projects"], ({ projects }) => {
      setProjects(projects);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log(projects);

  // React.useEffect(() => {
  //   if (chrome) {
  //     chrome.storage.local.get(
  //       ["isRunning", "projects", ""],
  //       ({ isRunning, projects, profile }) => {
  //         setIsRunning(isRunning);
  //         setProjects(projects);
  //         setProfile(profile);
  //         setRecord({
  //           ...record,
  //           name: profile.name,
  //           date: today,
  //           description: description,
  //           ticket: ticket,
  //           time: 0
  //         });
  //       }
  //     );

  //     chrome.storage.onChanged.addListener(({ isRunning }) => {
  //       isRunning && setIsRunning(isRunning.newValue);
  //     });
  //   }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [description, ticket]);

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
    const newRecord = record;
    chrome.runtime.sendMessage(
      { action: "addRow", payload: { record: newRecord, badge: "▶️" } },
      (response: any) => {
        console.log("Start addRow response ", response);
      }
    );
  };

  const handleUpdate = () => {
    chrome.storage.local.get(["range"], ({ range }) => {
      chrome.runtime.sendMessage(
        {
          action: "updateRow",
          payload: {
            range: range,
            record: record,
            badge: "▶️"
          }
        },
        (response: any) => {
          console.log("Done updateRow response ", response);
        }
      );
      setAnchor(null);
    });
  };

  const handleStop = () => {
    chrome.storage.local.get(
      ["records", "range", "start"],
      ({ records, range, start }) => {
        const hours = Math.abs(Date.now() - start) / 36e5;
        chrome.runtime.sendMessage(
          {
            action: "updateRow",
            payload: {
              range: range,
              record: { ...record, time: hours }
            }
          },
          (response: string) => {
            const newRecord = { ...record, id: response };
            chrome.storage.local.set({
              isRunning: false,
              records: [newRecord, ...records]
            });
            console.log("Stop updateRow response ", response);
          }
        );
        setRecord(defaultRecord);
        setAnchor(null);
      }
    );
  };

  return (
    <React.Fragment>
      <ButtonDetonate
        onClick={handleClick}
        title={isRunning && isRunning ? "Stop timer" : "Start timer"}
      />
      <Popover
        keepMounted
        open={!!anchor}
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
            value={description}
            inputRef={inputRef}
          />
          <Autocomplete
            multiple={false}
            value={project && project}
            options={projects && projects}
            onChange={(
              _event: React.ChangeEvent<{}>,
              newValue: ProjectType | null
            ): void => {
              if (newValue) {
                const { project, company } = newValue;
                setRecord({
                  ...record,
                  project,
                  company
                });
              }
              setProject(newValue);
              console.log(project);
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
          <Button
            fullWidth
            variant="contained"
            size="medium"
            color="secondary"
            onClick={handleUpdate}
            className={classes.button}
          >
            Done
          </Button>
        </Container>
      </Popover>
    </React.Fragment>
  );
};

export default Content;
