import { storeToRefs } from 'pinia';
import { useSettingsStore } from 'src/stores/settings-store';
import { ref } from 'vue';
import { IEvent } from '../interfaces/event';
import { useGoogle } from './useGoogle';

const events = ref<IEvent[]>([]);
const {
  showDeclinedEvent,
  minDate, maxDate, email,
} = storeToRefs(useSettingsStore());

const getEvents = async () => {
  const response = await window.gapi.client.calendar.events.list({
    calendarId: 'primary',
    timeMin: minDate.value.toISO(),
    timeMax: maxDate.value.toISO(),
    showDeleted: false,
    singleEvents: true,
  });

  events.value = response.result.items.filter((event) => {
    if (showDeclinedEvent.value) {
      return true;
    }
    const attendeeResponse = event.attendees?.filter((attde) => attde.email === email.value).at(0);
    return (attendeeResponse?.responseStatus !== 'declined');
  }).map((e) => e as IEvent);
};

const { checkToken, isAuthenticated } = useGoogle();

const updateEvents = () => {
  checkToken(getEvents);
};

const updateEventsIfAuthed = () => {
  if (isAuthenticated.value) {
    updateEvents();
  }
};

export const useGoogleCalendar = () => ({
  updateEvents,
  updateEventsIfAuthed,
  events,
});
