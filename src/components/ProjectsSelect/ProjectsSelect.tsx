import React from "react";

import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Autocomplete, {
  createFilterOptions
} from "@material-ui/lab/Autocomplete";

import GoogleAuthContext from "../../contexts/useGoogleAuth";
import { AppContext } from "../../contexts/AppProvider";
import { ThemeContext } from "../../contexts/ThemeProvider";

import { RecordType } from "../../hooks/useGoogle";

const filter = createFilterOptions();
export interface ProjectsSelectProps {
  record: RecordType;
  setRecord?: (value: RecordType) => void;
}
export interface ProjectOptionType {
  id?: string;
  company: string;
  project: string;
  description: string;
  inputValue?: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    scrollPaper: {
      display: "block",
      marginTop: theme.spacing(11)
    },
    paper: {
      backgroundColor: "#585858",
      margin: 0
    },
    groupLabel: {
      backgroundColor: "#484848",
      paddingTop: 0
    }
  })
);

const ProjectsSelect: React.FC<ProjectsSelectProps> = ({
  record,
  setRecord
}): JSX.Element => {
  const { projects, addProject, currentUser } = React.useContext(
    GoogleAuthContext
  );
  const { themeName } = React.useContext(ThemeContext);

  const classes = useStyles();
  const { locale } = React.useContext(AppContext);
  const [open, toggleOpen] = React.useState(false);
  const [dialogValue, setDialogValue] = React.useState({
    company: "",
    project: "",
    description: ""
  });

  const handleClose = (): void => {
    setDialogValue({
      company: "",
      project: "",
      description: ""
    });
    toggleOpen(false);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    setRecord &&
      setRecord({
        ...record,
        company: dialogValue.company,
        project: dialogValue.project
      });

    const today = new Date().toLocaleDateString(locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
    const response =
      addProject &&
      (await addProject([
        dialogValue.company,
        dialogValue.project,
        dialogValue.description,
        null,
        today,
        currentUser.getName()
      ]));

    const {
      result: {
        updates: { updatedRange }
      }
    } = response;
    projects.unshift({
      id: updatedRange.replace("projects!", ""),
      company: dialogValue.company,
      project: dialogValue.project
    });
    updatedRange && handleClose();
  };

  return (
    <React.Fragment>
      <Autocomplete
        classes={
          themeName === "darkTheme"
            ? {
                paper: classes.paper,
                groupLabel: classes.groupLabel
              }
            : undefined
        }
        freeSolo
        defaultValue={projects?.find((obj: ProjectOptionType) => {
          return obj.project === record?.project;
        })}
        options={projects}
        onChange={(
          _event: React.ChangeEvent<{}>,
          newValue: ProjectOptionType | null
        ): void => {
          if (newValue) {
            setRecord &&
              setRecord({
                ...record,
                project: newValue.project,
                company: newValue.company
              });

            if (newValue.inputValue) {
              toggleOpen(true);
              setDialogValue({
                project: newValue.inputValue,
                company: "",
                description: ""
              });
            }
          }
        }}
        groupBy={(object: ProjectOptionType): string => object.company}
        getOptionLabel={(option: ProjectOptionType): string => {
          if (typeof option === "string") {
            return option;
          }
          if (option.inputValue) {
            return option.inputValue;
          }
          return option.project;
        }}
        filterOptions={(options, params): ProjectOptionType[] => {
          const filtered = filter(options, params) as ProjectOptionType[];
          if (params.inputValue !== "") {
            filtered.push({
              inputValue: params.inputValue,
              company: "",
              project: `Add "${params.inputValue}"`,
              description: ""
            });
          }
          return filtered;
        }}
        renderOption={(option: ProjectOptionType): string => option.project}
        renderInput={(params): React.ReactNode => (
          <TextField
            {...params}
            fullWidth
            variant="outlined"
            margin="normal"
            name="project"
            placeholder="Add project"
          />
        )}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        classes={{ scrollPaper: classes.scrollPaper }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle id="form-dialog-title">Add a new project</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Did you miss any project in our list?
              <br />
              Please, add it!
            </DialogContentText>
            <TextField
              autoFocus
              variant="outlined"
              fullWidth
              margin="normal"
              value={dialogValue.company}
              onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
                setDialogValue({ ...dialogValue, company: event.target.value })
              }
              placeholder="Add company"
              type="text"
            />
            <TextField
              variant="outlined"
              fullWidth
              margin="normal"
              value={dialogValue.project}
              onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
                setDialogValue({ ...dialogValue, project: event.target.value })
              }
              placeholder="Add project"
              type="text"
            />
            <TextField
              multiline
              variant="outlined"
              fullWidth
              margin="normal"
              rows="4"
              value={dialogValue.description}
              onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
                setDialogValue({
                  ...dialogValue,
                  description: event.target.value
                })
              }
              placeholder="Add description"
              type="text"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="default">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
};

export default ProjectsSelect;
