/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as React from "react";
import {
  Layer,
  Text,
  Button,
  Input,
  InputGroup,
  LayerLoading,
  Alert,
  Container,
  useTheme
} from "sancho";

export interface LoginProps {}

const Login: React.FunctionComponent<LoginProps> = props => {
  const theme = useTheme();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  return (
    <Container>
      <div
        css={{
          marginTop: theme.spaces.xl,
          marginBottom: theme.spaces.lg,
          maxWidth: "26rem",
          marginLeft: "auto",
          marginRight: "auto",
          display: "block"
        }}
      >
        <Layer
          css={{
            marginTop: theme.spaces.xl,
            background: "white"
          }}
        >
          <div
            css={{
              borderBottom: "1px solid",
              borderColor: theme.colors.border.muted,
              textAlign: "center",
              padding: theme.spaces.lg,
              paddingBottom: theme.spaces.sm
            }}
          >
            <Text variant="h4">Log in to your account</Text>
            <div
              css={{
                textAlign: "center",
                paddingBottom: theme.spaces.sm
              }}
            >
              <Text css={{ fontSize: theme.fontSizes[0] }}>
                Don't have an account? <br />
                <Button
                  size="sm"
                  css={{
                    marginTop: theme.spaces.sm
                  }}
                  variant="outline"
                  onClick={e => {
                    e.preventDefault();
                  }}
                >
                  Register here.
                </Button>
              </Text>
            </div>
          </div>
          <div
            css={{
              padding: theme.spaces.lg
            }}
          >
            {error && (
              <Alert
                css={{ marginBottom: theme.spaces.md }}
                intent="danger"
                title="An error has occurred while logging in."
                subtitle={error}
              />
            )}
            <Button
              css={{
                marginBottom: theme.spaces.md,
                width: "100%",
                display: "block"
              }}
              block
            >
              Sign in with Google
            </Button>
          </div>

          <LayerLoading loading={loading} />
        </Layer>
      </div>
    </Container>
  );
};

export default Login;
