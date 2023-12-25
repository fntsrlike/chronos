<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-icon name="schedule" size="md" />

        <q-toolbar-title>
          Chronos
        </q-toolbar-title>

        <template v-if="isAuthenticated">
          <q-btn
            flat
            round
            icon="send"
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
            icon="refresh"
            :loading="isLoading"
            @click="updateEvents"
          >
            <q-tooltip  anchor="bottom middle" self="top middle" class="text-body2 bg-dark">
              Reload Events
            </q-tooltip>
            <template v-slot:loading>
              <q-spinner/>
            </template>
          </q-btn>

          <q-btn
            flat
            round
            @click="dialog = true"
          >
            <q-tooltip  anchor="bottom middle" self="top middle" class="text-body2 bg-dark">
              Setting
            </q-tooltip>
            <q-avatar size="24px">
              <img :src="avatarUrl">
            </q-avatar>
            <template v-slot:loading>
              <q-spinner/>
            </template>
          </q-btn>
        </template>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <ExportText/>
  </q-layout>

  <LoginDialog v-model="dialog"/>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useSettingsStore } from 'src/stores/settings-store';
import { useGoogle } from 'src/composables/useGoogle';
import { useGoogleCalendar } from 'src/composables/useGoogleCalendar';
import SendData from 'src/components/SendData.vue';
import ExportText from 'src/components/ExportText.vue';
import LoginDialog from 'src/components/LoginDialog.vue';
import { ref } from 'vue';

const { avatarUrl, showDeclinedEvent } = storeToRefs(useSettingsStore());
const { isLoading, isAuthenticated } = useGoogle();

const dialog = ref(!isAuthenticated.value);
const { updateEvents, updateEventsIfAuthed } = useGoogleCalendar();

const toggleShowDeclined = () => {
  showDeclinedEvent.value = !showDeclinedEvent.value;
  updateEventsIfAuthed();
};
</script>
