import * as React from 'react';
import styled from 'styled-components';

import AppContext from './../contexts/useApp';
import GoogleAuthContext from './../contexts/useGoogleAuth';

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

const Timer: React.FC = (): JSX.Element => {
  const {
    appendRecord,
    updateRecord,
    currentUser,
    loadTable,
    projects,
    records,
  } = React.useContext(GoogleAuthContext);

  const { locale, running, toggleRunning } = React.useContext(AppContext);

  const [isReload, setIsReload] = React.useState(false);
  const [seconds, setSeconds] = React.useState(0);
  const [updatedRange, setUpdatedRange] = React.useState();
  const [colSpan, setColSpan] = React.useState(22);
  const [description, setDescription] = React.useState<string>('');
  const [company, setCompany] = React.useState<string | null>(null);
  const [project, setProject] = React.useState<string | null>(null);
  const [ticket, setTicket] = React.useState<string | null>(null);
  const [show, setShow] = React.useState(false);
  const [readOnly, setReadOnly] = React.useState(false);

  const fractionConvert = (seconds: number): number => {
    const hours = seconds / (60 * 60);
    return hours;
  };

  const getTimeFromSeconds = (totalSeconds: number): string => {
    //const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    return `${('0' + hours).slice(-2)}:${('0' + minutes).slice(-2)}:${(
      '0' + seconds
    ).slice(-2)}`;
  };

  React.useEffect(() => {
    let interval: number | undefined = undefined;
    if (running) {
      interval = window.setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!running && seconds !== 0) {
      window.clearInterval(interval);
    }
    return () => window.clearInterval(interval);
  }, [running, seconds]);

  React.useEffect(() => {
    if (isReload && !running) {
      setSeconds(0);

      //Load spredsheet data
      loadTable && loadTable();
    }
  }, [isReload, running]);

  const handleOnChange = React.useCallback((value: string) => {
    setDescription(value);
  }, []);

  const handleOnClick = () => {
    setShow(true);
  };

  const handleOnStart = async () => {
    setIsReload(false);
    toggleRunning && toggleRunning();
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

    const { result } = append;
    setUpdatedRange(result.updates.updatedRange);
  };

  const handleOnStop = (): void => {
    const fraction = fractionConvert(seconds);
    updateRecord &&
      updateRecord(updatedRange, [
        null,
        null,
        company,
        project,
        description,
        ticket,
        fraction,
      ]);
    setIsReload(true);
    toggleRunning && toggleRunning();
    setDescription('');
    setProject(null);
    setCompany(null);
    setTicket(null);

    setReadOnly(false);
    setColSpan(22);
  };

  const handleOnHide = () => {
    setShow(false);
  };

  const handleOnSelect = React.useCallback((value: string, item: any) => {
    setProject(item.project);
    setCompany(item.company);
  }, []);

  const handleOnTagSelect = React.useCallback((value: string[]) => {
    setTicket(value.join(', '));
  }, []);

  const uniqueTickets = Array.from(
    new Set(records?.map((a: any) => a.ticket))
  ).map(ticket => {
    return records.find((a: any) => a.ticket === ticket);
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
                        onSelect={(value: any, item: any) =>
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
                        data={uniqueTickets}
                        labelKey={'ticket'}
                        valueKey={'ticket'}
                        onSelect={(value: any) => handleOnTagSelect(value)}
                      />
                    </FormGroup>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <ButtonToolbar>
                    <Button block onClick={handleOnHide} appearance='primary'>
                      Ok
                    </Button>
                    <Button block onClick={handleOnHide} appearance='default'>
                      Cancel
                    </Button>
                  </ButtonToolbar>
                  <Divider />
                  <Button
                    block
                    onClick={handleOnHide}
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
                    onClick={handleOnStart}
                  />
                </FlexboxGrid.Item>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <FlexboxGrid.Item colspan={4}>
                  <FormControl
                    name='time'
                    size='lg'
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
                      onClick={handleOnClick}
                    />
                    <IconButton
                      icon={<Icon icon='stop' />}
                      color='red'
                      circle
                      onClick={handleOnStop}
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
