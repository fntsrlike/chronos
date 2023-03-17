import { DateTime, Interval } from 'luxon';
import { storeToRefs } from 'pinia';
import { useSettingsStore } from 'src/stores/settings-store';
import { computed } from 'vue';

const {
  days,
} = storeToRefs(useSettingsStore());

const createEventInterval = (event: any) => Interval.fromDateTimes(
  DateTime.fromISO(event.start?.toISOString() ?? ''),
  DateTime.fromISO(event.end?.toISOString() ?? ''),
);

const calcIntervalsDifference = (minuend : Interval[], subtrahend : Interval[]) => subtrahend.reduce((acc, curr) => acc
  .flatMap((x) => x.difference(curr)), minuend);

const workDayIntervals = computed(() => days.value
  .flatMap((day) => Interval.fromDateTimes(day.from, day.to).splitBy({ days: 1 })));

const workTimeIntervals = computed(() => workDayIntervals.value.flatMap((day) => [
  Interval.fromDateTimes(day.start.plus({ hours: 11 }), day.start.plus({ hours: 13 })),
  Interval.fromDateTimes(day.start.plus({ hours: 14 }), day.start.plus({ hours: 18 })),
]));

export const useTimeUtilities = () => ({
  calcIntervalsDifference,
  createEventInterval,
  workDayIntervals,
  workTimeIntervals,
});
