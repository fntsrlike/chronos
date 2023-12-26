import { refAutoReset, until, useScriptTag } from '@vueuse/core';
import { ref } from 'vue';
import { Notify } from 'quasar';
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

const gapiLoaded = ref(false);
const isAuthenticated = ref(false);
const { hasProfiles, getProfiles } = useGoogleProfiles();

// Google Identity Services
const loadGoogle = new Promise<typeof google>((resolve) => {
  useScriptTag('https://accounts.google.com/gsi/client', () => {
    resolve(google);
  });
});

// Google API
useScriptTag('https://apis.google.com/js/api.js', () => {
  window.gapi.load('client', async () => {
    await window.gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: DISCOVERY_DOCS,
    });
    gapiLoaded.value = true;
  });
});

const checkToken = async (callback: () => Promise<void>) => {
  isLoading.value = true;
  const google = await loadGoogle;

  try {
    await until(gapiLoaded).toBeTruthy({ timeout: 3000, throwOnTimeout: true });
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

  const callbackFn = async () => {
    isAuthenticated.value = true;
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

  if (window.gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken();
  } else {
    await callbackFn();
  }
};

export const useGoogle = () => ({
  isLoading,
  isAuthenticated,
  checkToken,
});
