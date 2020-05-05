import React from 'react';
import Header from './components/Header';
import Timer from './components/Timer';
import Footer from './components/Footer';
import Summary from './components/Summary';

const Popup = () => {
  return (
    <div className='absolute w-full'>
      <Header />
      <Timer />
      <Summary />
      <Footer />
    </div>
  );
};

export default Popup;
