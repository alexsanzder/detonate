import React from 'react';
import Header from './components/Header';
import Timer from './components/Timer';
import Footer from './components/Footer';
import Summary from './components/Summary';
import Edit from './components/Edit';

import Context from '../store/context';

const Popup = (): JSX.Element => {
  const { state, dispatch } = React.useContext(Context);
  return (
    <div className='h-full pt-36'>
      <div className='fixed top-0 w-full'>
        <Header />
        <Timer />
        {/* {state.showEdit ? <Edit /> : <Timer />} */}
      </div>
      <div className='h-full p-3 overflow-y-scroll'>
        <Summary />
        <Footer />
      </div>
    </div>
  );
};

export default Popup;
