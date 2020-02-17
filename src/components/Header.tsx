import * as React from "react";
import styled from "styled-components";

import { Box, Button, DropButton, Heading, Text } from "grommet";
import { User, Notification, Configure } from "grommet-icons";
import { GoogleContext } from "../contexts/GoogleContext";

interface HeaderProps {
  className?: string;
  gridArea: string;
}

const Header: React.FC<HeaderProps> = ({ gridArea }) => {
  const [notifcations, setNotifications] = React.useState<any[]>([]);
  const googleUser = React.useContext(GoogleContext);
  console.log(googleUser);
  React.useEffect(() => {
    setNotifications([]);
  }, []);

  return (
    <Box
      gridArea={gridArea}
      height="80px"
      width="100vw"
      direction="row"
      align="center"
    >
      <Box
        background="brand"
        width="300px"
        height="100%"
        align="center"
        justify="center"
        direction="row"
        style={{ cursor: "pointer" }}
      >
        Logo
      </Box>
      <Box
        background="brand"
        align="center"
        justify="between"
        direction="row"
        width="100%"
        height="100%"
        pad="small"
      >
        <Box direction="row" gap="medium">
          <Button>Overview</Button>
        </Box>
        <Box direction="row" alignSelf="end" align="center">
          {/* <TextInput height="50px" style={{ width: '300px' }} /> */}
          <Button icon={<Configure />} />
          <DropButton
            id="header-notification-btn"
            icon={<Notification />}
            dropAlign={{ top: "bottom", right: "left" }}
            dropContent={
              <Box
                id="header-notification-drop-content"
                width="200px"
                height="200px"
                align="center"
                justify="center"
              >
                {notifcations.length > 0 ? (
                  <Box> We have notifications! </Box>
                ) : (
                  <Box>
                    <Text>
                      <i>All Caught Up</i>
                    </Text>
                  </Box>
                )}
              </Box>
            }
          />
          {googleUser && (
            <DropButton
              icon={<User />}
              dropAlign={{ top: "bottom", right: "right" }}
              dropContent={
                <Box
                  id="header-user-drop-content"
                  width="200px"
                  height="200px"
                  align="center"
                  justify="between"
                  direction="column"
                >
                  <Heading level="5">{googleUser.name}</Heading>
                </Box>
              }
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default styled(Header)``;
