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
          icon="send"
          v-if="isAuthenticated"
        >
        <SendData/>
        </q-btn>

        <q-btn
          flat
          round
          icon="disabled_visible"
          :text-color="showDeclinedEvent ? '' : 'grey'"
          :disable="isLoading"
          @click="toggleShowDeclined"
        >
          <q-tooltip  anchor="bottom middle" self="top middle" class="text-body2 bg-dark">
            Show declined events
          </q-tooltip>
        </q-btn>

        <q-btn
          flat
          round
          icon="access_time"
        >
          <q-tooltip anchor="bottom middle" self="top middle" class="text-body2 bg-dark">
            Working Hours
          </q-tooltip>

          <WorkingHourSetting/>
        </q-btn>

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
          :text-color="isAuthenticated ? '' : 'grey'"
          :loading="isLoading"
          @click="updateEvents"
          v-if="!isAuthenticated"
        >
          <q-tooltip  anchor="bottom middle" self="top middle" class="text-body2 bg-dark">
            Sign in with Google
          </q-tooltip>
          <template v-slot:loading>
            <q-spinner/>
          </template>
        </q-btn>

        <q-btn
          flat
          round
          :loading="isLoading"
          @click="updateEvents"
          v-if="isAuthenticated"
        >
          <q-tooltip  anchor="bottom middle" self="top middle" class="text-body2 bg-dark">
            Refresh
          </q-tooltip>
          <q-avatar size="24px">
            <img :src="avatarUrl">
          </q-avatar>
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
import { storeToRefs } from 'pinia';
import { useSettingsStore } from 'src/stores/settings-store';
import { useGoogle } from 'src/composables/useGoogle';
import { useGoogleCalendar } from 'src/composables/useGoogleCalendar';
import DateSettings from 'src/components/DateSettings.vue';
import WorkingHourSetting from 'src/components/WorkingHourSetting.vue';
import SendData from 'src/components/SendData.vue';
import ExportText from 'src/components/ExportText.vue';

const { avatarUrl, showDeclinedEvent } = storeToRefs(useSettingsStore());
const { isLoading, isAuthenticated } = useGoogle();
const { updateEvents, updateEventsIfAuthed } = useGoogleCalendar();

const toggleShowDeclined = () => {
  showDeclinedEvent.value = !showDeclinedEvent.value;
  updateEventsIfAuthed();
};
</script>
