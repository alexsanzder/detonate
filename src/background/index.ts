/* global chrome gapi */
import { browser } from 'webextension-polyfill-ts';

import {
  ADD_ROW,
  UPDATE_ROW,
  DELETE_ROW,
  STOP_RECORD,
  SYNC,
  CLEAR_STORAGE,
} from '../store/actions';

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const SPREADSHEET_ID = process.env.REACT_APP_SPREADSHEET_ID;
const SHEET_ID = +process.env.REACT_APP_SHEET_ID;
const TABLE_NAME = process.env.REACT_APP_TABLE_NAME;

const SCOPE = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/spreadsheets',
].join(' ');

import { ProjectType, RecordType } from '../@types';

// console.log('Background.js file loaded!');

// Load table
const loadTable = async (): Promise<void> => {
  console.log('Loading table data...');
  const response = await gapi.client.sheets.spreadsheets.values.batchGet({
    spreadsheetId: SPREADSHEET_ID,
    valueRenderOption: 'UNFORMATTED_VALUE',
    dateTimeRenderOption: 'FORMATTED_STRING',
    majorDimension: 'DIMENSION_UNSPECIFIED',
    ranges: ['projects!A2:C', `${TABLE_NAME}!A2:G`],
  });
  const {
    result: { valueRanges },
  } = response;

  const projects =
    valueRanges &&
    valueRanges[0].values?.reverse().map(
      (value: any[], index: number): ProjectType => {
        return {
          id: `!A${index + 2}`,
          company: value[0],
          project: value[1],
          details: value[0],
        };
      },
    );

  const records =
    valueRanges &&
    valueRanges[1].values
      ?.map(
        (value: any[], index: number): RecordType => {
          return {
            id: `${TABLE_NAME}!A${index + 2}:G${index + 2}`,
            name: value[0],
            date: value[1],
            company: value[2],
            project: value[3],
            description: value[4],
            ticket: value[5],
            time: value[6],
          };
        },
      )
      .filter((record) => record.time !== undefined);

  // Last record
  const lastRecord = records.slice(-1)[0];
  const isRunning = lastRecord.time === 0;
  if (isRunning) {
    records.pop();
    browser.browserAction.setBadgeText({
      text: '▶️',
    });
    browser.storage.local.set({
      isRunning,
      runningRecord: lastRecord,
    });
  }

  // save table data in the brower local storage
  browser.storage.local.set({
    projects,
    records: records.slice(Math.max(records.length - 20, 0)).reverse(),
  });

  console.log('Table data loaded!');
};

// Orginize record object to be sure it has the same order for the row
const organize = (record): RecordType => ({
  name: undefined,
  date: undefined,
  company: undefined,
  project: undefined,
  description: undefined,
  ticket: undefined,
  time: undefined,
  ...record,
});

