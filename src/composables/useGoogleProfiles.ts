import { useSessionStorage } from '@vueuse/core';

const theName = useSessionStorage('name', 'unknown name');
const theEmail = useSessionStorage('email', 'unknown@email.com');
const theAvatarUrl = useSessionStorage('avatarUrl', '');
const hasProfiles = useSessionStorage('isProfileLoaded', false);

const setProfiles = (name: string, email: string, avatarUrl: string) => {
  theName.value = name;
  theEmail.value = email;
  theAvatarUrl.value = avatarUrl;
  hasProfiles.value = true;
};

const loadProfiles = async (_gapi: typeof gapi) => {
  const response = await _gapi.client.people.people.get({
    resourceName: 'people/me',
    personFields: 'names,emailAddresses,photos',
  });

  const name = response.result.names?.at(0)?.displayName as string;
  const email = response.result.emailAddresses?.at(0)?.value as string;
  const avatarUrl = response.result.photos?.at(0)?.url as string;
  setProfiles(name, email, avatarUrl);
};

const getProfiles = () => ({
  name: theName.value,
  email: theEmail.value,
  avatarUrl: theAvatarUrl.value,
});

export const useGoogleProfiles = () => ({
  hasProfiles,
  loadProfiles,
  getProfiles,
});
