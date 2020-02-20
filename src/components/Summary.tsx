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
    padding: 0 20px;
    .list-summary {
      box-shadow: none;
      .rs-list-item-lg {
        box-shadow: none;
      }
      .rs-panel-body {
        padding-bottom: 0;
      }
    }
  }
`;

const { Paragraph } = Placeholder;

const PanelHeader = ({ records }: any) => {
  console.log(records);
  const sum = records.reduce((total: number, currentValue: any) => {
    return total + currentValue.time;
  }, 0);
  console.log(sum);
  return (
    <FlexboxGrid justify='space-between'>
      <FlexboxGrid.Item colspan={20}>{records.date}</FlexboxGrid.Item>
      <FlexboxGrid.Item
        colspan={3}
        style={{
          textAlign: 'right',
        }}
      >
        00:00:00
      </FlexboxGrid.Item>
    </FlexboxGrid>
  );
};
const Summary = () => {
  const { records } = React.useContext(GoogleAuthContext);

  const timeConvert = (fraction: number) => {
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
  return (
    <Style>
      <List bordered={false} className='list-summary' size='lg'>
        {records ? (
          Object.keys(records).map(key => (
            <List.Item key={key}>
              <Panel header={<PanelHeader records={records[key]} />} bordered>
                <List hover bordered={false}>
                  {records[key].map((record: any) => {
                    return (
                      <List.Item key={record.id}>
                        <FlexboxGrid justify='space-between' align='middle'>
                          <FlexboxGrid.Item colspan={20}>
                            <p
                              style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {record.description}
                            </p>
                          </FlexboxGrid.Item>
                          <FlexboxGrid.Item
                            colspan={4}
                            style={{
                              textAlign: 'right',
                            }}
                          >
                            {timeConvert(record.time)}
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
                              {<Tag color='blue'>{record.company}</Tag>}
                              {<Tag>{record.ticket}</Tag>}
                              {<Tag>{record.project}</Tag>}
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
                    );
                  })}
                </List>
              </Panel>
            </List.Item>
          ))
        ) : (
          <Paragraph />
        )}
      </List>
    </Style>
  );
};

export default Summary;
