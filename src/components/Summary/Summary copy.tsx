import * as React from "react";
import styled from "styled-components";

import { AppContext } from "../../contexts/AppProvider";
import GoogleAuthContext from "../../contexts/useGoogleAuth";

import {
  Icon,
  FlexboxGrid,
  Panel,
  Placeholder,
  List,
  TagGroup,
  Tag,
  ButtonToolbar,
  IconButton
} from "rsuite";
import { RecordType } from "../../hooks/useGoogle";
// import Edit from "../Edit/Edit";
import PanelHeader from "./PanelHeader";

import { getTimeFormated } from "../../utils/time";

const Summary = (): JSX.Element => {
  const { reload, toggleReload } = React.useContext(AppContext);
  const { records, loadTable } = React.useContext(GoogleAuthContext);

  const [show, setShow] = React.useState(false);
  const [record, setRecord] = React.useState();

  React.useEffect(() => {
    if (reload) {
      toggleReload && toggleReload(true);
      //Load spredsheet data
      loadTable && loadTable();
    }
  }, [reload, toggleReload, loadTable]);

  const data = records?.reduce((r: any, a: RecordType) => {
    r[a.date] = r[a.date] || [];
    r[a.date].push(a);
    return r;
  }, Object.create(null));

  const handleToogleEdit = (record: RecordType): void => {
    setShow(!show);
    setRecord(record);
  };

  const handleHide = (): void => {
    setShow(false);
  };
  return (
    <Style>
      {/* <Edit show={show} record={record} onHide={handleHide} /> */}
      <List bordered={false} className="list-summary" size="lg">
        {data ? (
          Object.keys(data).map(
            (date: string) =>
              data[date][0].time !== undefined && (
                <List.Item key={date}>
                  <Panel
                    header={<PanelHeader date={date} data={data[date]} />}
                    bordered
                    shaded
                  >
                    <List bordered={false}>
                      {data[date].map((record: RecordType) => {
                        return (
                          <List.Item key={record.id}>
                            <FlexboxGrid justify="space-between" align="middle">
                              <FlexboxGrid.Item colspan={20}>
                                <p
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis"
                                  }}
                                >
                                  {record.description}
                                </p>
                              </FlexboxGrid.Item>
                              <FlexboxGrid.Item
                                colspan={4}
                                style={{
                                  textAlign: "right"
                                }}
                              >
                                {getTimeFormated(record.time)}
                              </FlexboxGrid.Item>
                            </FlexboxGrid>
                            <FlexboxGrid
                              justify="space-between"
                              align="middle"
                              style={{
                                marginTop: "1rem"
                              }}
                            >
                              <FlexboxGrid.Item colspan={20}>
                                <TagGroup>
                                  {record.company && (
                                    <Tag>{record.company}</Tag>
                                  )}
                                  {record.project && (
                                    <Tag>
                                      {record.project && record.project}
                                    </Tag>
                                  )}
                                  {record.ticket && <Tag>{record.ticket}</Tag>}
                                </TagGroup>
                              </FlexboxGrid.Item>
                              <FlexboxGrid.Item
                                colspan={4}
                                style={{
                                  textAlign: "right"
                                }}
                              >
                                <ButtonToolbar>
                                  <IconButton
                                    circle
                                    appearance="subtle"
                                    color="blue"
                                    icon={<Icon icon="edit2" size="lg" />}
                                    onClick={(): void =>
                                      handleToogleEdit(record)
                                    }
                                  />
                                  <IconButton
                                    circle
                                    appearance="subtle"
                                    color="green"
                                    icon={<Icon icon="play" size="lg" />}
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
              )
          )
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
