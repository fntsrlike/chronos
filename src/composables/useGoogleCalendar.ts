import { storeToRefs } from 'pinia';
import { useSettingsStore } from 'src/stores/settings-store';
import { Ref, ref } from 'vue';
import { Notify } from 'quasar';
import { IEvent } from '../interfaces/event';
import { useGoogle } from './useGoogle';

const events : Ref<IEvent[]> = ref([]);

const {
  showDeclinedEvent,
  minDate, maxDate, email,
} = storeToRefs(useSettingsStore());

const getEvents = async () => {
  try {
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
  } catch {
    Notify.create({
      icon: 'error',
      message: 'Google API error!',
      caption: 'Try again later',
      color: 'negative',
      position: 'top-right',
      progress: true,
    });
  }
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
