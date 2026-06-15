import { Hub } from '../types/hub.js';
import { StorageAdapter, VersionInfo } from './adapter.js';

const HUB_KEY = 'me:hub';
const VERSION_PREFIX = 'me:hub:version:';
const VERSION_INDEX_KEY = 'me:hub:versions';

/**
 * Simple checksum for version identification
 */
function simpleChecksum(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

/**
 * Browser localStorage-based storage adapter.
 * Implements the same StorageAdapter interface as JsonStorageAdapter
 * but uses window.localStorage instead of the Node.js fs module.
 */
export class LocalStorageAdapter implements StorageAdapter {
  private prefix: string;

  constructor(prefix: string = '') {
    this.prefix = prefix ? `${prefix}:` : '';
  }

  private get hubKey(): string {
    return `${this.prefix}${HUB_KEY}`;
  }

  private get versionIndexKey(): string {
    return `${this.prefix}${VERSION_INDEX_KEY}`;
  }

  private get versionPrefix(): string {
    return `${this.prefix}${VERSION_PREFIX}`;
  }

  private getStorage(): Storage {
    if (typeof globalThis !== 'undefined' && 'localStorage' in globalThis) {
      return (globalThis as { localStorage: Storage }).localStorage;
    }
    throw new Error('LocalStorageAdapter requires a browser environment with localStorage');
  }

  /**
   * Read the hub from localStorage
   */
  async read(): Promise<Hub | null> {
    try {
      const storage = this.getStorage();
      const content = storage.getItem(this.hubKey);
      if (content === null) {
        return null;
      }
      return JSON.parse(content) as Hub;
    } catch (error) {
      console.error('Failed to read hub from localStorage:', error);
      return null;
    }
  }

  /**
   * Write the hub to localStorage and create a version snapshot
   */
  async write(hub: Hub): Promise<void> {
    const storage = this.getStorage();

    // Update timestamp
    hub.updatedAt = new Date().toISOString();

    // Write main data
    const content = JSON.stringify(hub);
    storage.setItem(this.hubKey, content);

    // Create version snapshot
    this.createVersionSnapshot(hub, content);
  }

  /**
   * Create a version snapshot in localStorage
   */
  private createVersionSnapshot(hub: Hub, content: string): void {
    const storage = this.getStorage();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const versionKey = `${this.versionPrefix}${timestamp}`;

    const snapshot = {
      ...hub,
      _snapshotAt: timestamp
    };

    storage.setItem(versionKey, JSON.stringify(snapshot));

    // Update version index
    const index = this.getVersionIndex();
    index.push({
      id: timestamp,
      timestamp: timestamp.replace(/-/g, ':').replace('T', ' '),
      size: content.length,
      checksum: simpleChecksum(content)
    });

    // Keep only last 50 versions
    if (index.length > 50) {
      const toDelete = index.splice(0, index.length - 50);
      for (const v of toDelete) {
        storage.removeItem(`${this.versionPrefix}${v.id}`);
      }
    }

    storage.setItem(this.versionIndexKey, JSON.stringify(index));
  }

  /**
   * Get the version index from localStorage
   */
  private getVersionIndex(): VersionInfo[] {
    try {
      const storage = this.getStorage();
      const raw = storage.getItem(this.versionIndexKey);
      if (!raw) return [];
      return JSON.parse(raw) as VersionInfo[];
    } catch {
      return [];
    }
  }

  /**
   * Read a specific version from history
   */
  async readVersion(versionId: string): Promise<Hub | null> {
    try {
      const storage = this.getStorage();
      const key = `${this.versionPrefix}${versionId}`;
      const content = storage.getItem(key);
      if (content === null) {
        return null;
      }
      const data = JSON.parse(content);
      delete data._snapshotAt;
      return data as Hub;
    } catch (error) {
      console.error(`Failed to read version ${versionId} from localStorage:`, error);
      return null;
    }
  }

  /**
   * List all available versions
   */
  async listVersions(): Promise<VersionInfo[]> {
    return this.getVersionIndex();
  }

  /**
   * Delete the hub from localStorage
   */
  async delete(): Promise<void> {
    const storage = this.getStorage();
    storage.removeItem(this.hubKey);

    // Also clean up all versions
    const index = this.getVersionIndex();
    for (const v of index) {
      storage.removeItem(`${this.versionPrefix}${v.id}`);
    }
    storage.removeItem(this.versionIndexKey);
  }
}
