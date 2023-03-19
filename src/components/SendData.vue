<template>
  <q-popup-proxy anchor="bottom right" self="top right" :offset="[0, 4]">
      <q-card>
        <q-card-section>
          <div class="text-h6">Send data</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input outlined v-model="teamName" label="TeamName">
          </q-input>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-btn-toggle
            v-model="isForecast"
            flat
            toggle-color="primary"
            :options="[
              {value: true, slot: 'one'},
              {value: false, slot: 'two'},
            ]"
          >
            <template v-slot:one>
              <div class="row items-center no-wrap">
                <q-icon name="hourglass_top" />
                <div class="text-center">
                  Forecast
                </div>
              </div>
            </template>
            <template v-slot:two>
              <div class="row items-center no-wrap">
                <q-icon name="hourglass_bottom" />
                <div class="text-center">
                  Actual
                </div>
              </div>
            </template>
          </q-btn-toggle>
        </q-card-section>

        <q-card-section>
          <q-btn color="primary" label="Send Data"
          icon="send"
          @click="sendData"/>
        </q-card-section>
      </q-card>
    </q-popup-proxy>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useGoogleSheets } from 'src/composables/useGoogleSheets';
import { useSettingsStore } from 'src/stores/settings-store';

const { teamName, isForecast } = storeToRefs(useSettingsStore());
const { sendData } = useGoogleSheets();
</script>
