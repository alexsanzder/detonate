[<img align="right" src="src/logo.svg?sanitize=true" width="30%">]()

# Detonate time tracker extension

Browser extension using Google Sheets as data storage written in React

- [x] Chrome
- [ ] Firefox
- [ ] Edge
- [ ] Opera

## Features

- Google Sheet as database storage
  - Privacy. No sharing sensitive data with 3rd party. It's your personal data. It should belong to you.
  - Sheets is way better at handling numbers than me. You can do all kinds of analysis using graphs, formulas, etc.
- Tracking Daily Projects Task
- Daily summary
- Select Cliets, Projects and releted Tickets
- React Popup App and Content Script
  - React Hooks
  - useReducer and Context Api
- CSS-in-JS
  - Tailwind CSS
  - Emotion Styled Components
  - Babel Tailwind macro "tw"
  - Dark/Light theme (WIP)
- Custom Webpack
  - Watch mode dev server

[<img src="docs/Detonate Popup.png?sanitize=true" width="85%">]()

## Getting started

1. Make a copy of [Detonate - Time Tracking Sheet](https://docs.google.com/spreadsheets/d/1aPo1wlEXueb6poGt7X3XjYVy-VPDaGJhOO5pNBMdl48/edit?usp=sharing) to your drive `File -> Make a copy...`

2. Note the **YOUR_SPREADSHEET_ID** of the new sheet (it's part of the URL)

3. Duplicate the DEtonate example tracking sheet with your name and take a note of **YOUR_TABLE_NAME**

   [<img src="docs/Make a copy.png?sanitize=true" width="40%">]()

4. Edit the rename `.env.sample` to `.env`and edit it with your data:

```
REACT_APP_SPREADSHEET_ID=YOUR_SPREADSHEET_ID
REACT_APP_TABLE_NAME=YOUR_TABLE_NAME
```

5. Clone, install dependencies

```
npm install
or
yarn
```

6. Build the extension

```
npm run build
or
yarn build
```

6. Create a Chrome extension with the files in the `extension` folder (you can follow [this guide](https://support.google.com/chrome/a/answer/2714278?hl=en))

7. Generate a OAuth 2.0 client ID in the [Google API Console](https://console.cloud.google.com/apis/). Select "Chrome App", and insert your App ID (which is generated when you create the extension).

8. In the manifest.json, replace "google_client_id" with your previously generated OAuth 2.0 client ID and update the "spreadsheetId" with your **YOUR_SPREADSHEET_ID**

9. Update the .env file with **YOUR_CLIENT_ID**

```
REACT_APP_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
```

9. Generate an API key, leave it as unrestricted, updatethe .env file with the generated API key **YOUR_API_KEY**

```
REACT_APP_API_KEY=YOUR_API_KEY
```

10. Re-Build the extension and enjoy!

```
npm run build
or
yarn build
```

### Sharing

Adding another person (for example your partner) to the app is easy – you just give them access to the detonate sheet in Google Sheets.

After that, they have the same access as you are and can traking the time in the projects through the same URL.
