import { Identity, Personality, Skill, Knowledge, Interest, Experience, Relationship, HealthLifestyle, Goal, Resource } from './dimensions.js';
import { PrivacyLevel, Locale } from './base.js';

/**
 * Hub metadata
 */
export interface HubMeta {
  sources: string[];            // Importer IDs used
  lastImport?: string;
  locale: Locale;
  schemaVersion: string;
}

/**
 * Hub defaults
 */
export interface HubDefaults {
  privacy: PrivacyLevel;
  defaultLocale: Locale;
}

/**
 * Hub - the unified data container for a person's identity hub
 */
export interface Hub {
  version: string;                // Schema version
  id: string;                     // Unique hub instance ID
  ownerId: string;
  createdAt: string;
  updatedAt: string;

  identity: Identity;
  personality?: Personality;
  skills: Skill[];
  knowledge: Knowledge[];
  interests: Interest[];
  experience: Experience[];
  relationships: Relationship[];
  healthLifestyle?: HealthLifestyle;
  goals: Goal[];
  resources: Resource[];

  // Privacy settings
  defaults: HubDefaults;

  // Metadata
  meta: HubMeta;
}

/**
 * Create an empty hub with defaults
 */
export function createEmptyHub(ownerId: string = 'local-user'): Hub {
  const now = new Date().toISOString();

  return {
    version: '2.0.0',
    id: generateId(),
    ownerId,
    createdAt: now,
    updatedAt: now,
    identity: createEmptyIdentity(),
    skills: [],
    knowledge: [],
    interests: [],
    experience: [],
    relationships: [],
    goals: [],
    resources: [],
    defaults: {
      privacy: PrivacyLevel.INTERNAL,
      defaultLocale: 'en'
    },
    meta: {
      sources: [],
      locale: 'en',
      schemaVersion: '2.0.0'
    }
  };
}

/**
 * Create an empty identity
 */
function createEmptyIdentity(): Identity {
  const now = new Date().toISOString();

  return {
    id: generateId(),
    type: 'identity',
    createdAt: now,
    updatedAt: now,
    version: 1,
    privacy: PrivacyLevel.INTERNAL,
    tags: [],
    verified: false,
    name: { en: '' },
    namePreferred: '',
    title: { en: '' },
    contact: {
      urls: {}
    }
  };
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`;
}
