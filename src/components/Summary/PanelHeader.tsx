import * as React from "react";
import styled from "styled-components";

import { FlexboxGrid } from "rsuite";

import AppContext from "../../contexts/useApp";
import { getTimeFormated } from "../../utils/time";

type PanelHeaderProps = {
  date: string;
  data: string[];
};

const PanelHeader: React.FC<PanelHeaderProps> = ({
  date,
  data
}: PanelHeaderProps): JSX.Element => {
  const { locale } = React.useContext(AppContext);
  const total = data.reduce((acc: number, curr: any) => {
    return acc + curr.time;
  }, 0);

  const splits = date.split(".");
  const formatedDate = new Date(splits.reverse().join("-")).toLocaleDateString(
    locale,
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    }
  );
  return (
    <Style>
      <FlexboxGrid justify="space-between">
        <FlexboxGrid.Item colspan={20}>{formatedDate}</FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={3}>
          {getTimeFormated(total)}
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </Style>
  );
};

const Style = styled.div`
  .rs-flex-box-grid-item-3 {
    textalign: right;
  }
`;

export default PanelHeader;
