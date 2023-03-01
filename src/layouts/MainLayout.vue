<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-icon name="schedule" size="md" />

        <q-toolbar-title>
          Chronos
        </q-toolbar-title>

        <q-btn
          flat
          round
          icon="date_range"
        >
          <q-tooltip anchor="bottom middle" self="top middle" class="text-body2 bg-dark">
            Working days
          </q-tooltip>

          <DateSettings/>
        </q-btn>

        <q-btn
          flat
          round
          :icon="isAuthenticated ? 'face' : 'account_circle'"
          :loading="isLoading"
          @click="updateEvents"
        >
          <q-tooltip v-if="!isAuthenticated" anchor="bottom middle" self="top middle" class="text-body2 bg-dark">
            Sign in with Google
          </q-tooltip>

          <template v-slot:loading>
            <q-spinner/>
          </template>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <ExportText/>
  </q-layout>
</template>

<script setup lang="ts">
import DateSettings from 'src/components/DateSettings.vue';
import ExportText from 'src/components/ExportText.vue';
import { useGoogle } from 'src/composables/useGoogle';
import { useGoogleCalendar } from 'src/composables/useGoogleCalendar';

const { isLoading, isAuthenticated } = useGoogle();
const { updateEvents } = useGoogleCalendar();

</script>
