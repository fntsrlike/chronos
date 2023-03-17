import { Interval } from 'luxon';
import { storeToRefs } from 'pinia';
import { useSettingsStore } from 'src/stores/settings-store';
import { computed } from 'vue';

const {
  days,
} = storeToRefs(useSettingsStore());

const workDaysInterval = computed(() => days.value
  .flatMap((day) => Interval.fromDateTimes(day.from, day.to).splitBy({ days: 1 })));

const totalWorkIntervals = computed(() => workDaysInterval.value.flatMap((day) => [
  Interval.fromDateTimes(day.start.plus({ hours: 11 }), day.start.plus({ hours: 13 })),
  Interval.fromDateTimes(day.start.plus({ hours: 14 }), day.start.plus({ hours: 18 })),
]));

export const useTimeUtilities = () => ({
  workDaysInterval,
  totalWorkIntervals,
});
