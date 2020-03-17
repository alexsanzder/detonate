/* global gapi */
const CLIENT_ID = "274057418646-6elclgm75krpir8c446kvc2is1e2e4le.apps.googleusercontent.com";
const API_KEY = '1aPo1wlEXueb6poGt7X3XjYVy-VPDaGJhOO5pNBMdl48';
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

const gapiLoaded = new Promise ((resolve, reject) => {
  const initClient = () => {
    gapi?.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    })
      .then(() => resolve(gapi))
      .catch(e => reject(e));
  };

  gapi.load('client:auth2', initClient);
});