import {
  StorageSerializers, useScriptTag, refAutoReset, useSessionStorage,
} from '@vueuse/core';
import { ref, watchEffect } from 'vue';
import { Notify } from 'quasar';
import { DateTime } from 'luxon';
import { useGoogleProfiles } from './useGoogleProfiles';
import { useHooks } from './useHooks';

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

const { runSignInCallbacks, runSignOutCallbacks } = useHooks();

const { hasProfiles, loadProfiles } = useGoogleProfiles();

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
          if (!hasProfiles.value) {
            loadProfiles(gapi);
          }
          runSignInCallbacks(gapi);
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

const signIn = async () => {
  const google = await loadGoogle;
  return new Promise<google.accounts.oauth2.TokenResponse>((resolve) => {
    google.accounts.oauth2
      .initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES.join(' '),
        callback: (response) => {
          token.value = response;
          tokenExpiry.value = DateTime.now().plus({ seconds: Number(response.expires_in) });
          resolve(response);
        },
      })
      .requestAccessToken();
  });
};

const signOut = async () => {
  isLoading.value = true;
  const google = await loadGoogle;
  return new Promise<void>((resolve, reject) => {
    if (!token.value) {
      reject('no token');
      return;
    }

    google.accounts.oauth2
      .revoke(token.value.access_token, () => {
        runSignOutCallbacks();
        token.value = null;
        tokenExpiry.value = null;
        isAuthenticated.value = false;
        isLoading.value = false;
        runSignOutCallbacks();
        resolve();
      });
  });
};

const callGapi = async (callback: (_gapi: typeof gapi) => Promise<void>) => {
  const gapi = await loadGapi;

  try {
    isLoading.value = true;
    await signIn();
    await callback(gapi);
    isLoading.value = false;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);

    signOut();

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

export const useGoogle = () => ({
  isLoading,

  isAuthenticated,
  signIn,
  signOut,

  callGapi,
});
