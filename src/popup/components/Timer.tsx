import * as React from 'react';
import { Play } from 'react-feather';

const Timer = (): JSX.Element => {
  return (
    <div className='relative z-20 flex items-center justify-between w-full h-20 px-4 mt-12 bg-white border-b shadow-sm'>
      <div className='w-full mr-4'>
        <input
          className='w-full h-10 px-3 text-gray-900'
          placeholder='What are you working on?'
        />
      </div>
      <div className='flex items-center justify-between text-right'>
        <div className='w-full h-10'>
          <button
            type='button'
            className='w-10 h-10 text-white bg-green-600 rounded-full shadow-md hover:bg-green-500'
            aria-label='Play'
          >
            <Play className='h-4 m-2 fill-current stroke-2' />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Timer;
