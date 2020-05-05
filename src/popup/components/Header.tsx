import * as React from 'react';
import { RefreshCw, ExternalLink, Sun, Moon, User } from 'react-feather';

const Header = (): JSX.Element => {
  const [theme, setTheme] = React.useState('lightTheme');

  const handleTheme = (): void => {
    setTheme(theme === 'darkTheme' ? 'lightTheme' : 'darkTheme');
  };
  return (
    <div className='fixed top-0 z-30 flex items-center justify-between w-full h-12 px-4 py-2 text-white bg-pink-600 shadow-lg'>
      <div>
        <svg
          className='inline-block h-5 mb-1 text-white stroke-0'
          viewBox='0 0 143 24'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M.3 13.9a9.08 9.08 0 012.77-6.57 9.23 9.23 0 016.6-2.8h.14c1.88.03 3.54.52 5 1.46V2.56c0-.6.21-1.1.65-1.53.42-.43.93-.65 1.52-.65.6 0 1.12.22 1.55.65.42.43.63.93.63 1.53v3.97a5.85 5.85 0 00-3.12.76c-.4.26-.74.57-1.08.91l-.45.47a43.08 43.08 0 00-.64.66 10.1 10.1 0 00-.84-.8.64.64 0 00-.26-.06c-.13 0-.18.04-.56.41l-.43.41-.43-.14c-.58-.2-.96-.26-1.63-.25-1.43 0-2.7.55-3.66 1.58a5.22 5.22 0 00-1.32 2.64 5.1 5.1 0 003.9 5.8c.5.12 1.68.13 2.15.02a5.09 5.09 0 003.77-6.6l-.13-.4.4-.39c.4-.41.46-.53.4-.76a7.9 7.9 0 00-.73-.82 32.3 32.3 0 00.66-.68l.44-.46c.32-.32.6-.58.92-.78.57-.36 1.3-.58 2.64-.62v6.47a9.37 9.37 0 01-9.43 9.48 8.82 8.82 0 01-3.67-.74 9.04 9.04 0 01-4.16-3.48l-.02-.03-.01-.03-.11-.16A9.14 9.14 0 01.3 13.95v-.03-.03zM19.6 5.2v.85a.83.83 0 01.62.27.91.91 0 01.25.64.94.94 0 01-.25.64.87.87 0 01-.61.27v.79l.55 2.58c.03.04.06.06.1.07.03.02.07.01.1 0a.2.2 0 00.08-.1c.02-.05.03-.1.02-.14l-.15-2.41.99.53c.03.03.22.12.26.12.04 0 .07-.03.1-.07a.26.26 0 00.02-.27l-1.12-1.3 2-.38s.66-.12.7-.14a.2.2 0 00.07-.1.34.34 0 00.02-.12c0-.04 0-.07-.02-.1a.2.2 0 00-.07-.1c-.04-.03-.7-.16-.7-.16l-2-.38 1.12-1.3a.26.26 0 00-.02-.27.15.15 0 00-.1-.06.86.86 0 00-.26.12l-1 .53.16-2.41c0-.05 0-.1-.02-.14a.2.2 0 00-.08-.1.13.13 0 00-.1 0 .17.17 0 00-.1.07l-.55 2.58zM130.43 17.72a4.98 4.98 0 003.24 1.34h.16c.9 0 1.75-.22 2.54-.65.55-.33 1.15-.91 1.8-1.74.32-.51.77-.84 1.35-.98a2.12 2.12 0 011.65.25c.5.32.83.76.96 1.34.04.2.06.38.06.55 0 .4-.11.77-.33 1.12a11.9 11.9 0 01-3.35 3.22 9.08 9.08 0 01-4.53 1.2 9.2 9.2 0 01-6.78-2.74 9.47 9.47 0 01-1.96-2.84l-.1-.25-.11-.3a9.45 9.45 0 01.16-6.92 8.9 8.9 0 013.48-4.15 10.46 10.46 0 015.2-1.6h.32c1.7 0 3.32.52 4.84 1.57a10.13 10.13 0 013.57 4.35v.03l.02.02v.06l.02.03v.02l.03.05v.04c.02.01.02.04.02.07v.04h.02v.1a.5.5 0 01.02.12v.43l-.02.06v.1l-.04.13v.02c0 .01 0 .02-.03.04v.05l-.02.05-.02.06-.02.04-.01.05-.04.04v.01l-.02.06-.03.07-.02.06-.04.03-.02.06-.03.03-.02.04-.06.05-.01.04-.04.05c0 .02-.01.03-.04.04a.28.28 0 00-.05.07l-.06.04-.03.03-.02.04-.02.02-.03.02c-.02 0-.03.02-.04.03l-.04.04a.2.2 0 00-.05.04.41.41 0 00-.1.07l-.03.02-.03.01a.16.16 0 01-.08.02v.02l-.03.04c-.03 0-.05 0-.06.02l-.03.01c-.02.02-.04.02-.08.02l-.03.02-10.96 4.46zm6.84-7.47a4.82 4.82 0 00-3.47-1.34c-1.76 0-3.13.75-4.14 2.25-.51.75-.8 1.59-.85 2.52l8.47-3.43zM122.27 23.37a9.48 9.48 0 01-5.4-1.68 6.82 6.82 0 01-3.2-4.52l-.28-4.62.02-2.07h-.36c-.6 0-1.1-.2-1.52-.62a2.09 2.09 0 01-.66-1.56c0-.59.22-1.1.66-1.52.42-.43.93-.65 1.52-.65h.36V2.55c0-.6.21-1.11.64-1.55a2.1 2.1 0 011.53-.63c.6 0 1.12.22 1.53.65.43.43.65.93.65 1.53l-.02 3.58h3c.58 0 1.09.22 1.51.65.44.42.66.93.66 1.52 0 .62-.22 1.14-.66 1.56a2.1 2.1 0 01-1.52.62h-2.99v2.07a136.16 136.16 0 01-.03 2.05l.01.62c.09 1.05.42 1.83 1 2.35a5.03 5.03 0 003.55 1.45 2.13 2.13 0 012.18 2.18c0 .6-.22 1.11-.64 1.54a2.1 2.1 0 01-1.54.63zM101.21 8.87a5.07 5.07 0 00-3.57 1.5c-1 1.01-1.5 2.2-1.5 3.58a4.9 4.9 0 001.16 3.19 4.89 4.89 0 003.93 1.88c.97 0 1.89-.28 2.76-.85a4.71 4.71 0 002.17-3.2 4.82 4.82 0 00-1.03-4.19 5 5 0 00-3.92-1.9zm.06-4.34c2.55.03 4.75.97 6.6 2.8a9.1 9.1 0 012.75 6.62v7.25c0 .6-.21 1.11-.64 1.54-.43.42-.94.63-1.54.63-1.07 0-1.77-.52-2.08-1.56a8.8 8.8 0 01-3.26 1.36 9.22 9.22 0 01-7.05-1.4 8.97 8.97 0 01-4.06-5.94 9.08 9.08 0 01.89-6.21 9.02 9.02 0 014.58-4.3 10 10 0 013.75-.8h.06zM72.35 6.7c0-.6.22-1.1.65-1.52.43-.44.93-.65 1.53-.65 1.08 0 1.78.52 2.08 1.55a9.46 9.46 0 0110.35.02 9.43 9.43 0 014.22 7.85v7.25c0 .6-.21 1.11-.64 1.54-.4.42-.92.63-1.54.63-.59 0-1.1-.21-1.52-.63a2.07 2.07 0 01-.65-1.54v-7.25c0-1.02-.28-1.95-.85-2.81a4.98 4.98 0 00-6-1.9 4.84 4.84 0 00-2.75 2.5c-.33.65-.5 1.39-.53 2.2v7.26c0 .6-.21 1.11-.63 1.54a2.1 2.1 0 01-1.54.63c-.6 0-1.1-.21-1.53-.63a2.07 2.07 0 01-.65-1.54V6.7zM62.4 4.53a9.1 9.1 0 016.66 2.86 8.95 8.95 0 012.66 6.56v.07A9.01 9.01 0 0169 20.6a9.17 9.17 0 01-4.85 2.57 9.05 9.05 0 01-5.47-.54 9.02 9.02 0 01-4.16-3.48 9.19 9.19 0 01-1.6-5.2 9.1 9.1 0 012.76-6.62 9.2 9.2 0 016.6-2.8h.13zm-.05 4.34c-1.4.03-2.59.53-3.57 1.5-1 1.01-1.5 2.2-1.5 3.58a5.05 5.05 0 0010.02 1.01 4.83 4.83 0 00-1.07-4.19 4.9 4.9 0 00-3.88-1.9zM50.76 23.37a9.48 9.48 0 01-5.4-1.68 6.82 6.82 0 01-3.21-4.52l-.27-4.62.01-2.07h-.36c-.59 0-1.1-.2-1.52-.62a2.09 2.09 0 01-.65-1.56c0-.59.22-1.1.65-1.52.42-.43.93-.65 1.52-.65h.36V2.55c0-.6.22-1.1.64-1.54a2.1 2.1 0 011.54-.64c.6 0 1.11.22 1.52.65.44.43.65.93.65 1.53l-.02 3.58h3c.59 0 1.1.22 1.52.65.43.43.65.93.65 1.52 0 .62-.22 1.14-.65 1.56a2.1 2.1 0 01-1.53.62h-2.98v2.07a137.9 137.9 0 01-.04 2.05c0 .23 0 .44.02.62.08 1.05.41 1.83 1 2.35a5.03 5.03 0 003.55 1.45 2.13 2.13 0 012.17 2.18c0 .6-.21 1.11-.63 1.54a2.1 2.1 0 01-1.54.63zM26.8 17.72a4.98 4.98 0 003.24 1.34h.17c.91 0 1.76-.22 2.54-.65.56-.33 1.15-.91 1.8-1.74.32-.51.77-.84 1.35-.98a2.12 2.12 0 011.65.25c.51.32.83.76.96 1.34.04.2.06.38.06.55 0 .4-.11.77-.33 1.12a11.9 11.9 0 01-3.35 3.22 9.08 9.08 0 01-4.53 1.2 9.2 9.2 0 01-6.78-2.74 9.49 9.49 0 01-1.95-2.84l-.11-.25-.11-.3a9.44 9.44 0 01.16-6.92 8.9 8.9 0 013.48-4.15 10.47 10.47 0 015.2-1.6h.33c1.7 0 3.31.52 4.83 1.57a10.13 10.13 0 013.57 4.35v.03l.02.02v.06l.02.03v.02l.04.05v.04l.02.07v.04h.01v.1a.5.5 0 01.02.12v.43l-.02.06v.1a1.7 1.7 0 00-.03.13v.02l-.04.04v.05l-.02.05-.02.06-.01.04-.02.05-.04.04v.01l-.02.06-.03.07-.02.06-.04.03-.01.06c-.02 0-.03.02-.04.03l-.02.04-.05.05-.02.04-.04.05c0 .02-.01.03-.03.04a.29.29 0 00-.06.07l-.05.04-.04.03-.02.04-.02.02-.03.02-.04.03-.03.04a.21.21 0 00-.06.04.39.39 0 00-.09.07l-.04.02-.03.01a.16.16 0 01-.07.02v.02l-.04.04c-.02 0-.04 0-.05.02l-.04.01c-.01.02-.04.02-.07.02l-.04.02-10.96 4.46zm6.86-7.47a4.81 4.81 0 00-3.48-1.34c-1.75 0-3.13.75-4.13 2.25-.52.75-.8 1.59-.86 2.52l8.47-3.43z'
            fill='currentColor'
          />
        </svg>
      </div>
      <div className='flex items-center justify-between leading-snug text-right'>
        <button
          type='button'
          className='w-8 h-8 mx-1 rounded-full hover:bg-gray-100 hover:bg-opacity-25'
          aria-label='Sync Google Sheets'
        >
          <RefreshCw className='h-5 p-px m-1 stroke-2' />
        </button>
        <a
          type='button'
          className='w-8 h-8 mx-1 rounded-full hover:bg-gray-100 hover:bg-opacity-25'
          aria-label='Open Google Sheets'
          target='_blank'
          rel='noopener noreferrer'
          href={`https://docs.google.com/spreadsheets/d/1aPo1wlEXueb6poGt7X3XjYVy-VPDaGJhOO5pNBMdl48/edit#gid=`}
        >
          <ExternalLink className='h-5 p-px m-1 stroke-2' />
        </a>
        <button
          type='button'
          className='w-8 h-8 mx-1 rounded-full hover:bg-gray-100 hover:bg-opacity-25'
          onClick={handleTheme}
          aria-label='Toggle Dark/Light mode'
        >
          {theme === 'lightTheme' ? (
            <Sun className='h-5 p-px m-1 stroke-2' />
          ) : (
            <Moon className='h-5 p-px m-1 stroke-2' />
          )}
        </button>
        <button
          type='button'
          className='w-8 h-8 ml-1 rounded-full hover:bg-gray-100 hover:bg-opacity-25'
          aria-label='Toggle Dark/Light mode'
        >
          <User className='h-5 p-px m-1 stroke-2' />
        </button>
      </div>
    </div>
  );
};

export default Header;
