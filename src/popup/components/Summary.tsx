import React from 'react';
import { Play, Edit2 } from 'react-feather';
import { browser } from 'webextension-polyfill-ts';

import { getTimeFormated } from '../../utils/time';
import { RecordType } from '../../hooks/useGoogle';

const Summary = (): JSX.Element => {
  browser.runtime.sendMessage({ data: 'ready' });

  const [records, setRecords] = React.useState<any[]>([]);
  const [record, setRecord] = React.useState<any>();
  const [isRunning, setIsRunning] = React.useState<boolean>(false);

  React.useEffect(() => {
    chrome.storage.local.get(['records'], (items) => {
      setRecords(items.records);
    });
  }, []);

  const groupBy = (array: any[], key: string): any => {
    return array?.reduce((result: any, currentValue: any) => {
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
      );
      return result;
    }, {});
  };

  const formatedDate = (date: string): string => {
    const splits = date.split('.');
    return new Date(splits.reverse().join('-')).toLocaleDateString('de', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const totalTime = (data: any): string => {
    const total = data?.reduce((acc: number, curr: any) => {
      return acc + curr.time;
    }, 0);
    return getTimeFormated(total);
  };

  const data = groupBy(records, 'date');

  return (
    <div className='flex flex-col items-center justify-center w-full px-3 pt-2 mt-32'>
      {data ? (
        Object.keys(data).map((date: string) => (
          <div className='w-full px-3 m-3 text-gray-800 border rounded-md shadow-sm'>
            <div className='flex items-center justify-between py-4 text-base font-semibold'>
              <div className='tracking-tight'>{formatedDate(date)}</div>
              <div className='tracking-tighter'>{totalTime(data[date])}</div>
            </div>
            {data[date].map((record: RecordType) => (
              <div className='border-t' key={record.id}>
                <div className='flex items-center justify-between pt-4 pb-2 text-sm font-medium'>
                  <div className='tracking-tight'>{record.description}</div>
                  <div className='tracking-tighter'>
                    {getTimeFormated(record.time)}
                  </div>
                </div>
                <div className='flex items-center justify-between pt-2 pb-4'>
                  <div className='flex items-center justify-between'>
                    {record.company && (
                      <div className='inline-flex items-center h-6 px-2 mx-0 text-xs font-medium tracking-tighter bg-gray-300 bg-opacity-50 rounded-md'>
                        {record.company}
                      </div>
                    )}
                    {record.project && (
                      <div className='inline-flex items-center h-6 px-2 mx-1 text-xs font-medium tracking-tighter bg-gray-300 bg-opacity-50 rounded-md'>
                        {record.project}
                      </div>
                    )}
                    {record.ticket && (
                      <div className='inline-flex items-center h-6 px-2 mx-1 text-xs font-medium tracking-tighter bg-gray-300 bg-opacity-50 rounded-md'>
                        {record.ticket}
                      </div>
                    )}
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
            ))}
          </div>
        ))
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};
export default Summary;
