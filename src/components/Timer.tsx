import * as React from 'react';
import GoogleAuthContext from './../contexts/useGoogleAuth';

import {
  FlexboxGrid,
  Panel,
  Form,
  FormControl,
  IconButton,
  Icon,
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

const Timer = () => {
  const {
    appendRecord,
    updateRecord,
    currentUser,
    loadTable,
  } = React.useContext(GoogleAuthContext);
  const [isActive, setIsActive] = React.useState(false);
  const [isReload, setIsReload] = React.useState(false);

  const [seconds, setSeconds] = React.useState(0);

  const [updatedRange, setUpdatedRange] = React.useState();

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

  const handleStart = async () => {
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
        'Working on',
        'no ticket',
        '=now()',
      ]));

    const { result } = append;
    setUpdatedRange(result.updates.updatedRange);
    setIsReload(false);
    setIsActive(true);
  };

  const handleStop = () => {
    const fraction = fractionConvert(seconds);
    updateRecord &&
      updateRecord(updatedRange, [
        null,
        null,
        null,
        null,
        null,
        null,
        fraction,
      ]);
    setIsReload(true);
    setIsActive(false);
  };

  return (
    <Style>
      <Panel
        shaded
        style={{
          position: 'fixed',
          width: '100%',
          zIndex: 10000,
          height: '82px',
          backgroundColor: 'white',
        }}
      >
        <Form>
          {!isActive ? (
            <FlexboxGrid justify='space-between' align='middle'>
              <FlexboxGrid.Item colspan={22}>
                <FormControl
                  name='work'
                  size='lg'
                  placeholder='What are you working on?'
                  width='100%'
                />
              </FlexboxGrid.Item>
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
                  onClick={handleStart}
                />
              </FlexboxGrid.Item>
            </FlexboxGrid>
          ) : (
            <FlexboxGrid justify='space-between' align='middle'>
              <FlexboxGrid.Item colspan={18}>
                <FormControl
                  name='description'
                  size='lg'
                  readOnly
                  value='(no description)'
                />
              </FlexboxGrid.Item>
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
                colspan={2}
                style={{
                  textAlign: 'right',
                }}
              >
                <IconButton
                  icon={<Icon icon='stop' />}
                  color='red'
                  circle
                  onClick={handleStop}
                />
              </FlexboxGrid.Item>
            </FlexboxGrid>
          )}
        </Form>
      </Panel>
    </Style>
  );
};

export default Timer;
