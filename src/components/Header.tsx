import * as React from 'react';
import styled from 'styled-components';

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

import AppContext from './../contexts/useApp';
import GoogleAuthContext from '../contexts/useGoogleAuth';

type HeaderProps = {
  logo: string;
};

const OpenTooltip = <Tooltip>Open Google Sheets</Tooltip>;
const SyncTooltip = <Tooltip>Sync Google Sheets</Tooltip>;
const DarkModeTooltip = <Tooltip>Toggle dark/light mode</Tooltip>;

const AppHeader: React.FC<HeaderProps> = ({
  logo,
}: HeaderProps): JSX.Element => {
  const { toggleReload } = React.useContext(AppContext);
  const { currentUser, handleSignOut, sheetProperties } = React.useContext(
    GoogleAuthContext
  );

  return (
    <Style>
      <Header
        style={{
          position: 'fixed',
          width: '100%',
          zIndex: 1000,
        }}
      >
        <Navbar appearance='default'>
          <Navbar.Header>
            <img
              src={logo}
              alt='Detoanate Time Tracking'
              height={50}
              style={{
                padding: '10px 15px 5px 15px',
                cursor: 'none',
              }}
            />
          </Navbar.Header>
          <Navbar.Body>
            <Nav pullRight>
              <Whisper placement='bottom' trigger='hover' speaker={SyncTooltip}>
                <Nav.Item
                  icon={<Icon icon='reload' size='lg' />}
                  onClick={toggleReload}
                ></Nav.Item>
              </Whisper>
              <Whisper placement='bottom' trigger='hover' speaker={OpenTooltip}>
                <Nav.Item
                  target='_blank'
                  href={`https://docs.google.com/spreadsheets/d/1aPo1wlEXueb6poGt7X3XjYVy-VPDaGJhOO5pNBMdl48/edit#gid=${sheetProperties?.sheetId}`}
                  icon={<Icon icon='external-link' size='lg' />}
                ></Nav.Item>
              </Whisper>
              <Whisper
                placement='bottom'
                trigger='hover'
                speaker={DarkModeTooltip}
              >
                <Nav.Item icon={<Icon icon='sun-o' size='lg' />}></Nav.Item>
              </Whisper>
              <Dropdown
                placement='bottomEnd'
                renderTitle={(): JSX.Element => {
                  return (
                    <Avatar circle src={currentUser?.getImageUrl()} alt='AS'>
                      AS
                    </Avatar>
                  );
                }}
              >
                <Dropdown.Item>
                  <Icon icon='cog' />
                  Settings
                </Dropdown.Item>
                <Dropdown.Item divider />
                <Dropdown.Item onClick={handleSignOut}>
                  <Icon icon='sign-out' />
                  Logout
                </Dropdown.Item>
              </Dropdown>
            </Nav>
          </Navbar.Body>
        </Navbar>
      </Header>
    </Style>
  );
};

const Style = styled.div`
  .rs-avatar {
    margin: 5px 15px 5px 5px;
  }
  .rs-nav-item > .rs-nav-item-content > .rs-icon {
    margin-right: 0px;
  }
`;
export default AppHeader;
