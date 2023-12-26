<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :persistent="!isAuthenticated"
  >
    <q-stepper
      v-model="step"
      vertical
      animated
      :header-nav="isAuthenticated"
      active-icon="none"
      class="relative-position"
      style="min-width: 520px;"
    >
      <q-step
        :name="1"
        title="Sign In"
        icon="account_circle"
        :done="isAuthenticated"
      >

        <p v-if="isAuthenticated">Already signed in.</p>
        <p v-else>Sign in to the Google Calendar account to load events from.</p>
        <q-stepper-navigation v-if="!isAuthenticated" class="q-gutter-sm">
          <q-btn @click="signIn" color="primary" icon="login" label="Sign In" />
        </q-stepper-navigation>
      </q-step>
      <q-step
        :name="2"
        title="Date Range"
        icon="date_range"
        :done="isAuthenticated"
      >
        <p>Select your sprint days.</p>
        <DateSettings/>
        <q-stepper-navigation class="q-gutter-sm">
          <q-btn @click="step = 3" color="primary" icon="check" label="Continue" />
        </q-stepper-navigation>
      </q-step>
      <q-step
        :name="3"
        title="Working Hour Range"
        icon="access_time"
        :done="isAuthenticated"
      >
        <p>Select your working hours</p>
        <WorkingHourSettings/>
        <q-stepper-navigation class="q-gutter-sm">
          <q-btn @click="step = 4" color="primary" icon="check" label="Continue" />
        </q-stepper-navigation>
      </q-step>
      <q-step
        :name="4"
        title="Account"
        icon="account_circle"
        :done="isAuthenticated"
      >
        <q-stepper-navigation class="q-gutter-sm">
          <q-btn @click="emit('update:modelValue', false)" color="primary" icon="check" label="Done" />
          <q-btn @click="signIn" :flat="isAuthenticated" color="primary" icon="login" :label="isAuthenticated ? 'Change Account' : 'Sign In'" />
          <q-btn v-if="isAuthenticated" @click="signOut" flat color="primary" icon="logout" label="Sign Out" />
        </q-stepper-navigation>
      </q-step>
      <q-inner-loading
        :showing="isLoading"
        label="Loading..."
        color="primary"
      />
    </q-stepper>
  </q-dialog>
</template>

<script setup lang="ts">
import { QStepper } from 'quasar';
import { useGoogle } from 'src/composables/useGoogle';
import { useGoogleCalendar } from 'src/composables/useGoogleCalendar';
import { ref, watch, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { useSettingsStore } from 'src/stores/settings-store';
import DateSettings from 'src/components/DateSettings.vue';
import WorkingHourSettings from './WorkingHourSettings.vue';

defineProps<{modelValue:boolean}>();
const emit = defineEmits<{(event: 'update:modelValue', value: boolean): void }>();

const step = ref(1);

const {
  isLoading, isAuthenticated, signIn: _signIn, signOut,
} = useGoogle();
const {
  updateEvents,
} = useGoogleCalendar();

watchEffect(() => {
  if (isAuthenticated.value) {
    step.value = 4;
  } else {
    step.value = 1;
  }
});

watchEffect(() => {
  if (step.value === 2) {
    updateEvents();
  }
});

const { days } = storeToRefs(useSettingsStore());
watch(days, () => {
  updateEvents();
});

const signIn = async () => {
  await _signIn();
  step.value = 2;
};
</script>
