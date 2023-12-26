import { ref } from 'vue';

type SignInCallback = (() => void) | ((_gapi: typeof gapi) => Promise<void>);
type SignOutCallback = (() => void) | (() => Promise<void>);
const signInCallbacks = ref<SignInCallback[]>([]);
const signOutCallbacks = ref<SignOutCallback[]>([]);

const addSignInCallbacks = (callback: SignInCallback) => {
  signInCallbacks.value.push(callback);
};

const removeSignInCallbacks = (callback: SignInCallback) => {
  const index = signInCallbacks.value.indexOf(callback);
  if (index !== -1) {
    signInCallbacks.value.splice(index, 1);
  }
};

const runSignInCallbacks = async (_gapi: typeof gapi) => {
  await signInCallbacks.value.reduce(async (previousPromise, callback) => {
    await previousPromise;
    return callback(_gapi);
  }, Promise.resolve());
};

const addSignOutCallbacks = (callback: SignOutCallback) => {
  signOutCallbacks.value.push(callback);
};

const removeSignOutCallbacks = (callback: SignOutCallback) => {
  const index = signOutCallbacks.value.indexOf(callback);
  if (index !== -1) {
    signOutCallbacks.value.splice(index, 1);
  }
};

const runSignOutCallbacks = async () => {
  await signOutCallbacks.value.reduce(async (previousPromise, callback) => {
    await previousPromise;
    return callback();
  }, Promise.resolve());
};

export const useHooks = () => ({
  runSignInCallbacks,
  addSignInCallbacks,
  removeSignInCallbacks,
  runSignOutCallbacks,
  addSignOutCallbacks,
  removeSignOutCallbacks,
});
