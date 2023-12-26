import { unref } from 'vue';
import { DateTime } from 'luxon';
import { storeToRefs } from 'pinia';
import { useSettingsStore } from 'src/stores/settings-store';
import { useGoogle } from './useGoogle';
import { useGoogleProfiles } from './useGoogleProfiles';
import { useTimeCalculator } from './useTimeCalculator';

const SPREADSHEET_ID = process.env.SPREADSHEET_ID as string;
const SHEET_NAME = process.env.SHEET_NAME as string;

const appendData = async (_gapi : typeof gapi) => {
  const params = {
    spreadsheetId: SPREADSHEET_ID,
    range: SHEET_NAME,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
  };

  const {
    minDate, maxDate, recordType, teamName,
  } = storeToRefs(useSettingsStore());

  const { getProfiles } = useGoogleProfiles();
  const { name } = getProfiles();

  const {
    workHours, leaveHours, supportHours, meetingHours, improvingHours,
    devHours, focusDevHours, brokenDevHours,
    devWithoutImprovingHours, focusDevWithoutImprovingHours, brokenDevWithoutImprovingHours,
  } = useTimeCalculator();

  const from = minDate.value.toFormat('yyyy-LL-dd');
  const to = maxDate.value.toFormat('yyyy-LL-dd');
  const createdAt = DateTime.now().toFormat('yyyy-LL-dd TT');

  const data = [
    from, to, recordType,
    teamName, name,
    workHours, leaveHours, supportHours, meetingHours, improvingHours,
    devHours, focusDevHours, brokenDevHours,
    devWithoutImprovingHours, focusDevWithoutImprovingHours, brokenDevWithoutImprovingHours,
    createdAt,
  ].map((d) => (unref(d)));

  const valueRangeBody = {
    majorDimension: 'ROWS',
    values: [data],
  };
  await _gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody);
};

const { callGapi } = useGoogle();
const sendData = () => {
  callGapi(appendData);
};

export const useGoogleSheets = () => ({
  sendData,
});
