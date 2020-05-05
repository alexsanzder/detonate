import * as React from 'react';
const SHEET_ID = +process.env.REACT_APP_SHEET_ID;

const Footer = (): JSX.Element => {
  return (
    <div className='m-6 text-center'>
      <a
        className='px-4 py-2 text-sm border rounded-md shadow-sm text-magenta-500 border-magenta-500 hover:bg-magenta-500 hover:text-white hover:border-transparent'
        aria-label='See more on Google Sheets'
        target='_blank'
        rel='noopener noreferrer'
        href={`https://docs.google.com/spreadsheets/d/1aPo1wlEXueb6poGt7X3XjYVy-VPDaGJhOO5pNBMdl48/edit#gid=${SHEET_ID}`}
      >
        See more on Google Sheets
      </a>
    </div>
  );
};

export default Footer;
