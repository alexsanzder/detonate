import * as React from 'react';
import { browser } from 'webextension-polyfill-ts';

export function useStorageSync<Value>(
  key: string,
  defaultValue: Value,
): [Value, (value: Value) => Promise<void>, () => Promise<void>] {
  const [value, setValue] = React.useState<Value>(defaultValue);
  const getStorageValue = (): Promise<Value> =>
    browser.storage.sync
      .get(key)
      .catch(() => browser.storage.local.get(key))
      .then((items) => items[key]);
  const setStorageValue = (value: Value): Promise<void> =>
    browser.storage.sync
      .set({ [key]: value })
      .catch(() => browser.storage.local.set({ [key]: value }))
      .then(() => setValue(value));
  const resetValue = () => setStorageValue(defaultValue);

  React.useEffect(() => {
    const onStorageChanges = async (changes: { [key: string]: { newValue: Value } }) => {
      if (changes[key]) {
        setValue(changes[key].newValue);
      }
    };

    browser.storage.onChanged.addListener(onStorageChanges);
    return () => browser.storage.onChanged.removeListener(onStorageChanges);
  }, []);

  React.useEffect(() => {
    void getStorageValue().then((value) => setValue(value));
  }, []);

  return [value, setStorageValue, resetValue];
}
