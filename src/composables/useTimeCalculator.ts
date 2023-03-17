import { computed } from 'vue';
import { useCalendar } from './useCalendar';
import { useTimeUtilities } from './useTimeUtilities';

const {
  selectedEvents,
} = useCalendar();

const {
  workTimeIntervals,
  createEventInterval,
  calcIntervalsDifference,
  intervalsToHours,
} = useTimeUtilities();

const eventsIntervals = computed(() => selectedEvents.value.map((event) => createEventInterval(event)));
const devTimeIntervals = computed(() => calcIntervalsDifference(workTimeIntervals.value, eventsIntervals.value));

const workHours = computed(() => intervalsToHours(workTimeIntervals.value));
const devHours = computed(() => intervalsToHours(devTimeIntervals.value));

export const useTimeCalculator = () => ({
  workHours,
  devHours,
});
