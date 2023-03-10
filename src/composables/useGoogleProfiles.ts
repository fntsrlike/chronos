import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useSettingsStore } from 'src/stores/settings-store';

const hasProfiles = ref(false);

const getProfiles = async () => {
  const response = await window.gapi.client.people.people.get({
    resourceName: 'people/me',
    personFields: 'names,emailAddresses,photos',
  });

  const { name, email, avatarUrl } = storeToRefs(useSettingsStore());
  name.value = response.result.names?.at(0)?.displayName as string;
  email.value = response.result.emailAddresses?.at(0)?.value as string;
  avatarUrl.value = response.result.photos?.at(0)?.url as string;
  hasProfiles.value = true;
};

export const useGoogleProfiles = () => ({
  hasProfiles,
  getProfiles,
});
