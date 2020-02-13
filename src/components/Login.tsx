import * as React from 'react';

export interface LoginProps {}

const Login: React.FunctionComponent<LoginProps> = props => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  return <div>Login</div>;
};

export default Login;
