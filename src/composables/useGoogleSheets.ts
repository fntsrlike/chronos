import { unref } from 'vue';
import { DateTime } from 'luxon';
import { storeToRefs } from 'pinia';
import { useSettingsStore } from 'src/stores/settings-store';
import { useLocalStorage } from '@vueuse/core';
import { useReportGenerator } from 'src/composables/useReportGenerator';
import { useGoogle } from './useGoogle';
import { useGoogleProfiles } from './useGoogleProfiles';
import { useTimeCalculator } from './useTimeCalculator';

const spreadsheetId = useLocalStorage('spreadsheetId', '');
const sheetName = useLocalStorage('sheetName', '');

const appendData = async (_gapi : typeof gapi) => {
  const params = {
    spreadsheetId: spreadsheetId.value,
    range: sheetName.value,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
  };

  const { minDate, maxDate } = storeToRefs(useSettingsStore());
  const { recordType, teamName } = useReportGenerator();

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
  spreadsheetId,
  sheetName,
  sendData,
});
