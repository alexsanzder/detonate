import React from 'react';
import Header from './components/Header';
import Timer from './components/Timer';
import Footer from './components/Footer';
import Summary from './components/Summary';

const Popup = () => {
  return (
    <div className='w-screen max-w-md'>
      <div className='fixed top-0 w-full'>
        <Header />
        <Timer />
      </div>

      <Summary />
      <Footer />
    </div>
  );
};

export default Popup;
