import * as React from 'react';
import {
  Icon,
  FlexboxGrid,
  Panel,
  Placeholder,
  List,
  TagGroup,
  Tag,
} from 'rsuite';
import styled from 'styled-components';
import GoogleAuthContext from './../contexts/useGoogleAuth';
import { Record } from './../hooks/useGoogle';

const Style = styled.div`
  padding: 10px 20px;
  margin-top: 82px;
  .list-summary {
    box-shadow: none;
    .rs-list-item-lg {
      box-shadow: none;
    }
    .rs-panel-body {
      padding-bottom: 0;
    }
  }
`;

const timeConvert = (fraction: number): string => {
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

const PanelHeader = ({ date, records }: any) => {
  const total = records.reduce((acc: any, curr: any) => {
    return acc + curr.time;
  }, 0);
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const splits = date.split('.');
  const formatedDate = new Date(splits.reverse().join('-')).toLocaleDateString(
    'de-DE',
    options
  );
  return (
    <FlexboxGrid justify='space-between'>
      <FlexboxGrid.Item colspan={20}>{formatedDate}</FlexboxGrid.Item>
      <FlexboxGrid.Item
        colspan={3}
        style={{
          textAlign: 'right',
        }}
      >
        {timeConvert(total)}
      </FlexboxGrid.Item>
    </FlexboxGrid>
  );
};
const Summary = () => {
  const { records } = React.useContext(GoogleAuthContext);

  return (
    <Style>
      <List bordered={false} className='list-summary' size='lg'>
        {records ? (
          Object.keys(records).map((date: string) => {
            return (
              <List.Item key={date}>
                <Panel
                  header={<PanelHeader date={date} records={records[date]} />}
                  bordered
                  shaded
                >
                  <List hover bordered={false}>
                    {records[date].map((record: Record) => {
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
                                {record.company && <Tag>{record.company}</Tag>}
                                {record.ticket && <Tag>{record.ticket}</Tag>}
                                {record.project && (
                                  <Tag>{record.project && record.project}</Tag>
                                )}
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
            );
          })
        ) : (
          <List.Item>
            <Panel
              header={<Placeholder.Grid rows={1} columns={2} active />}
              bordered
              shaded
            >
              <List bordered={false}>
                <List.Item>
                  <Placeholder.Grid rows={2} columns={2} active />
                </List.Item>
                <List.Item>
                  <Placeholder.Grid rows={2} columns={2} active />
                </List.Item>
              </List>
            </Panel>
          </List.Item>
        )}
      </List>
    </Style>
  );
};

export default Summary;
