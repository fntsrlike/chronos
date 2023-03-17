import { EventApi, EventInput } from '@fullcalendar/core';
import { ref, computed, watch } from 'vue';
import { useGoogleCalendar } from './useGoogleCalendar';
import { useTimeUtilities } from './useTimeUtilities';

const selectedEvents = ref<EventApi[]>([]);
const toggleSelectedEvent = (event :EventApi) => {
  selectedEvents.value = selectedEvents.value.some((x) => x.id === event.id)
    ? selectedEvents.value.filter((x) => x.id !== event.id)
    : [...selectedEvents.value, event];
};

const { workDayIntervals } = useTimeUtilities();
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
});
