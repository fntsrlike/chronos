<template>
  <q-page-sticky position="bottom-right" :offset="[16, 16]" class="z-top">
    <q-btn fab icon="edit_note" color="accent">
      <q-popup-proxy :offset="[0, 8]" @before-show="beforeShow">
        <q-editor
          ref="editor"
          :style="{
            width: '600px',
            maxWidth: '90vw',
          }"
          max-height="50vh"
          v-model="model"
          dense
          autofocus
          :definitions="{
            copy: {
              tip: 'Copy All',
              icon: 'copy_all',
              label: 'Copy All',
              handler: copyAll
            },
            send: {
              tip: 'Send to sheets',
              icon: 'send',
              label: 'send',
              handler: sendToGoogleSheet
            }
          }"
          :toolbar="[['undo', 'redo'], ['bold', 'italic', 'strike', 'underline', 'link'], ['unordered', 'ordered', 'outdent', 'indent'], ['copy', 'send']]"
        />
      </q-popup-proxy>
    </q-btn>
  </q-page-sticky>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import {
  QPageSticky, QBtn, QPopupProxy, QEditor,
} from 'quasar';
import { useGoogleSheets } from 'src/composables/useGoogleSheets';
import { useReportGenerator } from 'src/composables/useReportGenerator';

const editor = ref<QEditor>();
const copyAll = () => {
  editor.value?.runCmd('selectAll');
  editor.value?.runCmd('copy');
};

const { exportTextElements } = useReportGenerator();
const model = ref('');
const beforeShow = () => {
  model.value = exportTextElements().innerHTML;
};

const { sendData } = useGoogleSheets();
const sendToGoogleSheet = () => {
  sendData();
};

</script>
