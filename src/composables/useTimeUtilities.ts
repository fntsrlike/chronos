import { EventApi } from '@fullcalendar/core';
import { DateTime, Interval } from 'luxon';
import { storeToRefs } from 'pinia';
import { useSettingsStore } from 'src/stores/settings-store';
import { useLocalStorage } from '@vueuse/core';

import { computed } from 'vue';

const morningBeginTime = useLocalStorage('morningBeginTime', '11:00');
const morningEndTime = useLocalStorage('morningEndTime', '13:00');
const afternoonBeginTime = useLocalStorage('afternoonBeginTime', '14:00');
const afternoonEndTime = useLocalStorage('afternoonEndTime', '18:00');

const getMorningBeginTimeObject = computed(() => ({ hours: parseInt(morningBeginTime.value.split(':')[0], 10), minutes: parseInt(morningBeginTime.value.split(':')[1], 10) }));
const getMorningEndTimeObject = computed(() => ({ hours: parseInt(morningEndTime.value.split(':')[0], 10), minutes: parseInt(morningEndTime.value.split(':')[1], 10) }));
const getAfternoonBeginTimeObject = computed(() => ({ hours: parseInt(afternoonBeginTime.value.split(':')[0], 10), minutes: parseInt(afternoonBeginTime.value.split(':')[1], 10) }));
const getAfternoonEndTimeObject = computed(() => ({ hours: parseInt(afternoonEndTime.value.split(':')[0], 10), minutes: parseInt(afternoonEndTime.value.split(':')[1], 10) }));

const {
  days,
} = storeToRefs(useSettingsStore());

const createEventInterval = (event: EventApi) => Interval.fromDateTimes(
  DateTime.fromISO(event.start?.toISOString() ?? ''),
  DateTime.fromISO(event.end?.toISOString() ?? ''),
);

const calcIntervalsUnion = (summand : Interval[], addend : Interval[]) => Interval.merge(summand.concat(addend));
const calcIntervalsDifference = (minuend : Interval[], subtrahend : Interval[]) => subtrahend.reduce((acc, curr) => acc
  .flatMap((x) => x.difference(curr)), minuend);

const intervalsToHours = (intervals: Interval[]) => intervals.reduce((acc, curr) => acc + curr.toDuration('hours').hours, 0);

const filterOutBrokenTime = (hours: number) => (hours >= 1 ? hours : 0);

const workDayIntervals = computed(() => days.value
  .flatMap((day) => Interval.fromDateTimes(day.from, day.to).splitBy({ days: 1 })));

const workTimeIntervals = computed(() => workDayIntervals.value.flatMap((day) => [
  Interval.fromDateTimes(day.start.plus(getMorningBeginTimeObject.value), day.start.plus(getMorningEndTimeObject.value)),
  Interval.fromDateTimes(day.start.plus(getAfternoonBeginTimeObject.value), day.start.plus(getAfternoonEndTimeObject.value)),
]));

export const useTimeUtilities = () => ({
  calcIntervalsUnion,
  calcIntervalsDifference,
  intervalsToHours,
  filterOutBrokenTime,
  createEventInterval,
  workDayIntervals,
  workTimeIntervals,
  morningBeginTime,
  morningEndTime,
  afternoonBeginTime,
  afternoonEndTime,
});
