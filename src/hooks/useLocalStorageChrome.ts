import * as React from 'react';

export const useLocalStorageChrome = (keys: any, defaulValue = []) => {
  const getLocalStorage = React.useCallback(() => {
    return chrome.storage.local.get(keys, (items) => {
      return items;
    });
  });
  const [state, setState] = React.useState(getLocalStorage);

  React.useEffect(() => {
    chrome.storage.local.set(keys);
  }, [getLocalStorage, keys, state]);

  return [state, setState];
};
