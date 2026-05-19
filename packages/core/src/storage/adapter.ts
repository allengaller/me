import { Hub } from '../types/hub.js';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

/**
 * Storage adapter interface
 */
export interface StorageAdapter {
  /**
   * Read the hub data
   */
  read(): Promise<Hub | null>;

  /**
   * Write the hub data
   */
  write(hub: Hub): Promise<void>;

  /**
   * Read a specific version from history
   */
  readVersion(versionId: string): Promise<Hub | null>;

  /**
   * List all available versions
   */
  listVersions(): Promise<VersionInfo[]>;

  /**
   * Delete the hub
   */
  delete(): Promise<void>;
}

/**
 * Version info for history
 */
export interface VersionInfo {
  id: string;
  timestamp: string;
  size: number;
  checksum: string;
}

/**
 * Get the default hub directory path
 */
export function getHubDir(): string {
  const home = process.env.HOME || process.env.USERPROFILE || '.';
  return join(home, '.me');
}

/**
 * Get the data directory path
 */
export function getDataDir(): string {
  return join(getHubDir(), 'data');
}

/**
 * Get the history directory path
 */
export function getHistoryDir(): string {
  return join(getDataDir(), 'hub.history');
}

/**
 * Get the main hub file path
 */
export function getHubPath(): string {
  return join(getDataDir(), 'hub.json');
}

/**
 * JSON file storage adapter
 */
export class JsonStorageAdapter implements StorageAdapter {
  private hubPath: string;
  private historyDir: string;

  constructor(customPath?: string) {
    this.hubPath = customPath || getHubPath();
    this.historyDir = getHistoryDir();
  }

  /**
   * Ensure directories exist
   */
  private ensureDirs(): void {
    const dataDir = dirname(this.hubPath);
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true });
    }
    if (!existsSync(this.historyDir)) {
      mkdirSync(this.historyDir, { recursive: true });
    }
  }

  /**
   * Read the hub from file
   */
  async read(): Promise<Hub | null> {
    if (!existsSync(this.hubPath)) {
      return null;
    }

    try {
      const content = readFileSync(this.hubPath, 'utf-8');
      return JSON.parse(content) as Hub;
    } catch (error) {
      console.error(`Failed to read hub from ${this.hubPath}:`, error);
      return null;
    }
  }

  /**
   * Write the hub to file and create a version snapshot
   */
  async write(hub: Hub): Promise<void> {
    this.ensureDirs();

    // Update timestamp
    hub.updatedAt = new Date().toISOString();

    // Write main file
    const content = JSON.stringify(hub, null, 2);
    writeFileSync(this.hubPath, content, 'utf-8');

    // Create version snapshot
    await this.createVersionSnapshot(hub);
  }

  /**
   * Create a version snapshot in history
   */
  private async createVersionSnapshot(hub: Hub): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const versionFile = join(this.historyDir, `${timestamp}.json`);

    const snapshot = {
      ...hub,
      _snapshotAt: timestamp
    };

    writeFileSync(versionFile, JSON.stringify(snapshot, null, 2), 'utf-8');

    // Keep only last 50 versions
    const versions = await this.listVersions();
    if (versions.length > 50) {
      const toDelete = versions.slice(0, versions.length - 50);
      for (const v of toDelete) {
        const filePath = join(this.historyDir, `${v.id}.json`);
        if (existsSync(filePath)) {
          unlinkSync(filePath);
        }
      }
    }
  }

  /**
   * Read a specific version from history
   */
  async readVersion(versionId: string): Promise<Hub | null> {
    const versionPath = join(this.historyDir, `${versionId}.json`);

    if (!existsSync(versionPath)) {
      return null;
    }

    try {
      const content = readFileSync(versionPath, 'utf-8');
      const data = JSON.parse(content);
      // Remove snapshot metadata
      delete data._snapshotAt;
      return data as Hub;
    } catch (error) {
      console.error(`Failed to read version ${versionId}:`, error);
      return null;
    }
  }

  /**
   * List all available versions
   */
  async listVersions(): Promise<VersionInfo[]> {
    if (!existsSync(this.historyDir)) {
      return [];
    }

    const files = readdirSync(this.historyDir)
      .filter(f => f.endsWith('.json'))
      .sort()
      .reverse();

    return files.map(filename => {
      const filePath = join(this.historyDir, filename);
      const content = readFileSync(filePath, 'utf-8');
      const size = Buffer.byteLength(content, 'utf-8');

      return {
        id: filename.replace('.json', ''),
        timestamp: filename.replace('.json', '').replace(/-/g, ':').replace('T', ' '),
        size,
        checksum: simpleChecksum(content)
      };
    });
  }

  /**
   * Delete the hub
   */
  async delete(): Promise<void> {
    if (existsSync(this.hubPath)) {
      unlinkSync(this.hubPath);
    }
  }
}

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
