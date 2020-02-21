import * as React from "react";
import {
  FlexboxGrid,
  Panel,
  Form,
  FormControl,
  IconButton,
  Icon
} from "rsuite";
import styled from "styled-components";

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
  const [isActive, setIsActive] = React.useState(false);
  const [seconds, setSeconds] = React.useState(0);

  const getTimeFromSeconds = (totalSeconds: number): string => {
    //const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    return `${("0" + hours).slice(-2)}:${("0" + minutes).slice(-2)}:${(
      "0" + seconds
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

  const handleOnStart = () => {
    setIsActive(true);
  };
  const handleOnStop = () => {
    setIsActive(false);
  };

  return (
    <Style>
      <Panel
        shaded
        style={{
          position: "fixed",
          width: "100%",
          zIndex: 10000,
          height: "82px",
          backgroundColor: "white"
        }}
      >
        <Form>
          <FlexboxGrid justify="space-between" align="middle">
            {!isActive ? (
              <>
                <FlexboxGrid.Item colspan={22}>
                  <FormControl
                    name="work"
                    size="lg"
                    placeholder="What are you working on?"
                    width="100%"
                  />
                </FlexboxGrid.Item>
                <FlexboxGrid.Item colspan={2} style={{ textAlign: "right" }}>
                  <IconButton
                    icon={<Icon icon="play" />}
                    color="green"
                    circle
                    onClick={handleOnStart}
                  />
                </FlexboxGrid.Item>
              </>
            ) : (
              <>
                <FlexboxGrid.Item colspan={18}>
                  <FormControl
                    name="description"
                    size="lg"
                    readOnly
                    value="(no description)"
                  />
                </FlexboxGrid.Item>
                <FlexboxGrid.Item colspan={4}>
                  <FormControl
                    name="time"
                    size="lg"
                    readOnly
                    className="timer"
                    value={getTimeFromSeconds(seconds)}
                  />
                </FlexboxGrid.Item>
                <FlexboxGrid.Item colspan={2} style={{ textAlign: "right" }}>
                  <IconButton
                    icon={<Icon icon="stop" />}
                    color="red"
                    circle
                    onClick={handleOnStop}
                  />
                </FlexboxGrid.Item>
              </>
            )}
          </FlexboxGrid>
        </Form>
      </Panel>
    </Style>
  );
};

export default Timer;
