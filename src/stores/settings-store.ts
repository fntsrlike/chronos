import { maxBy, minBy } from 'lodash';
import { DateTime } from 'luxon';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useLocalStorage } from '@vueuse/core';

export const useSettingsStore = defineStore('settings', () => {
  const name = ref('unknown name');
  const email = ref('unknown@email.com');
  const avatarUrl = ref('');

  const days = ref([
    {
      from: DateTime.now().startOf('week'), // inclusive
      to: DateTime.now().startOf('week').plus({ days: 5 }), // exclusive
    },
    {
      from: DateTime.now().startOf('week').plus({ days: 7 }), // inclusive
      to: DateTime.now().startOf('week').plus({ days: 12 }), // exclusive
    },
  ]);

  const minDate = computed(() => minBy(days.value, (x) => x.from)?.from ?? DateTime.now().startOf('day'));
  const maxDate = computed(() => maxBy(days.value, (x) => x.to)?.to ?? DateTime.now().startOf('day').plus({ days: 1 }));

  const morningBeginTime = useLocalStorage('morningBeginTime', '11:00');
  const morningEndTime = useLocalStorage('morningEndTime', '13:00');
  const afternoonBeginTime = useLocalStorage('afternoonBeginTime', '14:00');
  const afternoonEndTime = useLocalStorage('afternoonEndTime', '18:00');

  const getMorningBeginTimeObject = computed(() => ({ hours: parseInt(morningBeginTime.value.split(':')[0], 10), minutes: parseInt(morningBeginTime.value.split(':')[1], 10) }));
  const getMorningEndTimeObject = computed(() => ({ hours: parseInt(morningEndTime.value.split(':')[0], 10), minutes: parseInt(morningEndTime.value.split(':')[1], 10) }));
  const getAfternoonBeginTimeObject = computed(() => ({ hours: parseInt(afternoonBeginTime.value.split(':')[0], 10), minutes: parseInt(afternoonBeginTime.value.split(':')[1], 10) }));
  const getAafternoonEndTimeObject = computed(() => ({ hours: parseInt(afternoonEndTime.value.split(':')[0], 10), minutes: parseInt(afternoonEndTime.value.split(':')[1], 10) }));

  return {
    name,
    email,
    avatarUrl,
    days,
    minDate,
    maxDate,
    morningBeginTime,
    morningEndTime,
    afternoonBeginTime,
    afternoonEndTime,
    getMorningBeginTimeObject,
    getMorningEndTimeObject,
    getAfternoonBeginTimeObject,
    getAafternoonEndTimeObject,
  };
});
