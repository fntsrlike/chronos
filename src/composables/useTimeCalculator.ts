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

// There have serveral events:
// Basic
//   (1) leave (whole day)
//   (2) support (whole day)
//   (3) meeting
//   (4) improve (whole day)
// Category
//   (A) normal = meeting + leave + support
// When events are overlap, will follow the priority:
//   (1) > (2) > (3) > (4)
const eventsIntervals = computed(() => selectedEvents.value.map((event) => createEventInterval(event)));
const devTimeIntervals = computed(() => calcIntervalsDifference(workTimeIntervals.value, eventsIntervals.value));

const workHours = computed(() => intervalsToHours(workTimeIntervals.value));
const devHours = computed(() => intervalsToHours(devTimeIntervals.value));

export const useTimeCalculator = () => ({
  workHours,
  devHours,
});
