import * as React from 'react';
import styled from 'styled-components';
import GoogleAuthContext from './../contexts/useGoogleAuth';
import {
  Icon,
  FlexboxGrid,
  Panel,
  Placeholder,
  List,
  TagGroup,
  Tag,
  ButtonToolbar,
  IconButton,
} from 'rsuite';
import { Record } from './../hooks/useGoogle';
import Edit from './Edit';

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

const PanelHeader = ({ date, data }: any) => {
  const total = data.reduce((acc: any, curr: any) => {
    return acc + curr.time;
  }, 0);

  const splits = date.split('.');
  const formatedDate = new Date(splits.reverse().join('-')).toLocaleDateString(
    'de-DE',
    {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
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
  const { records, loadTable } = React.useContext(GoogleAuthContext);
  const [reload, setReload] = React.useState(false);

  const [show, setShow] = React.useState(false);
  const [record, setRecord] = React.useState();

  React.useEffect(() => {
    if (reload && !show) {
      //Load spredsheet data
      loadTable && loadTable();
    }
  }, [reload, show]);

  const data =
    records &&
    records.reduce((r: any, a: any) => {
      r[a.date] = r[a.date] || [];
      r[a.date].push(a);
      return r;
    }, Object.create(null));

  const handleToogleEdit = (record: any) => {
    setShow(!show);
    setRecord(record);
  };

  const handleOnHide = () => {
    setShow(false);
  };
  return (
    <Style>
      <Edit
        show={show}
        record={record}
        onHide={handleOnHide}
        onReload={setReload}
      />
      <List bordered={false} className='list-summary' size='lg'>
        {data ? (
          Object.keys(data).map((date: string) => {
            return (
              <List.Item key={date}>
                <Panel
                  header={<PanelHeader date={date} data={data[date]} />}
                  bordered
                  shaded
                >
                  <List bordered={false}>
                    {data[date].map((record: Record) => {
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
                                {record.project && (
                                  <Tag>{record.project && record.project}</Tag>
                                )}
                                {record.ticket && <Tag>{record.ticket}</Tag>}
                              </TagGroup>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item
                              colspan={4}
                              style={{
                                textAlign: 'right',
                              }}
                            >
                              <ButtonToolbar>
                                <IconButton
                                  circle
                                  appearance='subtle'
                                  color='blue'
                                  icon={<Icon icon='edit2' size='lg' />}
                                  onClick={() => handleToogleEdit(record)}
                                />
                                <IconButton
                                  circle
                                  appearance='subtle'
                                  color='green'
                                  icon={<Icon icon='play' size='lg' />}
                                />
                              </ButtonToolbar>
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

export default Summary;