// Add row
const addRow = async ({ record }): Promise<RecordType> => {
  delete record.id;
  const { profile } = await browser.storage.local.get(['profile']);

  // Current Date for the record
  const today = new Date().toLocaleDateString('de', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  // New record with fixed values
  const newRecord = {
    ...record,
    name: profile.name,
    date: today,
    time: 0,
  } as RecordType;

  const organizedRecord = organize(newRecord);
  const values = Object.values(organizedRecord);
  const {
    result: {
      updates: { updatedRange },
    },
  } = await gapi.client.sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${TABLE_NAME}!A2:G2`,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    resource: {
      values: [values],
    },
  });

  const runningRecord = { ...organizedRecord, id: updatedRange };
  return runningRecord;
};

// Update row
const updateRow = async ({ id: range, ...record }): Promise<RecordType> => {
  const organizedRecord = organize(record);
  const values = Object.values(organizedRecord);

  const {
    result: { updatedRange },
  } = await gapi.client.sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: range,
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: [values],
    },
  });

  const updatedRecord = { ...organizedRecord, id: updatedRange };
  return updatedRecord;
};

// Delete row
const deleteRow = async ({ index }): Promise<any> => {
  return await gapi.client.sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    resource: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: SHEET_ID,
              dimension: 'ROWS',
              startIndex: index - 1,
              endIndex: index,
            },
          },
        },
      ],
    },
  });
};

/**
 * GET ALL ITEMS LOCAL STORAGE
 * comes from the browser.storage.local
 */
const getLocalStorage = async (value = null): Promise<any> => {
  const storage = await browser.storage.local.get(value);
  // console.log(storage);
  return storage;
};

/**
 * ON MESSAGE
 * comes from the content script embedded in the page or popup
 */
browser.runtime.onMessage.addListener(
  async ({ action, message }): Promise<{ status: string; payload: any }> => {
    console.log(action, message);
    if (action)
      switch (action) {
        case ADD_ROW: {
          browser.browserAction.setBadgeText({ text: '▶️' });
          const runningRecord = await addRow(message);
          // console.log(runningRecord);

          const now = Date.now();
          browser.storage.local.set({
            runningRecord,
            isRunning: true,
            start: now,
          });

          const storage = await getLocalStorage();
          return Promise.resolve({ status: 'ADD_SUCCESS', payload: { ...storage, runningRecord } });
        }

        case UPDATE_ROW: {
          const updatedRecord = await updateRow(message.record);
          // console.log(updatedRecord);

          if (message.isTimer) {
            browser.storage.local.set({
              runningRecord: updatedRecord,
            });
          } else {
            const { records } = await getLocalStorage('records');
            const recordIndex = records.findIndex((record) => record.id === updatedRecord.id);
            records[recordIndex] = updatedRecord;

            browser.storage.local.set({
              records,
            });
          }

          const storage = await getLocalStorage();
          return Promise.resolve({
            status: 'UPDATE_SUCCESS',
            payload: { ...storage },
          });
        }

        case STOP_RECORD: {
          browser.browserAction.setBadgeText({ text: '' });
          const { records, start } = await browser.storage.local.get(['records', 'start']);
          const time = Math.abs(Date.now() - start) / 36e5;
          const newRecord = { ...message.record, time };

          const stoppedRecord = await updateRow(newRecord);
          // console.log(stoppedRecord);

          browser.storage.local.remove('runningRecord');
          browser.storage.local.set({
            isRunning: false,
            start: 0,
            records: [stoppedRecord, ...records],
          });

          const storage = await getLocalStorage();
          return Promise.resolve({
            status: 'FINISH_SUCCESS',
            payload: { ...storage },
          });
        }

        case DELETE_ROW: {
          //confirm('¯_(ツ)_/¯ ' + message.id);
          await deleteRow(message);
          //await loadTable();
          const { records, runningRecord } = await getLocalStorage();
          const filteredRecords = records.filter((record) => record.id !== message.id);
          // console.log(filteredRecords);

          browser.storage.local.set({
            runningRecord,
            records: filteredRecords,
          });

          const storage = await getLocalStorage();
          return Promise.resolve({
            status: 'DELETE_SUCCESS',
            payload: storage,
          });
        }

        case SYNC: {
          await loadTable();
          const storage = await getLocalStorage();
          return Promise.resolve({ status: 'SYNC_SUCCESS', payload: storage });
        }

        case CLEAR_STORAGE:
          await browser.storage.local.clear();
          const storage = await getLocalStorage();
          return Promise.resolve({ status: 'SUCCESS', payload: storage });

        default:
          return Promise.resolve({
            status: 'ERROR',
            payload: 'unhandled message',
          });
      }
  },
);

const authorize = (token: string): void => {
  // console.log('Authorizing...');
  gapi.auth.authorize(
    {
      // eslint-disable-next-line @typescript-eslint/camelcase
      client_id: CLIENT_ID,
      scope: SCOPE,
      immediate: true,
    },
    () => {
      // console.log('Loading Sheets API...');
      gapi.client.load('sheets', 'v4', async () => {
        // console.log('Setting access token...');
        // eslint-disable-next-line @typescript-eslint/camelcase
        gapi.client.setToken({ access_token: token });
        // console.log('Getting user info...');
        const userInfo = await fetch(
          `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`,
        );
        const profile = await userInfo.json();
        browser.storage.local.set({ profile });

        loadTable();
      });
    },
  );
};

const loadScript = (url): void => {
  const request = new XMLHttpRequest();
  request.onreadystatechange = (): void => {
    if (request.readyState !== 4) {
      return;
    }
    if (request.status !== 200) {
      return;
    }
    // eslint-disable-next-line no-eval
    eval(request.responseText);
  };
  request.open('GET', url);
  request.send();
};

chrome.identity.getAuthToken({ interactive: true }, (token) => {
  // eslint-disable-next-line @typescript-eslint/camelcase
  (window as any).gapi_onload = (): void => authorize(token);
  //load Google's javascript client libraries
  loadScript('https://apis.google.com/js/client.js');
});

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // read changeInfo data and send the new url to contentscripts.js
  if (changeInfo.status === 'complete') {
    chrome.tabs.sendMessage(tabId, {
      response: 'COMPLETE',
      tab,
    });
  }
  if (changeInfo.status === 'loading') {
    chrome.tabs.sendMessage(tabId, {
      response: 'LOADING',
      tab,
    });
  }
  if (changeInfo.url) {
    chrome.tabs.sendMessage(tabId, {
      response: 'CHANGE_URL',
      tab,
    });
  }
});
