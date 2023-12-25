import { useLocalStorage } from '@vueuse/core';
import { useReportGenerator } from 'src/composables/useReportGenerator';
import { useGoogle } from './useGoogle';

const spreadsheetId = useLocalStorage('spreadsheetId', '');
const sheetName = useLocalStorage('sheetName', '');

const appendData = async (_gapi : typeof gapi) => {
  const params = {
    spreadsheetId: spreadsheetId.value,
    range: sheetName.value,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
  };

  const { dataRow } = useReportGenerator();
  const valueRangeBody = {
    majorDimension: 'ROWS',
    values: [dataRow.value],
  };

  await _gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody);
};

const { callGapi } = useGoogle();
const sendData = () => {
  callGapi(appendData);
};

export const useGoogleSheets = () => ({
  spreadsheetId,
  sheetName,
  sendData,
});
