/* global chrome gapi */
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const SPREADSHEET_ID = process.env.REACT_APP_SPREADSHEET_ID;
const SHEET_ID = +process.env.REACT_APP_SHEET_ID;
const TABLE_NAME = process.env.REACT_APP_TABLE_NAME;

const SCOPE = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/spreadsheets',
].join(' ');

interface ProjectType {
  id: string;
  company: string;
  project: string;
  details: string;
}

interface RecordType {
  id?: string;
  name?: string;
  date?: string;
  company: string;
  project: string;
  description: string;
  ticket: string;
  time: number;
}

/* eslint-disable no-undef */
console.log('Background.js file loaded');

// Lisener for actions
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log(message);
  const { action, payload } = message;
  switch (action) {
    case 'addRow':
      await addRow(payload);
      break;
    case 'updateRow':
      await updateRow(payload);
      break;
    case 'deleteRow':
      await deleteRow(payload);
      break;
    default:
      break;
  }
  // Callback for that request
  sendResponse({ message: `Background action: ${action}` });
});

// Load table
const loadTable = async (token: string): Promise<any> => {
  console.log('Loading table...');
  const userInfo = await fetch(
    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`
  );
  const profile = await userInfo.json();
  chrome.storage.local.set({ profile });
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
      }
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
        }
      )
      .filter((record) => record.time !== undefined);

  // Last record
  const lastRecord = records.slice(-1)[0];
  if (lastRecord.time === 0) {
    chrome.browserAction.setBadgeText({
      text: '▶️',
    });
  }

  // save in the local storage
  chrome.storage.local.set(
    {
      projects,
      range: lastRecord.id,
      records: records.slice(Math.max(records.length - 15, 0)).reverse(),
      isRunning: lastRecord.time === 0,
    },
    () => {
      console.log('Data stored...');
      // chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
      //   if (changeInfo.status === 'complete') {
      //     await chrome.tabs.query(
      //       { active: true, currentWindow: true },
      //       (tabs) => {
      //         const port = chrome.tabs.connect(tabs[0].id);
      //         port.postMessage({ message: changeInfo.status });
      //         port.onMessage.addListener((response) => {
      //           console.log(response);
      //         });
      //       }
      //     );
      //   }
      // });
      // chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      //   if (changeInfo.status === "complete") {
      //     chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      //       chrome.tabs.sendMessage(
      //         tabs[0].id,
      //         { message: "ready" },
      //         response => {
      //           console.log(
      //             `message response to bakground: ${JSON.stringify(response)}`
      //           );
      //         }
      //       );
      //     });
      //   }
      // });
    }
  );
};

// Add new row
const addRow = async ({ record, badge = '' }): Promise<any> => {
  chrome.storage.local.set({ isRunning: true, start: Date.now(), record });
  const values = Object.values(record);

  const response = await gapi.client.sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${TABLE_NAME}!A2:G2`,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    resource: {
      values: [values],
    },
  });

  const {
    result: {
      updates: { updatedRange },
    },
  } = response;

  chrome.browserAction.setBadgeText({ text: badge });
  chrome.storage.local.set({ range: updatedRange });
};

// Update row
const updateRow = async ({ range, record, badge = '' }): Promise<any> => {
  const values = Object.values(record);

  const response = await gapi.client.sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: range,
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: [values],
    },
  });

  const {
    result: { updatedRange },
  } = response;

  chrome.browserAction.setBadgeText({ text: badge });
  return updatedRange;
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

const authorize = () => {
  console.log('Authorizing...');
  chrome.identity.getAuthToken({ interactive: true }, (token: string) => {
    gapi.auth.authorize(
      {
        client_id: CLIENT_ID,
        scope: SCOPE,
        immediate: true,
      },
      () => {
        console.log('Loading Sheets API...');
        gapi.client.load('sheets', 'v4', () => {
          console.log('Setting access token...');
          gapi.client.setToken({ access_token: token });
          loadTable(token);
        });
      }
    );
  });
};

const loadScript = (url) => {
  var request = new XMLHttpRequest();
  request.onreadystatechange = () => {
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

chrome.identity.getAuthToken({ interactive: true }, function () {
  //load Google's javascript client libraries
  (window as any).gapi_onload = authorize;
  loadScript('https://apis.google.com/js/client.js');
});
