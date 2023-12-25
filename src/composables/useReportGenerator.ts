import { useLocalStorage } from '@vueuse/core';
import { computed, ref } from 'vue';
import { DateTime, Interval } from 'luxon';
import { storeToRefs } from 'pinia';
import { useSettingsStore } from 'src/stores/settings-store';
import { groupBy, sortBy } from 'lodash';
import { useCalendar } from 'src/composables/useCalendar';
import TurndownService from 'turndown';
import { useGoogleProfiles } from './useGoogleProfiles';
import { useTimeCalculator } from './useTimeCalculator';

const createElement = (tagName: string, ...children: (Node | string)[]) => {
  const result = document.createElement(tagName);
  children.forEach((child) => {
    result.append(child);
  });
  return result;
};

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

const { selectedEvents } = useCalendar();
const exportTextElements = () => {
  const sorted = sortBy(selectedEvents.value, (x) => x.startStr);
  const groupedEvents = groupBy(sorted, (x) => DateTime.fromISO(x.startStr).toFormat('MM/dd EEE'));
  const elements = createElement(
    'p',
    createElement(
      'p',
      'Hours: ',
      createElement('b', devHours.value.toString()),
      ` / ${workHours.value.toString()}`,
    ),
    createElement('ul', ...Object.keys(groupedEvents).map((key) => createElement(
      'li',
      key,
      createElement('ul', ...groupedEvents[key].map((event) => {
        const start = DateTime.fromISO(event.startStr);
        const end = DateTime.fromISO(event.endStr);
        const duration = Interval.fromDateTimes(start, end).toDuration('hours').hours;
        return createElement(
          'li',
          `[${duration}] ${event.title}`,
        );
      })),
    ))),
  );

  return elements;
};

const turndownService = new TurndownService();
TurndownService.prototype.escape = (str) => str;

const dataRow = computed(() => [
  from, to, recordType.value,
  teamName.value, name,
  workHours.value, leaveHours.value, supportHours.value, meetingHours.value, improvingHours.value,
  devHours.value, focusDevHours.value, brokenDevHours.value,
  devWithoutImprovingHours.value, focusDevWithoutImprovingHours.value, brokenDevWithoutImprovingHours.value,
  createdAt,
  turndownService.turndown(exportTextElements().innerHTML),
]);

export const useReportGenerator = () => ({
  teamName,
  isForecast,
  recordType,
  dataRow,
  exportTextElements,
});
