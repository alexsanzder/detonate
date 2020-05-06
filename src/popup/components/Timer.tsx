import * as React from 'react';
import styled from '@emotion/styled/macro';
import tw from 'twin.macro';
import { Play, Edit3, Square } from 'react-feather';
import Edit from './Edit';

interface IButtonPlay {
  isRunning: boolean;
}

const ButtonPlay = styled.button(({ isRunning }: IButtonPlay) => [
  tw`w-10 h-10 text-white bg-green-600 rounded-full shadow-md hover:bg-green-700 focus:outline-none focus:shadow-outline`,
  isRunning && tw`bg-red-600 hover:bg-red-700`,
]);

const Timer = (): JSX.Element => {
  const [isRunning, setRunning] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);

  const handlePlay = async (): Promise<void> => {
    setRunning(!isRunning);
  };

  return (
    <div className='flex items-center justify-between w-full h-20 px-4 mt-12 bg-white border-b shadow-md'>
      <div className='w-full mr-4'>
        <input
          className='w-full h-10 px-3 pb-2 mt-2 text-lg text-gray-900 border-b-2 border-gray-400 focus:outline-none focus:border-magenta-500'
          placeholder='What are you working on?'
        />
      </div>
      <div className='flex items-center justify-end'>
        {isRunning && (
          <button
            type='button'
            className='w-10 h-10 mr-3 text-white bg-blue-600 rounded-full shadow-md hover:bg-blue-700 focus:outline-none focus:shadow-outline'
            aria-label='Play'
          >
            <Edit3 className='h-4 m-2 fill-current' />
          </button>
        )}
        <ButtonPlay
          type='button'
          aria-label='Play'
          isRunning={isRunning}
          onClick={handlePlay}
        >
          {isRunning ? (
            <Square className='h-4 m-2 fill-current' />
          ) : (
            <Play className='h-4 m-2 fill-current' />
          )}
        </ButtonPlay>
      </div>
      {isRunning && <Edit open={isRunning} setShowModal={setShowModal} />}
    </div>
  );
};

export default Timer;
