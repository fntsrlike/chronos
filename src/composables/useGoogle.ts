import { refAutoReset, until, useScriptTag } from '@vueuse/core';
import { ref } from 'vue';

const CLIENT_ID = process.env.GOOGLE_API_CLIENT_ID || '';
const API_KEY = process.env.GOOGLE_API_KEY;
const DISCOVERY_DOCS = [
  // Look up APIs URL from https://www.googleapis.com/discovery/v1/apis/
  'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
];
const SCOPES = [
  // Look up scopes URL from https://developers.google.com/identity/protocols/oauth2/scopes
  'https://www.googleapis.com/auth/calendar.readonly',
];

const gapiLoaded = ref(false);
const gsiLoaded = ref(false);
const isAuthenticated = ref(false);
const isLoading = refAutoReset(false, 30 * 1000);

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

// Google Identity Services
useScriptTag('https://accounts.google.com/gsi/client', () => {
  gsiLoaded.value = true;
});

const checkToken = async (callback: () => Promise<void>) => {
  isLoading.value = true;
  await until(gsiLoaded).toBeTruthy();
  await until(gapiLoaded).toBeTruthy();

  const callbackFn = async () => {
    isAuthenticated.value = true;
    await callback();
    isLoading.value = false;
  };

  const tokenClient = window.google.accounts.oauth2
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
