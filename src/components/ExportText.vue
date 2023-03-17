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
import { groupBy, sortBy } from 'lodash';
import { DateTime, Interval } from 'luxon';
import {
  QPageSticky, QBtn, QPopupProxy, QEditor,
} from 'quasar';
import { useCalendar } from 'src/composables/useCalendar';
import { useGoogleSheets } from 'src/composables/useGoogleSheets';
import { useTimeCalculator } from 'src/composables/useTimeCalculator';

const editor = ref<QEditor>();

const { selectedEvents } = useCalendar();
const { devHours, workHours } = useTimeCalculator();
const { sendData } = useGoogleSheets();

const model = ref('');

const beforeShow = () => {
  const sorted = sortBy(selectedEvents.value, (x) => x.startStr);
  const groupedEvents = groupBy(sorted, (x) => DateTime.fromISO(x.startStr).toFormat('MM/dd EEE'));
  model.value = `Hours: <b>${devHours.value}</b> / ${workHours.value}
  <ul>
    ${Object.keys(groupedEvents).map((key) => `
    <li>
      ${key}
      <ul>
        ${groupedEvents[key].map((e) => `
        <li>
          [${Interval.fromDateTimes(DateTime.fromISO(e.startStr), DateTime.fromISO(e.endStr)).toDuration('hours').hours}] ${e.title}
        </li>`).join('')}
      </ul>
    </li>`).join('')}
  </ul>`;
};

const copyAll = () => {
  editor.value?.runCmd('selectAll');
  editor.value?.runCmd('copy');
};
const sendToGoogleSheet = () => {
  sendData();
};

</script>
