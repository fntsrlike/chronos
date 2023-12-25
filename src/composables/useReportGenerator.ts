import { useLocalStorage } from '@vueuse/core';
import { computed, ref } from 'vue';
import { DateTime } from 'luxon';
import { storeToRefs } from 'pinia';
import { useSettingsStore } from 'src/stores/settings-store';
import { useGoogleProfiles } from './useGoogleProfiles';
import { useTimeCalculator } from './useTimeCalculator';

const teamName = useLocalStorage('teamName', 'awesome team');

const isForecast = ref(true);
const recordType = computed(() => (isForecast.value ? 'forecast' : 'actual'));

const { minDate, maxDate } = storeToRefs(useSettingsStore());

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

const dataRow = computed(() => [
  from, to, recordType.value,
  teamName.value, name,
  workHours.value, leaveHours.value, supportHours.value, meetingHours.value, improvingHours.value,
  devHours.value, focusDevHours.value, brokenDevHours.value,
  devWithoutImprovingHours.value, focusDevWithoutImprovingHours.value, brokenDevWithoutImprovingHours.value,
  createdAt,
]);

export const useReportGenerator = () => ({
  teamName,
  isForecast,
  recordType,
  dataRow,
});
