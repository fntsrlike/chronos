import { unref } from 'vue';
import { DateTime } from 'luxon';
import { storeToRefs } from 'pinia';
import { useSettingsStore } from 'src/stores/settings-store';
import { useGoogle } from './useGoogle';
import { useTimeCalculator } from './useTimeCalculator';

const SPREADSHEET_ID = process.env.SPREADSHEET_ID as string;
const SHEET_NAME = process.env.SHEET_NAME as string;

const appendData = async () => {
  const params = {
    spreadsheetId: SPREADSHEET_ID,
    range: SHEET_NAME,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
  };

  const {
    minDate, maxDate, name,
  } = storeToRefs(useSettingsStore());

  const {
    workHours, leaveHours, supportHours,
    devHours,
  } = useTimeCalculator();

  const from = minDate.value.toFormat('yyyy-LL-dd');
  const to = maxDate.value.toFormat('yyyy-LL-dd');
  const createdAt = DateTime.now().toFormat('yyyy-LL-dd TT');

  const data = [
    from, to,
    name,
    workHours, leaveHours, supportHours,
    devHours,
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
