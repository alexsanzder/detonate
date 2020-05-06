import React from 'react';
import { browser } from 'webextension-polyfill-ts';

import Card from './Card';

browser.runtime.sendMessage({ action: 'ready' });

const Summary = (): JSX.Element => {
  const [records, setRecords] = React.useState<any[]>([]);

  React.useEffect(() => {
    chrome.storage.local.get(['records'], (items) => {
      setRecords(items.records);
    });

    chrome.storage.onChanged.addListener((changes: any) => {
      console.log(changes);
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
  const itemsRecords = groupBy(records, 'date');

  return (
    <div className='flex flex-col items-center justify-center w-full'>
      {itemsRecords ? (
        Object.keys(itemsRecords).map((date: string) => (
          <Card records={itemsRecords} date={date} />
        ))
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};
export default Summary;
