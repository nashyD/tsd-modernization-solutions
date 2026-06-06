import { useSyncExternalStore } from "react";

// Passkey capability doesn't change within a session, so there's nothing to
// subscribe to — we only need SSR-safe, hydration-stable client detection.
const subscribe = () => () => {};
const getClientSnapshot = (): boolean | null =>
  typeof window !== "undefined" && !!window.PublicKeyCredential;
const getServerSnapshot = (): boolean | null => null;

/**
 * WebAuthn / passkey support, resolved on the client without a hydration
 * mismatch or a `react-hooks/set-state-in-effect` violation.
 *
 * Returns `null` during SSR and the first hydration render (undetermined),
 * then `true` / `false` once running in the browser.
 */
export function useWebAuthnSupported(): boolean | null {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}
