import React from 'react';
import { Play, Edit2 } from 'react-feather';

const Summary = (): JSX.Element => {
  return (
    <div className='flex items-center justify-center w-full'>
      <div className='w-full px-3 m-3 antialiased text-gray-800 border rounded-md shadow-md'>
        <div className='flex items-center justify-between py-4 text-base font-semibold border-b'>
          <div className='tracking-tight'>Donnerstag, 12. März 2020</div>
          <div className='tracking-tighter'>00:01:55</div>
        </div>
        <div className='border-b'>
          <div className='flex items-center justify-between pt-4 pb-2 text-sm font-medium'>
            <div className='tracking-tight'>TNT-456 Refactoring UI</div>
            <div className='tracking-tighter'>00:00:58</div>
          </div>
          <div className='flex items-center justify-between pt-2 pb-4'>
            <div className='flex items-center justify-between'>
              <div className='inline-flex items-center h-6 px-2 mx-0 text-xs font-medium tracking-tighter bg-gray-300 bg-opacity-50 rounded-md'>
                Detonate
              </div>
              <div className='inline-flex items-center h-6 px-2 mx-1 text-xs font-medium tracking-tighter bg-gray-300 bg-opacity-50 rounded-md'>
                Popup App
              </div>
              <div className='inline-flex items-center h-6 px-2 mx-1 text-xs font-medium tracking-tighter bg-gray-300 bg-opacity-50 rounded-md'>
                TNT-456
              </div>
            </div>
            <div className='flex items-center justify-around'>
              <button
                type='button'
                className='p-2 mx-1 rounded-full hover:text-blue-500 hover:bg-gray-300 hover:bg-opacity-50'
                aria-label='Edit tracking'
              >
                <Edit2
                  className='fill-current stroke-0'
                  width='16'
                  height='16'
                />
              </button>
              <button
                type='button'
                className='p-2 ml-1 rounded-full hover:text-green-600 hover:bg-gray-300 hover:bg-opacity-50'
                aria-label='Continue tracking'
              >
                <Play
                  className='fill-current stroke-0'
                  width='16'
                  height='16'
                />
              </button>
            </div>
          </div>
        </div>

        <div className='border-b-0'>
          <div className='flex items-center justify-between pt-4 pb-2 text-sm font-medium'>
            <div className='tracking-tight'>TNT-456 Refactoring UI</div>
            <div className='tracking-tighter'>00:00:58</div>
          </div>
          <div className='flex items-center justify-between pt-1 pb-4'>
            <div className='flex items-center justify-between'>
              <div className='inline-flex items-center h-6 px-2 mx-0 text-xs font-medium tracking-tighter bg-gray-300 bg-opacity-50 rounded-md'>
                Detonate
              </div>
              <div className='inline-flex items-center h-6 px-2 mx-1 text-xs font-medium tracking-tighter bg-gray-300 bg-opacity-50 rounded-md'>
                Popup App
              </div>
              <div className='inline-flex items-center h-6 px-2 mx-1 text-xs font-medium tracking-tighter bg-gray-300 bg-opacity-50 rounded-md'>
                TNT-456
              </div>
            </div>
            <div className='flex items-center justify-around'>
              <button
                type='button'
                className='p-2 mx-1 rounded-full hover:text-blue-500 hover:bg-gray-300 hover:bg-opacity-50'
                aria-label='Edit tracking'
              >
                <Edit2
                  className='fill-current stroke-0'
                  width='16'
                  height='16'
                />
              </button>
              <button
                type='button'
                className='p-2 ml-1 rounded-full hover:text-green-600 hover:bg-gray-300 hover:bg-opacity-50'
                aria-label='Continue tracking'
              >
                <Play
                  className='fill-current stroke-0'
                  width='16'
                  height='16'
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Summary;
