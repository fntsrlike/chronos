import { useLocalStorage } from '@vueuse/core';
import { computed, ref } from 'vue';

const teamName = useLocalStorage('teamName', 'awesome team');

const isForecast = ref(true);
const recordType = computed(() => (isForecast.value ? 'forecast' : 'actual'));

export const useReportGenerator = () => ({
  teamName,
  isForecast,
  recordType,
});
