import { configureStore } from '@reduxjs/toolkit';

/**
 * Global state configuration
 *
 * Rules respected:
 * - Does NOT change or assume a specific state shape.
 * - No side effects or backend interaction here.
 * - Exposes a factory to create a store with existing reducers.
 */

/**
 * createAppStore - factory to create the Redux store.
 * Accepts an object with:
 *  - reducer: a reducer map or root reducer (do not change existing keys/state shape)
 *  - middleware: optional middleware enhancer (receives getDefaultMiddleware)
 *  - preloadedState: optional initial state
 */
export const createAppStore = ({
  reducer = {},
  middleware = (getDefaultMiddleware) => getDefaultMiddleware(),
  preloadedState,
} = {}) =>
  configureStore({
    reducer,
    middleware,
    preloadedState,
    devTools: process.env.NODE_ENV !== 'production',
  });

/**
 * Default store (convenience). Prefer createAppStore(...) in app bootstrap to pass real reducers.
 */
const store = createAppStore();

export default store;