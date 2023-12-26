import { storeToRefs } from 'pinia';
import { useSettingsStore } from 'src/stores/settings-store';
import { Ref, ref } from 'vue';
import { IEvent } from '../interfaces/event';
import { useGoogle } from './useGoogle';
import { useGoogleProfiles } from './useGoogleProfiles';

const events : Ref<IEvent[]> = ref([]);

const {
  showDeclinedEvent,
  minDate, maxDate,
} = storeToRefs(useSettingsStore());

const { getProfiles } = useGoogleProfiles();
const { email } = getProfiles();

const getEvents = async (_gapi: typeof gapi) => {
  const response = await _gapi.client.calendar.events.list({
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
    const attendeeResponse = event.attendees?.filter((attendee) => attendee.email === email).at(0);
    return (attendeeResponse?.responseStatus !== 'declined');
  }).map((e) => e as IEvent);
};

const { callGapi, isAuthenticated } = useGoogle();

const updateEvents = () => {
  callGapi(getEvents);
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
