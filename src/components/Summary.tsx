import * as React from 'react';
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
  Tag,
} from 'rsuite';
import styled from 'styled-components';

import GoogleAuthContext from './../contexts/useGoogleAuth';

const Style = styled.div`
   {
    padding: 20px;
  }
`;

const { Paragraph } = Placeholder;

const PanelHeader = () => {
  return (
    <FlexboxGrid justify='space-between'>
      <FlexboxGrid.Item colspan={20}>Tue, 18 Feb</FlexboxGrid.Item>
      <FlexboxGrid.Item
        colspan={3}
        style={{
          textAlign: 'right',
        }}
      >
        23:20:56
      </FlexboxGrid.Item>
    </FlexboxGrid>
  );
};
const Summary = () => {
  const { records } = React.useContext(GoogleAuthContext);
  return (
    <Style>
      <Panel header={<PanelHeader />} bordered>
        <List hover>
          {records ? (
            records.map((record, idx) => (
              <List.Item key={idx}>
                <FlexboxGrid justify='space-between' align='middle'>
                  <FlexboxGrid.Item colspan={20}>
                    <p
                      style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {/* Title */}
                      {record[4]}
                    </p>
                  </FlexboxGrid.Item>
                  <FlexboxGrid.Item
                    colspan={4}
                    style={{
                      textAlign: 'right',
                    }}
                  >
                    {/* Time */}
                    {record[6]}
                  </FlexboxGrid.Item>
                </FlexboxGrid>
                <FlexboxGrid
                  justify='space-between'
                  align='middle'
                  style={{
                    marginTop: '1rem',
                  }}
                >
                  <FlexboxGrid.Item colspan={20}>
                    <TagGroup>
                      {/* Ticket */}
                      {record[5] && <Tag>{record[5]}</Tag>}
                      {/* Project */}
                      {record[3] && <Tag>{record[3]}</Tag>}
                      {/* Company */}
                      {record[2] && <Tag>{record[2]}</Tag>}
                    </TagGroup>
                  </FlexboxGrid.Item>
                  <FlexboxGrid.Item
                    colspan={4}
                    style={{
                      textAlign: 'right',
                    }}
                  >
                    <Icon icon='play' size='lg' />
                  </FlexboxGrid.Item>
                </FlexboxGrid>
              </List.Item>
            ))
          ) : (
            <Paragraph />
          )}
        </List>
      </Panel>
    </Style>
  );
};

export default Summary;
