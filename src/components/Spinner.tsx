import React from 'react';
import styled from 'styled-components';

import { Loader } from 'rsuite';

export const Spinner = (): JSX.Element => (
  <div>
    <Loader backdrop content='loading...' size='md' vertical />
  </div>
);

export default Spinner;
