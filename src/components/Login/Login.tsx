import * as React from "react";
import styled from "styled-components";

import {
  Content,
  FlexboxGrid,
  Panel,
  Form,
  FormGroup,
  Button,
  Icon,
  ControlLabel,
  FormControl,
  ButtonToolbar
} from "rsuite";

import GoogleAuthContext from "../../contexts/useGoogleAuth";

const Style = styled.div`
  width: 100%;
  height: 100%;
  margin: 0 auto;
  align-items: center;
  .login_box_buttons {
    display: flex;
  }
`;

const Login = () => {
  const { handleSignIn } = React.useContext(GoogleAuthContext);

  return (
    <Style>
      <Content>
        <FlexboxGrid justify="center">
          <FlexboxGrid.Item colspan={12}>
            <Panel header={<h3>Login</h3>} bordered>
              <Form fluid>
                <FormGroup>
                  <ControlLabel>Sheet Name</ControlLabel>
                  <FormControl name="name" />
                </FormGroup>
                <FormGroup>
                  <ControlLabel>Google Sheet ID</ControlLabel>
                  <FormControl name="sheetId" />
                </FormGroup>
                <FormGroup>
                  <ButtonToolbar>
                    <Button appearance="primary" onClick={handleSignIn} block>
                      <Icon icon="google" /> Sign in with Google
                    </Button>
                  </ButtonToolbar>
                </FormGroup>
              </Form>
            </Panel>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </Content>
    </Style>
  );
};

export default Login;
