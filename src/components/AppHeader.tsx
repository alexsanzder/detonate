import * as React from "react";
import {
  Header,
  Nav,
  Navbar,
  Dropdown,
  Icon,
  Avatar,
  Whisper,
  Tooltip
} from "rsuite";
import styled from "styled-components";

import GoogleAuthContext from "./../contexts/useGoogleAuth";

const Style = styled.div`
  .rs-avatar {
    margin: 8px;
  }
`;

const tooltip = <Tooltip>Open Google Sheets</Tooltip>;

const AppHeader: React.FC = () => {
  const { currentUser, handleSignOut } = React.useContext(GoogleAuthContext);

  return (
    <Style>
      <Header>
        <Navbar appearance="inverse">
          <Navbar.Header>Time Sheets</Navbar.Header>
          <Navbar.Body>
            <Nav pullRight>
              <Whisper placement="bottom" trigger="hover" speaker={tooltip}>
                <Nav.Item icon={<Icon icon="table" size="lg" />}></Nav.Item>
              </Whisper>

              <Dropdown
                placement="bottomEnd"
                renderTitle={(): JSX.Element => {
                  return (
                    <Avatar
                      circle
                      src={currentUser && currentUser.getImageUrl()}
                      alt="AS"
                    >
                      AS
                    </Avatar>
                  );
                }}
              >
                <Dropdown.Item>
                  <Icon icon="cog" /> Settings
                </Dropdown.Item>
                <Dropdown.Item divider />
                <Dropdown.Item onClick={handleSignOut}>
                  <Icon icon="sign-out" /> Logout
                </Dropdown.Item>
              </Dropdown>
            </Nav>
          </Navbar.Body>
        </Navbar>
      </Header>
    </Style>
  );
};

export default AppHeader;
