import React from 'react';
import Header from './components/Header';

const Popup = () => {
  return (
    <div className='w-full max-w-md bg-pink-500'>
      <Header />
      <p className='popup-greet'>
        Thanks for using
        <span className='brand'>Modern extension Boilerplate</span>
      </p>
      <p className='stack-head'>Made using :</p>
      <p className='contrib-msg'>
        We would love some of your help in making this boilerplate even better.
        <br />
        <a
          href='https://www.github.com/kryptokinght/react-extension-boilerplate'
          target='_blank'
        >
          React Extension Boilerplate
        </a>
      </p>
    </div>
  );
};

export default Popup;
