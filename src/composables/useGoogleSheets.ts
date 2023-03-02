import { useGoogle } from './useGoogle';

const SPREADSHEET_ID = process.env.SPREADSHEET_ID as string;
const SHEET_NAME = process.env.SHEET_NAME as string;

const appendData = async () => {
  const params = {
    spreadsheetId: SPREADSHEET_ID,
    range: SHEET_NAME,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
  };

  const valueRangeBody = {
    majorDimension: 'ROWS',
    values: [['2025-03-10', 'foo', 'bar', 5566, 9527]], // convert the object's values to an array
  };
  await window.gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody);
};

const { checkToken } = useGoogle();
const sendData = () => {
  checkToken(appendData);
};

export const useGoogleSheets = () => ({
  sendData,
});
