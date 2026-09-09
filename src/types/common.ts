/**
 * Small, generic helper types shared across the app.
 * Kept deliberately tiny — most domain types live in
 * api.ts / sales.ts / analytics.ts.
 */

/** A value that is either present or explicitly absent. */
export type Nullable<T> = T | null;

/** Generic "not yet loaded" | "loaded" wrapper, if ever needed by future hooks. */
export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';
