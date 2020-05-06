import * as React from 'react';
import styled from '@emotion/styled/macro';
import tw from 'twin.macro';
import { Play, Edit3, AlertTriangle } from 'react-feather';
import { RecordType } from '../../hooks/useGoogle';
import {
  getSeconds,
  getFraction,
  getTimeFormated,
  getTimeFromSeconds,
} from '../../utils/time';

export interface EditProps {
  timer: string;
  onClose: (arg: boolean) => void;
}

const Edit = ({ timer, onClose }: EditProps): JSX.Element => {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-white'>
      <div className='relative w-full max-w-sm mx-auto'>
        <div className='w-full p-3 my-3 text-lg text-3xl font-medium text-center border rounded-md hover:border-blue-500 focus:outline-none focus:shadow-outline'>
          {timer}
        </div>
        <input
          className='w-full p-3 my-2 text-base font-normal font-medium text-gray-700 border rounded-md hover:border-blue-500 focus:outline-none focus:shadow-outline'
          placeholder='Add description'
        />

        <input
          className='w-full p-3 my-2 text-base font-normal font-medium text-gray-700 border rounded-md hover:border-blue-500 focus:outline-none focus:shadow-outline'
          placeholder='Add project'
        />

        <input
          className='w-full p-3 my-2 text-base font-normal font-medium text-gray-700 border rounded-md hover:border-blue-500 focus:outline-none focus:shadow-outline'
          placeholder='Add ticket'
        />

        <div className='flex flex-col items-center justify-between w-full pt-4 mt-8 border-t'>
          <button className='w-full py-3 text-base text-white bg-blue-600 border border-blue-600 rounded-md shadow-md hover:border-blue-700 hover:bg-blue-700 focus:outline-none focus:shadow-outline'>
            Done
          </button>
          <div className='flex items-center w-full my-3'>
            <button
              className='w-1/2 py-3 mr-1 text-base text-gray-600 border border-gray-600 rounded-md shadow-md hover:bg-gray-200 focus:outline-none focus:shadow-outline'
              onClick={() => onClose(false)}
            >
              Cancel
            </button>
            <button className='w-1/2 py-3 ml-1 text-base text-white bg-red-600 border border-red-600 rounded-md shadow-md hover:border-red-700 hover:bg-red-700 focus:outline-none focus:shadow-outline'>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edit;
