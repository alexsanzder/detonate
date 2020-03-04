import * as React from 'react';
import GoogleAuthContext from './../contexts/useGoogleAuth';

import {
  FlexboxGrid,
  Panel,
  Form,
  FormGroup,
  FormControl,
  IconButton,
  Icon,
  Drawer,
  Modal,
  Button,
  ButtonToolbar,
  InputPicker,
} from 'rsuite';
import styled from 'styled-components';

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

const Timer: React.FC = (): JSX.Element => {
  const {
    appendRecord,
    updateRecord,
    currentUser,
    loadTable,
    projects,
  } = React.useContext(GoogleAuthContext);

  const [isActive, setIsActive] = React.useState(false);
  const [isReload, setIsReload] = React.useState(false);
  const [seconds, setSeconds] = React.useState(0);

  const [updatedRange, setUpdatedRange] = React.useState();
  const [colSpan, setColSpan] = React.useState(22);

  const [mode, setMode] = React.useState('default');
  const readOnly = mode === 'readonly';

  const [value, setValue] = React.useState('');
  const [show, setShow] = React.useState(false);

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
    if (isActive) {
      interval = window.setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      window.clearInterval(interval);
    }
    return () => window.clearInterval(interval);
  }, [isActive, seconds]);

  React.useEffect(() => {
    if (isReload && !isActive) {
      setSeconds(0);

      //Load spredsheet data
      loadTable && loadTable();
    }
  }, [isReload, isActive]);

  const handleOnChange = React.useCallback((value: string) => {
    setValue(value);
  }, []);

  const handleOnClick = () => {
    setShow(true);
  };

  const handleOnStart = async () => {
    setIsReload(false);
    setIsActive(true);
    setMode('readonly');
    setColSpan(17);
    setValue(value.length > 0 ? value : '(no description)');

    const append =
      appendRecord &&
      (await appendRecord([
        currentUser.getName(),
        new Date().toLocaleDateString('de-DE', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }),
        'no company',
        'no project',
        value.length > 0 ? value : '(no description)',
        'no ticket',
        '=now()',
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
        null,
        null,
        value,
        null,
        fraction,
      ]);
    setIsReload(true);
    setIsActive(false);
    setValue('');
    setMode('default');
    setColSpan(22);
  };

  const handleOnHide = () => {
    setShow(false);
  };
  return (
    <Style>
      <Panel
        shaded
        style={{
          position: 'fixed',
          width: '100%',
          zIndex: 1000,
          height: '82px',
          backgroundColor: 'white',
        }}
      >
        <Form>
          <FlexboxGrid justify='space-between' align='middle'>
            <FlexboxGrid.Item colspan={colSpan}>
              <FormControl
                name='description'
                size='lg'
                placeholder='What are you working on?'
                width='100%'
                readOnly={readOnly}
                value={value}
                onChange={handleOnChange}
              />
              <Modal
                full
                size={'lg'}
                show={show}
                backdrop={true}
                onHide={handleOnHide}
              >
                <Modal.Body>
                  <Form fluid>
                    <FormGroup>
                      <FormControl
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
                        value={value}
                        onChange={handleOnChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControl
                        block
                        name='company'
                        size='lg'
                        accepter={InputPicker}
                        data={projects}
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControl
                        block
                        name='project'
                        size='lg'
                        accepter={InputPicker}
                        data={projects}
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControl
                        block
                        creatable
                        name='ticket'
                        size='lg'
                        accepter={InputPicker}
                        data={projects}
                      />
                    </FormGroup>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={handleOnHide} appearance='primary'>
                    Ok
                  </Button>
                  <Button onClick={handleOnHide} appearance='subtle'>
                    Cancel
                  </Button>
                </Modal.Footer>
              </Modal>
              {/* <Drawer
                full
                show={show}
                placement='top'
                backdrop={true}
                onHide={handleOnHide}
              >
                <Drawer.Header></Drawer.Header>
                <Drawer.Body>
                  <Form></Form>
                </Drawer.Body>
                <Drawer.Footer style={{ bottom: '10px' }}>
                  <Button onClick={handleOnHide} appearance='primary'>
                    Confirm
                  </Button>
                  <Button onClick={handleOnHide} appearance='subtle'>
                    Cancel
                  </Button>
                </Drawer.Footer>
              </Drawer> */}
            </FlexboxGrid.Item>
            {!isActive ? (
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
                  colspan={3}
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

export default Timer;
