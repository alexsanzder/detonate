import * as React from "react";
import {
  Content,
  FlexboxGrid,
  Panel,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Placeholder,
  Button,
  List,
  IconButton,
  IconStack,
  Icon,
  TagGroup,
  Tag
} from "rsuite";
import styled from "styled-components";

const Style = styled.div`
   {
    padding: 20px;
  }
`;

const { Paragraph } = Placeholder;

const PanelHeader = () => {
  return (
    <FlexboxGrid justify="space-between">
      <FlexboxGrid.Item colspan={20}>Tue, 18 Feb</FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={3} style={{ textAlign: "right" }}>
        23:20:56
      </FlexboxGrid.Item>
    </FlexboxGrid>
  );
};
const Summary = () => {
  return (
    <Style>
      <Panel header={<PanelHeader />} bordered>
        <List hover>
          <List.Item>
            <FlexboxGrid justify="space-between" align="middle">
              <FlexboxGrid.Item colspan={20}>
                <p
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}
                >
                  CREATEAPP-56 Change Webpack allowing sass and less loaders
                </p>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={4} style={{ textAlign: "right" }}>
                00:43:10
              </FlexboxGrid.Item>
            </FlexboxGrid>
            <FlexboxGrid
              justify="space-between"
              align="middle"
              style={{ marginTop: "1rem" }}
            >
              <FlexboxGrid.Item colspan={20}>
                <TagGroup>
                  <Tag>CREATEAPP-60</Tag>
                  <Tag>Facebook</Tag>
                </TagGroup>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={4} style={{ textAlign: "right" }}>
                <Icon icon="play" size="lg" />
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </List.Item>
        </List>
      </Panel>
    </Style>
  );
};

export default Summary;
