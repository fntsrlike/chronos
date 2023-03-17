import { unref } from 'vue';
import { DateTime } from 'luxon';
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

  const createdAt = DateTime.now().toFormat('yyyy-LL-dd TT');

  const data = [
    createdAt,
  ].map((d) => (unref(d)));

  const valueRangeBody = {
    majorDimension: 'ROWS',
    values: [data],
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
