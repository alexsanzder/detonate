import * as React from "react";
import {
  FlexboxGrid,
  Panel,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Placeholder,
  Input,
  IconButton,
  Icon
} from "rsuite";
import styled from "styled-components";
import FlexboxGridItem from "rsuite/lib/FlexboxGrid/FlexboxGridItem";

const Style = styled.div``;

const { Paragraph } = Placeholder;
const Timer = () => {
  return (
    <Style>
      <Panel bordered>
        <Form>
          <FlexboxGrid justify="space-between" align="middle">
            <FlexboxGrid.Item colspan={21}>
              <Input
                width="100%"
                name="timer"
                size="lg"
                placeholder="What are you working on?"
              />
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={2} style={{ textAlign: "right" }}>
              <IconButton icon={<Icon icon="play" />} color="green" circle />
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </Form>
      </Panel>
    </Style>
  );
};

export default Timer;
