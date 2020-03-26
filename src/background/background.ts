/* global chrome gapi */
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const API_KEY = process.env.REACT_APP_API_KEY;
const SPREADSHEET_ID = process.env.REACT_APP_SPREADSHEET_ID;
const SHEET_ID = +process.env.REACT_APP_SHEET_ID;
const TABLE_NAME = process.env.REACT_APP_TABLE_NAME;

const DISCOVERY_DOCS = [
  "https://sheets.googleapis.com/$discovery/rest?version=v4",
  "https://people.googleapis.com/$discovery/rest?version=v1"
];
const SCOPE = [
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/spreadsheets"
  // "https://www.googleapis.com/auth/drive.metadata"
].join(" ");

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

// Init gapi client and load table
const init = async (token: string): Promise<any> => {
  const userInfo = await fetch(
    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`
  );
  const profile = await userInfo.json();
  chrome.storage.sync.set({ profile });

  const response = await gapi.client.sheets.spreadsheets.values.batchGet({
    spreadsheetId: SPREADSHEET_ID,
    valueRenderOption: "UNFORMATTED_VALUE",
    dateTimeRenderOption: "FORMATTED_STRING",
    majorDimension: "DIMENSION_UNSPECIFIED",
    ranges: ["projects!A2:C", `${TABLE_NAME}!A2:G`]
  });
  const {
    result: { valueRanges }
  } = response;

  const projects =
    valueRanges &&
    valueRanges[0].values?.reverse().map(
      (value: any[], index: number): ProjectType => {
        return {
          id: `!A${index + 2}`,
          company: value[0],
          project: value[1],
          details: value[0]
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
            time: value[6]
          };
        }
      )
      .filter(record => record.time !== undefined);

  // Last record
  const lastRecord = records.pop();

  // save in the sync storage
  chrome.storage.sync.set({
    projects,
    range: lastRecord.id,
    records: records.slice(Math.max(records.length - 15, 0)).reverse(),
    isRunning: lastRecord.time === 0
  });
};

// Add new record
const addRecord = async (record: any): Promise<any> => {
  chrome.storage.sync.set({ isRunning: true, start: Date.now() });
  const response = await gapi.client.sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${TABLE_NAME}!A2:G2`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    resource: {
      values: [record]
    }
  });

  const {
    result: {
      updates: { updatedRange }
    }
  } = response;

  chrome.storage.sync.set({ range: updatedRange });
};

// Update record
const updateRecord = async (
  range: string,
  record: RecordType[]
): Promise<any> => {
  return await gapi.client.sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: range,
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [record]
    }
  });
};

// Delete record
const deleteRecord = async (index: number): Promise<any> => {
  return await gapi.client.sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    resource: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: SHEET_ID,
              dimension: "ROWS",
              startIndex: index - 1,
              endIndex: index
            }
          }
        }
      ]
    }
  });
};

// Lisener for the exec functions
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { message, range, record, index } = request;
  switch (message) {
    case "addRecord":
      addRecord(record);
      break;
    case "updateRecord":
      updateRecord(range, record);
      break;
    case "deleteRecord":
      deleteRecord(index);
      break;
    default:
      break;
  }
  // Callback for that request
  sendResponse({ message: "Record cahnged!" });
});

//load Google's javascript client libraries
(window as any).gapi_onload = () => {
  chrome.identity.getAuthToken({ interactive: true }, (token: string) => {
    gapi.auth.authorize(
      {
        client_id: CLIENT_ID,
        scope: SCOPE,
        immediate: true
      },
      () => {
        // gapi.client.load("people", "v1", async () => {
        //   await gapi.client.setToken({ access_token: token });
        //   await gapi.client.people.people
        //     .get({
        //       resourceName: "people/me",
        //       personFields: "names"
        //     })
        //     .then(function(response) {
        //       // Handle the results here (response.result has the parsed body).
        //       console.log("Response", response);
        //     });
        // });

        gapi.client.load("sheets", "v4", () => {
          gapi.client.setToken({ access_token: token });
          init(token);
        });
      }
    );
  });
};
