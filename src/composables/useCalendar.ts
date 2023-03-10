import { EventApi, EventInput } from '@fullcalendar/core';
import { ref, computed, watch } from 'vue';
import { useColors } from './useColors';
import { useGoogleCalendar } from './useGoogleCalendar';
import { useTimeUtilities } from './useTimeUtilities';

const supportTitle = 'Support';
const leaveTitle = 'Leave';
const improveTitle = 'Learning Day / Libero';

const selectedEvents = ref<EventApi[]>([]);
const toggleSelectedEvent = (event :EventApi) => {
  selectedEvents.value = selectedEvents.value.some((x) => x.id === event.id)
    ? selectedEvents.value.filter((x) => x.id !== event.id)
    : [...selectedEvents.value, event];
};

const { workDayIntervals } = useTimeUtilities();
const { colorIdMap, colorAndTypeMap } = useColors();
const { events: _events } = useGoogleCalendar();
const events = computed(() => [
  ..._events.value.map<EventInput>((event) => ({
    id: event.id,
    start: event.start.dateTime ?? event.start.date,
    end: event.end.dateTime ?? event.end.date,
    title: event.summary,
    borderColor: colorIdMap.get(event.colorId),
    textColor: colorIdMap.get(event.colorId),
  })),
  ...workDayIntervals.value.flatMap((x) => [
    {
      id: crypto.randomUUID(),
      start: x.start.toISODate(),
      end: x.end.toISODate(),
      title: supportTitle,
      borderColor: colorAndTypeMap.get('normal'),
    },
    {
      id: crypto.randomUUID(),
      start: x.start.toISODate(),
      end: x.end.toISODate(),
      title: leaveTitle,
      borderColor: colorAndTypeMap.get('normal'),
    },
    {
      id: crypto.randomUUID(),
      start: x.start.toISODate(),
      end: x.end.toISODate(),
      title: improveTitle,
      borderColor: colorAndTypeMap.get('normal'),
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
  supportTitle,
  leaveTitle,
  improveTitle,
});
