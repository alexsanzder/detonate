import * as React from 'react';
import tw from 'twin.macro';

import { browser } from 'webextension-polyfill-ts';
import { Play, Edit3, Square } from 'react-feather';
import Edit from './Edit';

import { useInterval } from '../../hooks/useInterval';
import { getTimeFromSeconds } from '../../utils/time';
import { ADD_ROW, FINISH_ROW, SYNC } from '../../utils/actions';

import { RecordType, MessageType } from '../../@types';

const Button = tw.button`w-10 h-10 text-white rounded-full shadow-lg focus:outline-none focus:shadow-outline`;
const InputContainer = tw.div`flex items-center justify-between w-full mr-3`;
const Input = tw.input`w-full h-10 px-1 pb-2 mt-2 mr-1 text-lg text-gray-900 focus:outline-none truncate`;

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
  const [description, setDescription] = React.useState<string>('');
  const [placeholder, setPlaceholder] = React.useState<string>('');
  const [record, setRecord] = React.useState<RecordType>(defaultRecord);
  const [action, setAction] = React.useState<string | null>(null);

  // Timer
  useInterval(() => setTimer((timer) => timer + 1), isRunning ? 1000 : null);

  // Initial Render
  const descriptionRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    (async (): Promise<void> => {
      const { isRunning, start, lastRecord } = await browser.storage.local.get();
      if (isRunning) {
        // Continue timer
        const time = Math.abs(Date.now() - start) / 1000;
        setTimer(time);
        setRunning(isRunning);
        setRecord(lastRecord);
        setDescription(lastRecord.description);
        setRunning(isRunning);
      } else {
        // Funny commits //
        const response = await (await fetch('http://whatthecommit.com/index.json')).json();
        setPlaceholder(response.commit_message);
        descriptionRef.current.placeholder = `What are you working on? e.g. ${response.commit_message}`;
        //setDescription(response.commit_message);
        // Funny commits //

        descriptionRef.current.focus();
        descriptionRef.current.setSelectionRange(0, 0);
      }
    })();
  }, []);

  // Handle request in backgrond.js
  React.useEffect(() => {
    action &&
      (async (): Promise<void> => {
        console.log('ACTION', action, record);
        const message = {
          action,
          payload: { record },
        } as MessageType;
        const { status, payload } = await browser.runtime.sendMessage(message);

        console.log(action, status, payload);
        switch (status) {
          case 'ADD_SUCCESS':
            setRecord(payload.record);
            break;
          case 'UPDATE_SUCCESS':
            setRecord(payload.record);
            break;
          case 'FINISH_SUCCESS':
            setRecord(defaultRecord);
            break;
        }
      })();
  }, [action]);

  const handlePlay = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    browser.storage.local.set({
      isRunning: true,
      start: Date.now(),
    });
    setRunning(true);
    setDescription(description === '' ? placeholder : description);
    setRecord({
      ...record,
      description: description === '' ? placeholder : description,
    });

    setAction(ADD_ROW);
  };

  const handleStop = async (): Promise<void> => {
    setRunning(false);
    setTimer(0);
    // More funny commits //
    const response = await (await fetch('http://whatthecommit.com/index.json')).json();
    setPlaceholder(response.commit_message);
    descriptionRef.current.placeholder = `What are you working on? e.g. ${response.commit_message}`;
    //setDescription(response.commit_message);
    // More funny commits //
    setDescription('');
    descriptionRef.current.focus();
    descriptionRef.current.setSelectionRange(0, 0);
    setAction(FINISH_ROW);
  };

  const handleOpenEdit = (value: boolean): void => {
    setShowEdit(value);
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    setDescription(e.target.value);
  };

  const handleInputClick = (): void => {
    isRunning && handleOpenEdit(true);
  };

  return (
    <form
      className='flex items-center justify-between w-full h-24 px-4 mt-12 bg-white border-b shadow-md'
      onSubmit={handlePlay}
    >
      <InputContainer
        className={
          !isRunning
            ? 'border-b border-gray-400 hover:border-magenta-400 focus-within:border-magenta-500'
            : 'cursor-pointer'
        }
        onClick={handleInputClick}
      >
        <Input
          className={isRunning ? 'max-w-sm cursor-pointer' : 'cursor-text'}
          ref={descriptionRef}
          placeholder='What are you working on?'
          value={description}
          onChange={handleInputChange}
        />
        {isRunning && (
          <span className='w-1/4 px-1 text-lg text-right text-gray-900'>
            {getTimeFromSeconds(timer)}
          </span>
        )}
      </InputContainer>
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
