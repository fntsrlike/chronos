import { computed } from 'vue';
import { useCalendar } from './useCalendar';
import { useTimeUtilities } from './useTimeUtilities';

const {
  leaveTitle,
  supportTitle,
  improveTitle,
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
const unsprint = [leaveTitle, supportTitle, improveTitle];
const leaveEvents = computed(() => selectedEvents.value.filter((event) => (event.title === leaveTitle)));
const supportEvents = computed(() => selectedEvents.value.filter((event) => (event.title === supportTitle)));
const meetingEvents = computed(() => selectedEvents.value.filter((event) => (!unsprint.includes(event.title))));

const eventsIntervals = computed(() => selectedEvents.value.map((event) => createEventInterval(event)));
const leaveDaysIntervals = computed(() => leaveEvents.value.map((event) => createEventInterval(event)));
const supportDaysIntervals = computed(() => supportEvents.value.map((event) => createEventInterval(event)));
const meetingEventsIntervals = computed(() => meetingEvents.value.map((event) => createEventInterval(event)));

// off-work   = the workdays exclude work-time
// rest       = off-work + leave
// unworkable = off-work + leave + support
const offWorkTimeIntervals = computed(() => calcIntervalsDifference(workDayIntervals.value, workTimeIntervals.value));
const leaveTimeIntervals = computed(() => calcIntervalsDifference(leaveDaysIntervals.value, offWorkTimeIntervals.value));
const restTimeIntervals = computed(() => calcIntervalsUnion(leaveTimeIntervals.value, offWorkTimeIntervals.value));
const supportTimeIntervals = computed(() => calcIntervalsDifference(supportDaysIntervals.value, restTimeIntervals.value));
const unworkableTimeIntervals = computed(() => calcIntervalsUnion(restTimeIntervals.value, supportTimeIntervals.value));
const meetingTimeIntervals = computed(() => calcIntervalsDifference(meetingEventsIntervals.value, unworkableTimeIntervals.value));
const devTimeIntervals = computed(() => calcIntervalsDifference(workTimeIntervals.value, eventsIntervals.value));

const leaveHours = computed(() => intervalsToHours(leaveTimeIntervals.value));
const supportHours = computed(() => intervalsToHours(supportTimeIntervals.value));
const meetingHours = computed(() => intervalsToHours(meetingTimeIntervals.value));
const workHours = computed(() => intervalsToHours(workTimeIntervals.value));
const devHours = computed(() => intervalsToHours(devTimeIntervals.value));

export const useTimeCalculator = () => ({
  workHours,
  leaveHours,
  supportHours,
  meetingHours,
  devHours,
});
