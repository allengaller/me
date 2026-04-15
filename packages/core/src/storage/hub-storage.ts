import { Hub, createEmptyHub } from '../types/hub.js';
import { JsonStorageAdapter, StorageAdapter } from './adapter.js';

let defaultAdapter: StorageAdapter | null = null;

/**
 * Get the default storage adapter
 */
export function getDefaultAdapter(): StorageAdapter {
  if (!defaultAdapter) {
    defaultAdapter = new JsonStorageAdapter();
  }
  return defaultAdapter;
}

/**
 * Set a custom storage adapter
 */
export function setAdapter(adapter: StorageAdapter): void {
  defaultAdapter = adapter;
}

/**
 * Load hub from storage
 */
export async function loadHub(): Promise<Hub> {
  const adapter = getDefaultAdapter();
  const hub = await adapter.read();

  if (!hub) {
    const newHub = createEmptyHub();
    await adapter.write(newHub);
    return newHub;
  }

  return hub;
}

/**
 * Save hub to storage
 */
export async function saveHub(hub: Hub): Promise<void> {
  const adapter = getDefaultAdapter();
  await adapter.write(hub);
}

/**
 * Get hub version history
 */
export async function getHistory(): Promise<import('./adapter.js').VersionInfo[]> {
  const adapter = getDefaultAdapter();
  return adapter.listVersions();
}

/**
 * Restore hub from a specific version
 */
export async function restoreFromHistory(versionId: string): Promise<Hub | null> {
  const adapter = getDefaultAdapter();
  return adapter.readVersion(versionId);
}
