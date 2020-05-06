import * as React from 'react';
import tw from 'twin.macro';
import { browser } from 'webextension-polyfill-ts';
import { Play, Edit3, Square } from 'react-feather';
import Edit from './Edit';

import { useInterval } from '../../hooks/useInterval';
import { getFraction, getTimeFromSeconds } from '../../utils/time';

const Button = tw.button`w-10 h-10 text-white rounded-full shadow-lg focus:outline-none focus:shadow-outline`;

const defaultRecord = {
  name: null,
  date: null,
  company: null,
  project: null,
  description: null,
  ticket: null,
  time: 0,
};

const Timer = (): JSX.Element => {
  const [timer, setTimer] = React.useState<number>(0);
  const [isRunning, setRunning] = React.useState(false);
  const [description, setDescripition] = React.useState('');
  const [showEdit, setShowEdit] = React.useState(false);
  const [record, setRecord] = React.useState<RecordType>(defaultRecord);

  useInterval(() => setTimer((timer) => timer + 1), isRunning ? 1000 : null);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const value = description === '' ? '(no description)' : description;
    setDescripition(value);
    setRunning(true);
    browser.runtime.sendMessage({
      action: 'addRow',
      payload: { record, badge: '▶️' },
    });
  };

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    setDescripition(e.target.value);
  };

  const handleStop = () => {
    setRunning(false);
    setDescripition('');
    setTimer(0);
  };

  const handleShowEdit = (value: boolean) => {
    setShowEdit(value);
  };

  return (
    <form
      className='flex items-center justify-between w-full h-24 px-4 mt-12 bg-white border-b shadow-sm'
      onSubmit={handleSubmit}
    >
      <div className='flex items-center justify-between w-full mr-3 border-b border-gray-400 hover:border-blue-500 focus-within:border-magenta-500'>
        <input
          className='w-full h-10 px-1 pb-2 mt-2 mr-1 text-lg text-gray-900 focus:outline-none'
          placeholder='What are you working on?'
          value={description}
          onChange={(e) => handleChange(e)}
          onClick={() => (isRunning ? handleShowEdit(true) : null)}
        />
        {isRunning && (
          <span className='px-1 text-lg text-gray-900'>
            {getTimeFromSeconds(timer)}
          </span>
        )}
      </div>
      <div className='flex items-center justify-end'>
        {isRunning ? (
          <>
            <Button
              type='button'
              className='mr-2 bg-blue-600 hover:bg-blue-700'
              aria-label='Edit Timer'
              onClick={() => handleShowEdit(true)}
            >
              <Edit3 className='h-4 m-2 fill-current' />
            </Button>

            <Button
              type='button'
              className='bg-red-600 hover:bg-red-700'
              aria-label='Stop'
              onClick={handleStop}
            >
              <Square className='h-4 m-2 fill-current' />
            </Button>
          </>
        ) : (
          <Button
            type='submit'
            className='bg-green-600 hover:bg-green-700'
            aria-label='Play'
          >
            <Play className='h-4 m-2 fill-current' />
          </Button>
        )}
      </div>
      {showEdit && (
        <Edit timer={getTimeFromSeconds(timer)} onClose={handleShowEdit} />
      )}
    </form>
  );
};

export default Timer;
