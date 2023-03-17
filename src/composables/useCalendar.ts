import { EventApi, EventInput } from '@fullcalendar/core';
import { DateTime, Interval } from 'luxon';
import { ref, computed, watch } from 'vue';
import { useGoogleCalendar } from './useGoogleCalendar';
import { useTimeUtilities } from './useTimeUtilities';

const selectedEvents = ref<EventApi[]>([]);

const { workDayIntervals, workTimeIntervals } = useTimeUtilities();

const eventIntervals = computed(() => selectedEvents.value.map((event) => Interval.fromDateTimes(
  DateTime.fromISO(event.start?.toISOString() ?? ''),
  DateTime.fromISO(event.end?.toISOString() ?? ''),
)));

const devTimeIntervals = computed(() => eventIntervals.value.reduce((acc, curr) => acc
  .flatMap((x) => x.difference(curr)), workTimeIntervals.value));

const workHours = computed(() => workTimeIntervals.value.reduce((acc, curr) => acc + curr.toDuration('hours').hours, 0));
const devHours = computed(() => devTimeIntervals.value.reduce((acc, curr) => acc + curr.toDuration('hours').hours, 0));

const toggleSelectedEvent = (event :EventApi) => {
  selectedEvents.value = selectedEvents.value.some((x) => x.id === event.id)
    ? selectedEvents.value.filter((x) => x.id !== event.id)
    : [...selectedEvents.value, event];
};

const { events: _events } = useGoogleCalendar();
const events = computed(() => [
  ..._events.value.map<EventInput>((event) => ({
    id: event.id,
    start: event.start.dateTime ?? event.start.date,
    end: event.end.dateTime ?? event.end.date,
    title: event.summary,
  })),
  ...workDayIntervals.value.flatMap((x) => [
    {
      id: crypto.randomUUID(),
      start: x.start.toISODate(),
      end: x.end.toISODate(),
      title: 'Support',
    },
    {
      id: crypto.randomUUID(),
      start: x.start.toISODate(),
      end: x.end.toISODate(),
      title: 'Leave',
    },
  ]),
]);

watch(events, () => {
  selectedEvents.value = [];
});

export const useCalendar = () => ({
  events,
  selectedEvents,
  toggleSelectedEvent,
  workHours,
  devHours,
});
