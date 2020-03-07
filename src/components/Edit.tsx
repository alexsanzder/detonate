import * as React from 'react';
import styled from 'styled-components';

import AppContext from './../contexts/useApp';
import GoogleAuthContext from './../contexts/useGoogleAuth';
import { Record } from './../hooks/useGoogle';

import {
  Form,
  FormGroup,
  FormControl,
  Modal,
  Button,
  ButtonToolbar,
  TagPicker,
  SelectPicker,
  Divider,
} from 'rsuite';
import { ItemDataType } from 'rsuite/lib/@types/common';

type EditProps = {
  show: boolean;
  record: Record;
  onHide: () => void;
};

const Edit: React.FC<EditProps> = ({
  show,
  record,
  onHide,
}: EditProps): JSX.Element => {
  const { toggleReload } = React.useContext(AppContext);

  const { projects, records, updateRecord } = React.useContext(
    GoogleAuthContext
  );

  const [time, setTime] = React.useState<string | null>(null);
  const [description, setDescription] = React.useState<string | null>(null);
  const [company, setCompany] = React.useState<string | null>(null);
  const [project, setProject] = React.useState<string | null>(null);
  const [ticket, setTicket] = React.useState<string[]>([]);

  const getSeconds = (time: string): number => {
    return time
      .split(':')
      .reverse()
      .reduce((prev, curr, i) => prev + parseInt(curr) * Math.pow(60, i), 0);
  };

  const fractionConvert = (seconds: number): number => {
    const hours = seconds / (60 * 60);
    return hours;
  };

  const timeFormat = (fraction: number): string => {
    const hours = Math.floor(fraction);
    const allseconds = 3600 * (fraction - hours);
    const minutes = Math.floor(allseconds / 60);
    const seconds = Math.floor(allseconds % 60);

    const formatted =
      ('0' + (hours % 12)).substr(-2) +
      ':' +
      ('0' + minutes).substr(-2) +
      ':' +
      ('0' + seconds).substr(-2);

    return formatted;
  };

  const tickets =
    records &&
    Array.from(new Set(records.map((record: Record) => record.ticket))).map(
      ticket => {
        return records.find((record: Record) => record.ticket === ticket);
      }
    );

  const handleUpdate = (): void => {
    const seconds = time ? getSeconds(time) : 0;
    const fraction = fractionConvert(seconds);

    updateRecord &&
      updateRecord(record.id, [
        null,
        null,
        company,
        project,
        description ? description : '(no description)',
        ticket && ticket.join(', '),
        fraction,
      ]);
    toggleReload && toggleReload();
    onHide();
  };

  const handleOnTimeChange = React.useCallback((value: string) => {
    setTime(value);
  }, []);

  const handleOnDescriptionChange = React.useCallback((value: string) => {
    setDescription(value);
  }, []);

  const handleProjectChange = React.useCallback((value: string) => {
    setProject(value);
  }, []);

  const handleTicketChange = React.useCallback((value: string[]) => {
    setTicket(value);
  }, []);

  const handleOnProjectSelect = React.useCallback(
    (value: string, item: any) => {
      setProject(item.project);
      setCompany(item.company);
    },
    []
  );

  const handleOnTicketSelect = React.useCallback((value: string[]) => {
    setTicket(value);
  }, []);

  const handleOnShow = () => {
    setTime(timeFormat(record.time));
    setDescription(record.description);
    setProject(record.project);
    setTicket(record.ticket.split(', '));
  };

  return (
    <Style>
      <Modal
        full
        size={'lg'}
        show={show}
        backdrop={true}
        onHide={onHide}
        onShow={handleOnShow}
      >
        <Modal.Header>
          <Modal.Title>Edit Timer</Modal.Title>
        </Modal.Header>
        {record && (
          <Modal.Body>
            <Form fluid>
              <FormGroup>
                <FormControl
                  style={{
                    padding: 4,
                    color: '#999',
                    textAlign: 'center',
                    fontSize: 'x-large',
                  }}
                  name='timer'
                  size='lg'
                  readOnly={false}
                  value={time}
                  onChange={handleOnTimeChange}
                />
              </FormGroup>
              <FormGroup>
                <FormControl
                  name='description'
                  size='lg'
                  placeholder='What are you working on?'
                  width='100%'
                  defaultValue='(no description)'
                  value={description}
                  onChange={handleOnDescriptionChange}
                />
              </FormGroup>
              <FormGroup>
                <FormControl
                  block
                  name='project'
                  size='lg'
                  accepter={SelectPicker}
                  placeholder='Project?'
                  data={projects}
                  labelKey={'project'}
                  valueKey={'project'}
                  groupBy={'company'}
                  value={project}
                  onChange={handleProjectChange}
                  onSelect={(value: string, item: ItemDataType): void =>
                    handleOnProjectSelect(value, item)
                  }
                />
              </FormGroup>

              <FormGroup>
                <FormControl
                  block
                  creatable
                  name='ticket'
                  size='lg'
                  accepter={TagPicker}
                  placeholder='Ticket?'
                  data={tickets}
                  labelKey={'ticket'}
                  valueKey={'ticket'}
                  value={ticket}
                  onChange={handleTicketChange}
                  onSelect={(value: string[]): void =>
                    handleOnTicketSelect(value)
                  }
                />
              </FormGroup>
            </Form>
          </Modal.Body>
        )}
        <Modal.Footer>
          <ButtonToolbar>
            <Button block appearance='default' onClick={onHide}>
              Cancel
            </Button>
            <Button block appearance='primary' onClick={handleUpdate}>
              Ok
            </Button>
          </ButtonToolbar>
          <Divider />
          <Button block appearance='ghost' color='red'>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Style>
  );
};

const Style = styled.div``;

export default Edit;
