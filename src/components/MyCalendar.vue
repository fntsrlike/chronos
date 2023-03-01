<template>
  <FullCalendar ref="fullCalendar" :options="calendarOptions" />
</template>

<script setup lang="ts">
import '@fullcalendar/core/vdom';
import FullCalendar from '@fullcalendar/vue3';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { CalendarOptions } from '@fullcalendar/core';
import { useCalendar } from 'src/composables/useCalendar';
import { computed, ref } from 'vue';
import { useSettingsStore } from 'src/stores/settings-store';
import { storeToRefs } from 'pinia';
import { DateTime } from 'luxon';
import { FullCalendarRef } from 'src/interfaces/calendar';

const { events, selectedEvents, toggleSelectedEvent } = useCalendar();

const {
  minDate, maxDate,
  morningBeginTime,
  morningEndTime,
  afternoonBeginTime,
  afternoonEndTime,
} = storeToRefs(useSettingsStore());

const fullCalendar = ref<FullCalendarRef | null>(null);

const calendarOptions = computed<CalendarOptions>(() => ({
  plugins: [timeGridPlugin, interactionPlugin],
  initialView: 'timeGridWeek',
  height: 'calc(100vh - 50px - 35px - 16px - 16px)',
  eventShortHeight: 40,
  events: events.value,
  slotEventOverlap: false,
  eventMaxStack: 2,
  validRange: {
    start: minDate.value.startOf('week').minus({ days: 1 }).toFormat('yyyy-MM-dd'), // sunday inclusive
    end: maxDate.value.endOf('week').toFormat('yyyy-MM-dd'), // sunday exclusive
  },
  businessHours: [{
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    startTime: morningBeginTime.value,
    endTime: morningEndTime.value,
  }, {
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    startTime: afternoonBeginTime.value,
    endTime: afternoonEndTime.value,
  }],
  eventBackgroundColor: 'white',
  eventTextColor: '#3788d8',
  eventClick: ({ el, event }) => {
    el.blur();
    toggleSelectedEvent(event);

    const isSelected = selectedEvents.value.some((x) => x.id === event.id);

    event.setProp('backgroundColor', isSelected ? '#3788d8' : 'white');
    event.setProp('textColor', isSelected ? 'white' : '#3788d8');
  },
  editable: true,
  eventDrop: (e) => {
    toggleSelectedEvent(e.event);
    toggleSelectedEvent(e.event);
  },
  eventResize: (e) => {
    toggleSelectedEvent(e.event);
    toggleSelectedEvent(e.event);
  },
  selectable: true,
  select: (e) => {
    // eslint-disable-next-line no-alert
    const title = prompt('Add event', 'Name');
    if (title) {
      fullCalendar.value?.getApi().addEvent({
        id: crypto.randomUUID(),
        start: DateTime.fromJSDate(e.start).toISO(),
        end: DateTime.fromJSDate(e.end).toISO(),
        title,
      });
    }
    fullCalendar.value?.getApi().unselect();
  },
}));
</script>
