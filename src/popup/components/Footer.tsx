import * as React from 'react';

const Footer = (): JSX.Element => {
  return (
    <div className='flex items-center justify-center w-full'>
      <a
        className='px-4 py-2 mt-4 text-sm text-pink-600 border border-pink-600 rounded-md shadow-sm hover:bg-pink-600 hover:text-white hover:border-transparent'
        aria-label='See more on Google Sheets'
        target='_blank'
        rel='noopener noreferrer'
        href={`https://docs.google.com/spreadsheets/d/1aPo1wlEXueb6poGt7X3XjYVy-VPDaGJhOO5pNBMdl48/edit#gid=`}
      >
        See more on Google Sheets
      </a>
    </div>
  );
};

export default Footer;
