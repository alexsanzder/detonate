import * as React from 'react';
import styled from '@emotion/styled/macro';
import tw from 'twin.macro';
import { Play, Edit3, AlertTriangle } from 'react-feather';

const TABLE_NAME = process.env.REACT_APP_TABLE_NAME;

import Context, { ContextType } from '../../store/context';
import { TOGGLE_EDIT, UPDATE_ROW, DELETE_ROW } from '../../store/actions';

import { getTimeObject, getTimeObjectFromSeconds } from '../../utils/time';

export interface EditProps {
  timer?: number;
}

const Edit = ({ timer }: EditProps): JSX.Element => {
  const { state, dispatch } = React.useContext<ContextType>(Context);

  const [selectionRange, setSelectionRange] = React.useState<boolean>(false);
  const [hours, setHours] = React.useState<string>('');
  const [minutes, setMinutes] = React.useState<string>('');
  const [seconds, setSeconds] = React.useState<string>('');
  const [description, setDescription] = React.useState<string>('');

  const descriptionRef = React.useRef<HTMLInputElement>(null);
  const timerRef = React.useRef<HTMLInputElement>(null);
  const hoursRef = React.useRef<HTMLInputElement>(null);
  const minutesRef = React.useRef<HTMLInputElement>(null);
  const secondsRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const { hours, minutes, seconds } = state.editRecord
      ? getTimeObject(state.editRecord.time)
      : getTimeObjectFromSeconds(timer);
    setHours(hours);
    setMinutes(minutes);
    setSeconds(seconds);
    setSelectionRange(true);
  }, [timer]);

  React.useEffect(() => {
    if (state.editRecord) {
      hoursRef.current.setSelectionRange(0, 0);
      hoursRef.current.focus();
    } else {
      timerRef.current.disabled = true;
      hoursRef.current.disabled = true;
      minutesRef.current.disabled = true;
      secondsRef.current.disabled = true;
      descriptionRef.current.setSelectionRange(0, 0);
      descriptionRef.current.focus();
    }
  }, [selectionRange]);

  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>): void => {
    const re = /^[0-9\b]+$/;
    if (target.value === '' || re.test(target.value)) {
      switch (target.name) {
        case 'hours':
          +target.value <= 24 && setHours(target.value);
          break;
        case 'minutes':
          +target.value <= 59 && setMinutes(target.value);
          break;
        case 'seconds':
          +target.value <= 59 && setSeconds(target.value);
          break;
        default:
          break;
      }
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-white'>
      <div className='relative w-full max-w-sm mx-auto'>
        <div
          ref={timerRef}
          className='w-full p-3 my-3 text-lg text-3xl font-medium text-center border rounded-md hover:border-blue-500 focus-within:border-blue-500 focus:outline-none'
          onFocus={(): void => {
            timerRef.current.classList.add('shadow-outline');
          }}
          onBlur={(): void => timerRef.current.classList.remove('shadow-outline')}
        >
          <span className='flex flex-no-wrap items-center justify-center w-1/2 m-auto text-center focus-within:border-blue-500'>
            <input
              ref={hoursRef}
              className='w-1/4 text-center focus:outline-none'
              name='hours'
              value={hours}
              onChange={handleChange}
            />
            :
            <input
              ref={minutesRef}
              className='w-1/4 text-center focus:outline-none'
              name='minutes'
              value={minutes}
              onChange={handleChange}
            />
            :
            <input
              ref={secondsRef}
              className='w-1/4 text-center focus:outline-none'
              name='seconds'
              value={seconds}
              onChange={handleChange}
            />
          </span>
        </div>
        <input
          ref={descriptionRef}
          className='w-full p-3 my-2 text-base font-normal font-medium text-gray-700 border rounded-md hover:border-blue-500 focus:outline-none focus:shadow-outline'
          placeholder='Add description'
          value={state.editRecord ? state.editRecord.description : state.lastRecord.description}
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
              onClick={(): void => dispatch({ type: TOGGLE_EDIT })}
            >
              Cancel
            </button>
            <button
              className='w-1/2 py-3 ml-1 text-base text-white bg-red-600 border border-red-600 rounded-md shadow-md hover:border-red-700 hover:bg-red-700 focus:outline-none focus:shadow-outline'
              onClick={(): void => {
                const index = state.editRecord
                  ? state.editRecord.id.replace(/(^.+\D)(\d+)(\D.+$)/i, '$2')
                  : state.lastRecord.id.replace(`${TABLE_NAME}!A`, '');
                dispatch({
                  type: 'SEND_MESSAGE',
                  payload: {
                    action: DELETE_ROW,
                    message: {
                      index,
                      id: state.editRecord.id,
                    },
                  },
                });
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edit;
