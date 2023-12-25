import { storeToRefs } from 'pinia';
import { useSettingsStore } from 'src/stores/settings-store';
import { Ref, ref } from 'vue';
import { IEvent } from '../interfaces/event';
import { useGoogle } from './useGoogle';
import { useGoogleProfiles } from './useGoogleProfiles';
import { useHooks } from './useHooks';

const events : Ref<IEvent[]> = ref([]);
const showDeclinedEvent = ref(false);

const {
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

const { callGapi } = useGoogle();
const updateEvents = () => {
  callGapi(getEvents);
};

const clearEvents = () => { events.value = []; };

const { addSignInCallbacks, addSignOutCallbacks } = useHooks();
addSignInCallbacks(getEvents);
addSignOutCallbacks(clearEvents);

export const useGoogleCalendar = () => ({
  showDeclinedEvent,
  updateEvents,
  clearEvents,
  events,
});
