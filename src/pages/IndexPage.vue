<template>
  <q-page class="q-pa-md">
    <div class="row">
      Dev Hours: {{ devHours }} / {{ workHours }}
      <q-linear-progress
        rounded
        size="xl"
        color="warning"
        animation-speed="500"
        :value="devHours/workHours"
      />
    </div>
    <div class="row">
      <MyCalendar class="col"/>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import MyCalendar from 'src/components/MyCalendar.vue';
import { useTimeCalculator } from 'src/composables/useTimeCalculator';

const { devHours, workHours } = useTimeCalculator();
</script>
