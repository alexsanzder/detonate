/* global chrome gapi */
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const API_KEY = process.env.REACT_APP_API_KEY;
const SPREADSHEET_ID = process.env.REACT_APP_SPREADSHEET_ID;
const TABLE_NAME = process.env.REACT_APP_TABLE_NAME;

const DISCOVERY_DOCS = [
  "https://sheets.googleapis.com/$discovery/rest?version=v4"
];
const SCOPE = [
  "profile",
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive.metadata"
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
chrome.identity.getProfileUserInfo(userInfo => {
  // console.log(userInfo);
});

chrome.identity.getAuthToken({ interactive: true }, token => {
  //load Google's javascript client libraries
  (<any>window).gapi_onload = () => {
    gapi.auth.authorize(
      {
        client_id: CLIENT_ID,
        scope: SCOPE,
        immediate: true
      },
      () => {
        gapi.client.load("sheets", "v4", () => {
          gapi.client.setToken({ access_token: token });
          main();
        });
      }
    );
  };
  loadScript("https://apis.google.com/js/client.js");
});

const main = async (): Promise<any> => {
  console.log("Getting list of Sheets from Google Drive");
  // const sheetProperties = await gapi.client.sheets.spreadsheets.getByDataFilter(
  //   {
  //     spreadsheetId: SPREADSHEET_ID,
  //     resource: {
  //       dataFilters: [
  //         {
  //           a1Range: TABLE_NAME
  //         }
  //       ]
  //     }
  //   }
  // );
  // console.log(sheetProperties);

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

  const lastRecord =
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
      .pop();

  chrome.storage.sync.set({
    range: lastRecord?.id,
    isRunning: lastRecord?.time === 0
  });

  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status == "complete") {
      chrome.tabs.query({ active: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {
          projects
        });
      });
    }
  });
};

const addRecord = async (record: any): Promise<any> => {
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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { message, range, record } = request;
  switch (message) {
    case "addRecord":
      addRecord(record);
      break;
    case "updateRecord":
      updateRecord(range, record);
      break;
    default:
      break;
  }
  // Callback for that request
  sendResponse({ message: "Record cahnged!" });
});

const loadScript = (url: string): void => {
  var request = new XMLHttpRequest();
  request.onreadystatechange = () => {
    if (request.readyState !== 4) {
      return;
    }
    if (request.status !== 200) {
      return;
    }
    eval(request.responseText);
  };
  request.open("GET", url);
  request.send();
};
