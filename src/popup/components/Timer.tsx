import * as React from 'react';
import tw from 'twin.macro';
import { browser } from 'webextension-polyfill-ts';
import { Play, Edit3, Square } from 'react-feather';
import Edit from './Edit';

import { useInterval } from '../../hooks/useInterval';
import { getTimeFromSeconds, getFraction } from '../../utils/time';

import { ProfileType, RecordType, MessageType } from '../../@types';

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
  const [isRunning, setRunning] = React.useState<boolean>(false);
  const [showEdit, setShowEdit] = React.useState<boolean>(false);
  const [record, setRecord] = React.useState<RecordType>(defaultRecord);
  const [action, setAction] = React.useState<string | null>(null);
  const [range, setRange] = React.useState<string>('');

  useInterval(() => setTimer((timer) => timer + 1), isRunning ? 1000 : null);

  // Current Date for the record
  const today = new Date().toLocaleDateString('de', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  // Initial Effect
  const descriptionRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    descriptionRef?.current.focus();
    (async (): Promise<void> => {
      const items = await browser.storage.local.get(['profile']);
      setRecord({
        ...record,
        name: items.profile.name,
        date: today,
      });
    })();
  }, []);

  // Manage request in backgrond.js
  React.useEffect(() => {
    action &&
      (async (): Promise<void> => {
        const message = {
          action,
          payload: { record, range },
        };
        const response = await browser.runtime.sendMessage(message);
        const {
          status,
          payload: { updatedRage },
        } = response;
        const item = await browser.storage.local.get('records');
        console.log(item.records);
        switch (status) {
          case 'ADD_SUCCESS':
            setRange(updatedRage);
            item.records.push(record);
            await browser.storage.local.set({ records: item.records });
            break;
          case 'UPDATE_SUCCESS':
            setRange(updatedRage);
            break;
          case 'FINISH_ROW':
            setRange(updatedRage);
            break;
        }
      })();
  }, [action]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    browser.browserAction.setBadgeText({ text: '▶️' });
    setRunning(true);
    const { description } = record;
    setRecord({
      ...record,
      description: description === null ? '(no description)' : description,
    });

    setAction('ADD_ROW');
  };

  const handleStop = (): void => {
    browser.browserAction.setBadgeText({ text: '' });
    setRunning(false);
    setRecord({
      ...record,
      time: getFraction(timer),
    });

    setAction('FINISH_ROW');
  };

  const handleOpenEdit = (value: boolean): void => {
    setShowEdit(value);
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    setRecord({ ...record, description: e.target.value });
  };

  const handleInputClick = (): void => {
    isRunning && handleOpenEdit(true);
  };

  return (
    <form
      className='flex items-center justify-between w-full h-24 px-4 mt-12 bg-white border-b shadow-sm'
      onSubmit={handleSubmit}
    >
      <div className='flex items-center justify-between w-full mr-3 border-b border-gray-400 hover:border-magenta-400 focus-within:border-magenta-500'>
        <input
          ref={descriptionRef}
          className='w-full h-10 px-1 pb-2 mt-2 mr-1 text-lg text-gray-900 focus:outline-none'
          placeholder='What are you working on?'
          value={record.description}
          onChange={handleInputChange}
          onClick={handleInputClick}
        />
        {isRunning && (
          <span className='px-1 text-lg text-gray-900'>{getTimeFromSeconds(timer)}</span>
        )}
      </div>
      <div className='flex items-center justify-end'>
        {isRunning ? (
          <>
            <Button
              type='button'
              className='mr-2 bg-blue-600 hover:bg-blue-700'
              aria-label='Edit Timer'
              onClick={(): void => handleOpenEdit(true)}
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
          <Button type='submit' className='bg-green-600 hover:bg-green-700' aria-label='Play'>
            <Play className='h-4 m-2 fill-current' />
          </Button>
        )}
      </div>
      {showEdit && <Edit timer={getTimeFromSeconds(timer)} onClose={handleOpenEdit} />}
    </form>
  );
};

export default Timer;
