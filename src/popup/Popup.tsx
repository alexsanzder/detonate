import React from 'react';
import Header from './components/Header';
import Timer from './components/Timer';
import Footer from './components/Footer';
import Summary from './components/Summary';

const Popup = () => {
  return (
    <div className='h-full pt-36'>
      <div className='fixed top-0 w-full'>
        <Header />
        <Timer />
      </div>
      <div className='h-full p-3 overflow-y-scroll'>
        <Summary />
        <Footer />
      </div>
    </div>
  );
};

export default Popup;
