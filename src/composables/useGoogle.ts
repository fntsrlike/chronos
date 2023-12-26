import {
  StorageSerializers, useScriptTag, refAutoReset, useSessionStorage,
} from '@vueuse/core';
import { ref, watchEffect } from 'vue';
import { Notify } from 'quasar';
import { DateTime } from 'luxon';
import { useGoogleProfiles } from './useGoogleProfiles';

const CLIENT_ID = process.env.GOOGLE_API_CLIENT_ID || '';
const API_KEY = process.env.GOOGLE_API_KEY;
const DISCOVERY_DOCS = [
  // Look up APIs URL from https://www.googleapis.com/discovery/v1/apis/
  'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
  'https://www.googleapis.com/discovery/v1/apis/sheets/v4/rest',
  'https://www.googleapis.com/discovery/v1/apis/people/v1/rest',
];
const SCOPES = [
  // Look up scopes URL from https://developers.google.com/identity/protocols/oauth2/scopes
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
];

const isLoading = refAutoReset(false, 30 * 1000);

const isAuthenticated = ref(false);
const token = useSessionStorage<google.accounts.oauth2.TokenResponse | null>('token', null, { serializer: StorageSerializers.object });
const tokenExpiry = useSessionStorage<DateTime | null>('tokenExpiry', null, {
  serializer: {
    read: (raw) => (raw ? DateTime.fromISO(raw) : null),
    write: (value) => value?.toISO() ?? '',
  },
});
const isTokenValid = () : boolean => (token.value && tokenExpiry.value && (tokenExpiry.value > DateTime.now())) || false;
isAuthenticated.value = isTokenValid();

const { hasProfiles, getProfiles } = useGoogleProfiles();

// Google Identity Services
const loadGoogle = new Promise<typeof google>((resolve) => {
  useScriptTag('https://accounts.google.com/gsi/client', () => {
    resolve(google);
  });
});

// Google API
const loadGapi = new Promise<typeof gapi>((resolve) => {
  useScriptTag('https://apis.google.com/js/api.js', () => {
    gapi.load('client', async () => {
      await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: DISCOVERY_DOCS,
      });

      isLoading.value = false;

      watchEffect(() => {
        if (token.value && tokenExpiry.value && tokenExpiry.value > DateTime.now()) {
          gapi.client.setToken(token.value);
          isAuthenticated.value = true;
        } else {
          token.value = null;
          tokenExpiry.value = null;
          isAuthenticated.value = false;
        }
      });

      resolve(gapi);
    });
  });
});

const checkToken = async (callback: () => Promise<void>) => {
  const google = await loadGoogle;
  const gapi = await loadGapi;

  try {
    const callbackFn = async () => {
      isLoading.value = true;

      if (!hasProfiles.value) {
        await getProfiles();
      }
      await callback();
      isLoading.value = false;
    };

    const tokenClient = google.accounts.oauth2
      .initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES.join(' '),
        callback: callbackFn,
      });

    if (gapi.client.getToken() === null) {
      // Prompt the user to select a Google Account and ask for consent to share their data
      // when establishing a new session.
      tokenClient.requestAccessToken();
    } else {
      await callbackFn();
    }
  } catch {
    Notify.create({
      icon: 'error',
      message: 'Google script loading timeout!',
      caption: 'Try disabling your ad blocker',
      color: 'negative',
      position: 'top-right',
      progress: true,
    });
    isLoading.value = false;
  }
};

export const useGoogle = () => ({
  isLoading,
  isAuthenticated,
  checkToken,
});
