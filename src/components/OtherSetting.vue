<template>
  <q-popup-proxy anchor="bottom right" self="top right" :offset="[0, 4]">
      <q-card>
        <q-card-section>
          <div class="text-h6">Setting</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input filled v-model="teamName" label="TeamName">
          </q-input>
        </q-card-section>
      </q-card>
    </q-popup-proxy>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useSettingsStore } from 'src/stores/settings-store';

const {
  teamName,
} = storeToRefs(useSettingsStore());
</script>
