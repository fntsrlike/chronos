import { storeToRefs } from 'pinia';
import { useSettingsStore } from 'src/stores/settings-store';
import { ref } from 'vue';
import { IEvent } from '../interfaces/event';
import { useGoogle } from './useGoogle';

const events = ref<IEvent[]>([]);
const { minDate, maxDate } = storeToRefs(useSettingsStore());

const getEvents = async () => {
  const response = await window.gapi.client.calendar.events.list({
    calendarId: 'primary',
    timeMin: minDate.value.toISO(),
    timeMax: maxDate.value.toISO(),
    showDeleted: false,
    singleEvents: true,
  });

  events.value = response.result.items;
};

const { checkToken } = useGoogle();

const updateEvents = () => {
  checkToken(getEvents);
};

export const useGoogleCalendar = () => ({
  updateEvents,
  events,
});
