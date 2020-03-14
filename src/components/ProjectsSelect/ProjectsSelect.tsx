import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

import GoogleAuthContext from "../../contexts/useGoogleAuth";

export interface ProjectsSelectProps {
  record: any;
  setRecord?: (value: any) => void;
}

export interface ProjectOptionType {
  project: string;
  company: string;
  id?: string;
}
const ProjectsSelect: React.FC<ProjectsSelectProps> = ({
  record,
  setRecord
}): JSX.Element => {
  const { projects } = React.useContext(GoogleAuthContext);

  return (
    <Autocomplete
      defaultValue={projects?.find((obj: any) => {
        return obj.project === record.project;
      })}
      options={projects}
      onChange={(
        _event: React.ChangeEvent<{}>,
        newValue: ProjectOptionType | null
      ): void => {
        setRecord &&
          setRecord({
            ...record,
            company: newValue?.company,
            project: newValue?.project
          });
      }}
      groupBy={(object: ProjectOptionType): string => object.company}
      getOptionLabel={(object: ProjectOptionType): string => object.project}
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
  );
};

export default ProjectsSelect;
