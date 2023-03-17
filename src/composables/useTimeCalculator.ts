import { computed } from 'vue';
import { useCalendar } from './useCalendar';
import { useTimeUtilities } from './useTimeUtilities';

const {
  leaveTitle,
  supportTitle,
  selectedEvents,
} = useCalendar();

const {
  workTimeIntervals,
  workDayIntervals,
  createEventInterval,
  calcIntervalsDifference,
  calcIntervalsUnion,
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
const leaveEvents = computed(() => selectedEvents.value.filter((event) => (event.title === leaveTitle)));
const supportEvents = computed(() => selectedEvents.value.filter((event) => (event.title === supportTitle)));

const eventsIntervals = computed(() => selectedEvents.value.map((event) => createEventInterval(event)));
const leaveDaysIntervals = computed(() => leaveEvents.value.map((event) => createEventInterval(event)));
const supportDaysIntervals = computed(() => supportEvents.value.map((event) => createEventInterval(event)));

// off-work   = the workdays exclude work-time
// rest       = off-work + leave
// unworkable = off-work + leave + support
const offWorkTimeIntervals = computed(() => calcIntervalsDifference(workDayIntervals.value, workTimeIntervals.value));
const leaveTimeIntervals = computed(() => calcIntervalsDifference(leaveDaysIntervals.value, offWorkTimeIntervals.value));
const restTimeIntervals = computed(() => calcIntervalsUnion(leaveTimeIntervals.value, offWorkTimeIntervals.value));
const supportTimeIntervals = computed(() => calcIntervalsDifference(supportDaysIntervals.value, restTimeIntervals.value));
const devTimeIntervals = computed(() => calcIntervalsDifference(workTimeIntervals.value, eventsIntervals.value));

const leaveHours = computed(() => intervalsToHours(leaveTimeIntervals.value));
const supportHours = computed(() => intervalsToHours(supportTimeIntervals.value));
const workHours = computed(() => intervalsToHours(workTimeIntervals.value));
const devHours = computed(() => intervalsToHours(devTimeIntervals.value));

export const useTimeCalculator = () => ({
  workHours,
  leaveHours,
  supportHours,
  devHours,
});
