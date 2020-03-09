import * as React from 'react';
import styled from 'styled-components';

import AppContext from './../contexts/useApp';
import GoogleAuthContext from './../contexts/useGoogleAuth';
import { Record } from './../hooks/useGoogle';

import {
  FlexboxGrid,
  Panel,
  Form,
  FormGroup,
  FormControl,
  IconButton,
  Icon,
  Modal,
  Button,
  ButtonToolbar,
  TagPicker,
  SelectPicker,
  Divider,
} from 'rsuite';
import { ItemDataType } from 'rsuite/lib/@types/common';

import { getFraction, getTimeFromSeconds } from '../utils/time';

const Timer: React.FC = (): JSX.Element => {
  const {
    appendRecord,
    updateRecord,
    currentUser,
    deleteRecord,
    projects,
    records,
  } = React.useContext(GoogleAuthContext);

  const {
    locale,
    running,
    toggleRunning,
    reload,
    toggleReload,
  } = React.useContext(AppContext);
  const [seconds, setSeconds] = React.useState<number>(0);
  const [updatedRange, setUpdatedRange] = React.useState<string>('');
  const [colSpan, setColSpan] = React.useState<number>(22);
  const [description, setDescription] = React.useState<string>('');
  const [company, setCompany] = React.useState<string | null>(null);
  const [project, setProject] = React.useState<string | null>(null);
  const [ticket, setTicket] = React.useState<string | null>(null);
  const [show, setShow] = React.useState<boolean>(false);
  const [readOnly, setReadOnly] = React.useState<boolean>(false);

  React.useEffect(() => {
    let interval: number | undefined = undefined;
    if (running) {
      interval = window.setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!running && seconds !== 0) {
      window.clearInterval(interval);
    }
    return (): void => {
      window.clearInterval(interval);
    };
  }, [running, seconds]);

  React.useEffect(() => {
    if (reload && !running) {
      setSeconds(0);
    }
    return (): void => {
      setSeconds(0);
    };
  }, [reload, running]);

  const handleOnChange = React.useCallback((value: string) => {
    setDescription(value);
  }, []);

  const handleEdit = (): void => {
    setShow(true);
  };

  const handlePlay = async (): Promise<void> => {
    toggleRunning && toggleRunning();
    //toggleReload && toggleReload();
    setReadOnly(true);
    setColSpan(16);
    setDescription(description ? description : '(no description)');

    const append =
      appendRecord &&
      (await appendRecord([
        currentUser.getName(),
        new Date().toLocaleDateString(locale, {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }),
        '(no company)',
        '(no project)',
        description ? description : '(no description)',
        '(no ticket)',
        '0',
      ]));

    setUpdatedRange(append?.result?.updates?.updatedRange);
  };

  const handleStop = async (): Promise<void> => {
    const fraction = getFraction(seconds);
    updateRecord &&
      (await updateRecord(updatedRange, [
        null,
        null,
        company,
        project,
        description,
        ticket,
        fraction,
      ]));
    toggleReload && toggleReload();
    toggleRunning && toggleRunning();
    setDescription('');
    setProject(null);
    setCompany(null);
    setTicket(null);

    setReadOnly(false);
    setColSpan(22);
  };

  const handleDelete = (): void => {
    const index = updatedRange.split(':');
    deleteRecord && deleteRecord(parseInt(index[1].slice(1)));
    toggleRunning && toggleRunning();
    setDescription('');
    setProject(null);
    setCompany(null);
    setTicket(null);

    setReadOnly(false);
    setColSpan(22);
    setShow(false);
  };

  const handleOnHide = (): void => {
    setShow(false);
  };

  const handleOnSelect = React.useCallback((_value: string, item: any) => {
    setProject(item.project);
    setCompany(item.company);
  }, []);

  const handleOnTagSelect = React.useCallback((value: string[]) => {
    setTicket(value.join(', '));
  }, []);

  const tickets = Array.from(
    new Set(records?.map((record: Record) => record.ticket))
  ).map(ticket => {
    return records.find((record: Record) => record.ticket === ticket);
  });

  return (
    <Style>
      <Panel
        shaded
        style={{
          position: 'fixed',
          width: '100%',
          zIndex: 10,
          height: '82px',
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          backgroundColor: '#1a1d24',
        }}
      >
        <Form>
          <FlexboxGrid align='middle'>
            <FlexboxGrid.Item colspan={colSpan}>
              <FormControl
                name='description'
                size='lg'
                placeholder='What are you working on?'
                width='100%'
                readOnly={readOnly}
                value={description}
                onChange={handleOnChange}
              />
              <Modal
                full
                size={'lg'}
                show={show}
                backdrop={true}
                onHide={handleOnHide}
              >
                <Modal.Header>
                  <Modal.Title>Edit Timer</Modal.Title>
                </Modal.Header>
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
                        readOnly={true}
                        value={getTimeFromSeconds(seconds)}
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControl
                        name='title'
                        size='lg'
                        placeholder='What are you working on?'
                        width='100%'
                        value={description}
                        onChange={handleOnChange}
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
                        valueKey={'id'}
                        groupBy={'company'}
                        onSelect={(value: string, item: ItemDataType): void =>
                          handleOnSelect(value, item)
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
                        onSelect={(value: any): void =>
                          handleOnTagSelect(value)
                        }
                      />
                    </FormGroup>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <ButtonToolbar>
                    <Button block onClick={handleOnHide} appearance='primary'>
                      Ok
                    </Button>
                    <Button block appearance='default' onClick={handleStop}>
                      Cancel
                    </Button>
                  </ButtonToolbar>
                  <Divider />
                  <Button
                    block
                    onClick={handleDelete}
                    appearance='ghost'
                    color='red'
                  >
                    Delete
                  </Button>
                </Modal.Footer>
              </Modal>
            </FlexboxGrid.Item>
            {!running ? (
              <React.Fragment>
                <FlexboxGrid.Item
                  colspan={2}
                  style={{
                    textAlign: 'right',
                  }}
                >
                  <IconButton
                    icon={<Icon icon='play' />}
                    color='green'
                    circle
                    onClick={handlePlay}
                    data-testid='play-button'
                  />
                </FlexboxGrid.Item>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <FlexboxGrid.Item colspan={4}>
                  <FormControl
                    name='time'
                    size='lg'
                    placeholder='00:00:00'
                    readOnly
                    className='timer'
                    value={getTimeFromSeconds(seconds)}
                  />
                </FlexboxGrid.Item>
                <FlexboxGrid.Item
                  colspan={4}
                  style={{
                    textAlign: 'right',
                  }}
                >
                  <ButtonToolbar>
                    <IconButton
                      icon={<Icon icon='edit2' />}
                      color='blue'
                      circle
                      onClick={handleEdit}
                    />
                    <IconButton
                      icon={<Icon icon='stop' />}
                      color='red'
                      circle
                      onClick={handleStop}
                    />
                  </ButtonToolbar>
                </FlexboxGrid.Item>
              </React.Fragment>
            )}
          </FlexboxGrid>
        </Form>
      </Panel>
    </Style>
  );
};

const Style = styled.div`
  .read-only input {
    border-color: transparent;
    &.timer {
      text-align: right;
    }
  }
  .rs-input {
    &-lg {
      font-weight: 600;
      width: 100%;
    }
  }
`;

export default Timer;
