import * as React from 'react';
import {
  Header,
  Nav,
  Navbar,
  Dropdown,
  Icon,
  Avatar,
  Whisper,
  Tooltip,
} from 'rsuite';
import styled from 'styled-components';

import GoogleAuthContext from '../contexts/useGoogleAuth';
import logo from '.././logo-detonate2.svg';
const Style = styled.div`
  .rs-avatar {
    margin: 5px 15px 5px 5px;
  }
`;

const tooltip = <Tooltip>Open Google Sheets</Tooltip>;

const AppHeader: React.FC = () => {
  const { currentUser, handleSignOut } = React.useContext(GoogleAuthContext);

  return (
    <Style>
      <Header style={{ position: 'fixed', width: '100%', zIndex: 1000 }}>
        <Navbar appearance='inverse'>
          <Navbar.Header>
            <img
              src={logo}
              alt='Detoanate Time Tracking'
              height={50}
              style={{ padding: '10px 15px 5px 15px', cursor: 'none' }}
            />
          </Navbar.Header>
          <Navbar.Body>
            <Nav pullRight>
              <Whisper placement='bottom' trigger='hover' speaker={tooltip}>
                <Nav.Item
                  target='_blank'
                  href='https://docs.google.com/spreadsheets/d/1aPo1wlEXueb6poGt7X3XjYVy-VPDaGJhOO5pNBMdl48/edit#gid=1594442596'
                  icon={<Icon icon='external-link' size='lg' />}
                ></Nav.Item>
              </Whisper>

              <Dropdown
                placement='bottomEnd'
                renderTitle={(): JSX.Element => {
                  return (
                    <Avatar
                      circle
                      src={currentUser && currentUser.getImageUrl()}
                      alt='AS'
                    >
                      AS
                    </Avatar>
                  );
                }}
              >
                <Dropdown.Item>
                  <Icon icon='cog' /> Settings
                </Dropdown.Item>
                <Dropdown.Item divider />
                <Dropdown.Item onClick={handleSignOut}>
                  <Icon icon='sign-out' /> Logout
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
