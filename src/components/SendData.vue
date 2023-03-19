<template>
  <q-popup-proxy anchor="bottom right" self="top right" :offset="[0, 4]">
      <q-card>
        <q-card-section>
          <div class="text-h6">Send data</div>
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
import { useGoogleSheets } from 'src/composables/useGoogleSheets';

const { sendData } = useGoogleSheets();
</script>
