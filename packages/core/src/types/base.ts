/**
 * Privacy levels for individual entries
 */
export enum PrivacyLevel {
  PUBLIC = 'public',       // Visible to all
  INTERNAL = 'internal',   // Visible to authenticated users
  PRIVATE = 'private',     // Only visible to owner
  ENCRYPTED = 'encrypted'  // Encrypted at rest
}

/**
 * Confidence/proficiency levels for skills
 */
export enum ProficiencyLevel {
  NOVICE = 1,
  BEGINNER = 2,
  INTERMEDIATE = 3,
  ADVANCED = 4,
  EXPERT = 5
}

/**
 * Supported locales
 */
export type Locale = 'en' | 'zh' | string;

/**
 * Localized content wrapper
 */
export interface Localized<T> {
  en: T;
  zh?: T;
  [locale: string]: T | undefined;
}

/**
 * Evidence/source attribution
 */
export interface Evidence {
  type: 'url' | 'file' | 'api' | 'manual' | 'inference';
  source: string;
  retrievedAt: string;
  confidence: number;      // 0-1
  metadata?: Record<string, unknown>;
}

/**
 * Time-versioned entry with audit trail
 */
export interface VersionedEntry {
  id: string;
  createdAt: string;      // ISO 8601
  updatedAt: string;      // ISO 8601
  version: number;
}

/**
 * Base entity with privacy and versioning
 */
export interface BaseEntity extends VersionedEntry {
  privacy: PrivacyLevel;
  tags: string[];
  notes?: string;
  source?: string;         // Which importer created this
  verified: boolean;
  evidence?: Evidence[];
}

/**
 * Achievement with evidence
 */
export interface Achievement extends Evidence {
  description: string;
  impact?: string;         // quantifiable if possible
  metrics?: Record<string, number>;
}

/**
 * Supported dimension types
 */
export type DimensionType =
  | 'identity'
  | 'personality'
  | 'skills'
  | 'knowledge'
  | 'interests'
  | 'experience'
  | 'relationships'
  | 'health'
  | 'goals'
  | 'resources';

/**
 * Skill categories
 */
export type SkillCategory =
  | 'programming'
  | 'frameworks'
  | 'databases'
  | 'devops'
  | 'design'
  | 'management'
  | 'consulting'
  | 'domain'
  | 'language'
  | 'soft-skills';

/**
 * Interest categories
 */
export type InterestCategory =
  | 'technology'
  | 'science'
  | 'arts'
  | 'sports'
  | 'travel'
  | 'food'
  | 'gaming'
  | 'reading'
  | 'music'
  | 'hobbies'
  | 'causes'
  | 'other';

/**
 * Experience categories
 */
export type ExperienceCategory = 'work' | 'project' | 'volunteer' | 'military';

/**
 * Goal categories
 */
export type GoalCategory = 'career' | 'health' | 'learning' | 'financial' | 'personal' | 'other';

/**
 * Goal statuses
 */
export type GoalStatus = 'draft' | 'active' | 'completed' | 'abandoned';

/**
 * Resource categories
 */
export type ResourceCategory =
  | 'document'
  | 'code'
  | 'tool'
  | 'template'
  | 'bookmark'
  | 'credential'
  | 'asset';
