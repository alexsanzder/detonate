import React from 'react';
import Header from './components/Header';
import Timer from './components/Timer';
import Footer from './components/Footer';
import Summary from './components/Summary';
import Edit from './components/Edit';

import { EDIT_RECORD } from '../store/actions';
import Context, { ContextType } from '../store/context';

const Popup = (): JSX.Element => {
  const { state, dispatch } = React.useContext<ContextType>(Context);

  const handleShowEdit = (): void =>
    dispatch({
      type: EDIT_RECORD,
      payload: {
        showEdit: !state.showEdit,
      },
    });

  return (
    <div className='h-full pt-36'>
      <div className='fixed top-0 w-full'>
        <Header />
        <Timer />
      </div>
      {!state.showEdit ? (
        <div className='h-full p-3 overflow-y-scroll'>
          <Summary />
          <Footer />
        </div>
      ) : (
        <Edit showEdit={handleShowEdit} />
      )}
    </div>
  );
};

export default Popup;
