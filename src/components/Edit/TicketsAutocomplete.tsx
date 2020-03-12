import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import Autocomplete, {
  createFilterOptions
} from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Chip from "@material-ui/core/Chip";

import GoogleAuthContext from "../../contexts/useGoogleAuth";

const filter = createFilterOptions();
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export interface TicketsAutocompleteProps {
  record: any;
  setRecord?: (value: any) => void;
}

export interface TicketOptionType {
  inputValue?: string;
  ticket: string;
  id?: number;
}
const TicketsAutocomplete: React.FC<TicketsAutocompleteProps> = ({
  record,
  setRecord
}) => {
  const { tickets } = React.useContext(GoogleAuthContext);

  return (
    <Autocomplete
      multiple
      freeSolo
      disableCloseOnSelect
      defaultValue={[
        tickets.find(
          (element: TicketOptionType) => element.ticket === record?.ticket
        )
      ]}
      options={tickets && (tickets as TicketOptionType[])}
      onChange={(
        _event: React.ChangeEvent<{}>,
        newValue: TicketOptionType[]
      ): void => {
        const options = newValue.map((option: TicketOptionType) => {
          if (option && option.inputValue) {
            return option.inputValue;
          }
          return option?.ticket;
        });
        setRecord &&
          setRecord({
            ...record,
            ticket: options.length > 0 ? options.join(", ") : options
          });
      }}
      getOptionLabel={(option: TicketOptionType): string => {
        if (typeof option === "string") {
          return option;
        }
        if (option.inputValue) {
          return option.inputValue;
        }
        return option.ticket;
      }}
      filterOptions={(options, params): TicketOptionType[] => {
        const filtered = filter(options, params) as TicketOptionType[];
        if (params.inputValue !== "") {
          filtered.push({
            inputValue: params.inputValue,
            ticket: `Add "${params.inputValue}"`
          });
        }
        return filtered;
      }}
      renderOption={(option, { selected }): React.ReactNode => (
        <React.Fragment>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option?.ticket}
        </React.Fragment>
      )}
      renderTags={(value: TicketOptionType[], getTagProps): React.ReactNode =>
        value.map(
          (option: TicketOptionType, index: number) =>
            option && (
              <Chip
                key={index}
                variant="outlined"
                label={option?.ticket.replace("Add ", "")}
                {...getTagProps({ index })}
              />
            )
        )
      }
      renderInput={(params): React.ReactNode => (
        <TextField
          {...params}
          fullWidth
          variant="outlined"
          margin="normal"
          name="ticket"
          placeholder="Add ticket"
        />
      )}
    />
  );
};

export default TicketsAutocomplete;
