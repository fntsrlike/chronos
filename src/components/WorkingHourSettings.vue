<template>
  <q-popup-proxy anchor="bottom right" self="top right" :offset="[0, 4]">
      <q-card>
        <q-card-section>
          <div class="text-h6">Work Hours</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="text-h7">Morning</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input filled v-model="morningBeginTime" mask="time" label="Begin Time" :rules="['time']">
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-time v-model="morningBeginTime">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input filled v-model="morningEndTime" mask="time" label="Morning End Time" :rules="['time']">
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-time v-model="morningEndTime">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="text-h7">Afternoon</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input filled v-model="afternoonBeginTime" mask="time" label="Begin Time" :rules="['time']">
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-time v-model="afternoonBeginTime">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input filled v-model="afternoonEndTime" mask="time" label="End Time" :rules="['time']">
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-time v-model="afternoonEndTime">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-card-section>
      </q-card>
    </q-popup-proxy>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useSettingsStore } from 'src/stores/settings-store';

const {
  morningBeginTime,
  morningEndTime,
  afternoonBeginTime,
  afternoonEndTime,
} = storeToRefs(useSettingsStore());
</script>
