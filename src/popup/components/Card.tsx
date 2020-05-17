import * as React from 'react';
import styled from '@emotion/styled/macro';
import tw from 'twin.macro';
import { Play, Edit3, AlertTriangle } from 'react-feather';

import Context, { ContextType } from '../../store/context';
import { ADD_RECORD, SHOW_EDIT } from '../../store/actions';
import { RecordType } from '../../@types';
import { getTimeObjectFromFraction } from '../../utils/converTime';

const RecordTime = styled.div(({ time }: any) => [
  tw`flex items-center justify-between tracking-tight`,
  time < 0.5 && tw`font-semibold text-red-600`,
]);

export interface CardProps {
  records: RecordType[];
  date: string;
}

const Card = ({ records, date }: CardProps): JSX.Element => {
  const { state, dispatch } = React.useContext<ContextType>(Context);

  const formatedDate = (date: string): string => {
    const splits = date.split('.');
    return new Date(splits.reverse().join('-')).toLocaleDateString('de', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const totalTime = (records: RecordType[]): any => {
    const total = records?.reduce((acc: number, curr: any) => {
      return acc + curr.time;
    }, 0);
    return getTimeObjectFromFraction(total, true);
  };

  return (
    <div className='w-full px-3 mb-4 border rounded-md shadow-sm'>
      <div className='flex items-center justify-between py-4 text-base font-semibold text-gray-800'>
        <div className='tracking-tight'>{formatedDate(date)}</div>
        <div className='tracking-tighter'>{totalTime(records[date])}</div>
      </div>
      {records[date].map((record: RecordType) => (
        <div className='text-gray-700 border-t' key={record.id}>
          <div className='flex items-center justify-between pt-4 pb-2 text-sm font-medium'>
            <div
              className={`tracking-tight ${
                record.description === '(no description)' && 'text-gray-600'
              }`}
            >
              {record.description}
            </div>
            <RecordTime
              time={record.time}
              className={record.time < 0.5 || record.time > 24 ? 'cursor-pointer' : 'cursor-text'}
              onClick={(): void => {
                (record.time < 0.5 || record.time > 24) &&
                  dispatch({
                    type: SHOW_EDIT,
                    payload: { editRecord: record, showEdit: true },
                  });
              }}
            >
              <AlertTriangle
                className={record.time < 0.5 || record.time > 24 ? 'block mr-1' : 'hidden'}
                width='14'
                height='14'
              />
              <span>
                {record.time === 0 ? 'running...' : getTimeObjectFromFraction(record.time, true)}
              </span>
            </RecordTime>
          </div>
          <div className='flex items-center justify-between pt-2 pb-4'>
            <div className='flex items-center justify-between'>
              {record.company && (
                <div className='inline-flex items-center h-6 px-2 mr-2 text-xs font-medium tracking-tighter bg-gray-100 bg-opacity-50 border border-gray-300 rounded-full'>
                  {record.company}
                </div>
              )}
              {record.project && (
                <div className='inline-flex items-center h-6 px-2 mr-2 text-xs font-medium tracking-tighter bg-gray-100 bg-opacity-50 border border-gray-300 rounded-full'>
                  {record.project}
                </div>
              )}
              {record.ticket && (
                <div className='inline-flex items-center h-6 px-2 mr-2 text-xs font-medium tracking-tighter bg-gray-100 bg-opacity-50 border border-gray-300 rounded-full'>
                  {record.ticket}
                </div>
              )}
            </div>
            <div className='flex items-center justify-around'>
              <button
                type='button'
                className='p-2 mx-1 rounded-full hover:text-blue-500 hover:bg-gray-300 hover:bg-opacity-50 focus:outline-none focus:shadow-outline'
                aria-label='Edit this record'
                onClick={(): void =>
                  dispatch({
                    type: SHOW_EDIT,
                    payload: { editRecord: record, showEdit: true },
                  })
                }
              >
                <Edit3 className='fill-current stroke-2' width='16' height='16' />
              </button>
              <button
                type='button'
                className='p-2 ml-1 rounded-full hover:text-green-600 hover:bg-gray-300 hover:bg-opacity-50 focus:outline-none focus:shadow-outline'
                aria-label='Continue tracking whith this record'
                onClick={() => {
                  dispatch({
                    type: ADD_RECORD,
                    payload: {
                      record,
                    },
                  });
                }}
              >
                <Play className='fill-current stroke-1' width='16' height='16' />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Card;
