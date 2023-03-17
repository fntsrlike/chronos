import { EventApi, EventInput } from '@fullcalendar/core';
import { ref, computed, watch } from 'vue';
import { useGoogleCalendar } from './useGoogleCalendar';
import { useTimeUtilities } from './useTimeUtilities';

const selectedEvents = ref<EventApi[]>([]);

const {
  workDayIntervals,
  workTimeIntervals,
  createEventInterval,
  calcIntervalsDifference,
} = useTimeUtilities();

const eventsIntervals = computed(() => selectedEvents.value.map((event) => createEventInterval(event)));
const devTimeIntervals = computed(() => calcIntervalsDifference(workTimeIntervals.value, eventsIntervals.value));

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
