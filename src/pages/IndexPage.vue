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
import { useCalendar } from 'src/composables/useCalendar';

const { devHours, workHours } = useCalendar();
</script>
