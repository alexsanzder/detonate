import * as React from 'react';
import { Grommet } from 'grommet';

import SheetProvider from './SheetProvider';
import Header from './components/Header';

const theme = {
  global: {
    font: {
      family: 'Roboto',
      size: '18px',
      height: '20px',
    },
  },
};

const App = () => {
  return (
    <div className='App'>
      <Grommet theme={theme} plain>
        <SheetProvider>
          <Header gridArea='' />
        </SheetProvider>
      </Grommet>
    </div>
  );
};

export default App;
