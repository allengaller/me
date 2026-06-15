/**
 * Profile ↔ Hub Bridge
 *
 * Maps the flat profile.json format to the structured Hub format from packages/core.
 * This provides a migration path from the current simple format to the full Hub schema.
 */

import type { Hub } from '../../packages/core/src/types/hub.js';
import { PrivacyLevel } from '../../packages/core/src/types/base.js';

interface ProfileSocial {
  platform: string;
  url: string;
}

interface ProfileSkill {
  name?: string;
  name_zh?: string;
  level?: string;
}

interface ProfileExperience {
  title?: string;
  title_zh?: string;
  company?: string;
  period?: string;
  description?: string;
  description_zh?: string;
  achievements?: string[];
}

interface Profile {
  profile?: {
    name?: string;
    name_zh?: string;
    title?: string;
    title_zh?: string;
    location?: string;
    about?: string;
    about_zh?: string;
    avatar?: string;
    contact?: string;
  };
  social?: ProfileSocial[];
  skills?: ProfileSkill[];
  experience?: ProfileExperience[];
}

/**
 * Generate a simple unique ID
 */
function genId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Convert a flat profile.json to a partial Hub structure.
 * This is a lossy conversion — the Hub format is richer.
 */
export function profileToHub(profile: Profile): Partial<Hub> {
  const now = new Date().toISOString();

  return {
    version: '2.0.0',
    id: genId(),
    ownerId: 'local-user',
    createdAt: now,
    updatedAt: now,
    identity: {
      id: genId(),
      type: 'identity',
      createdAt: now,
      updatedAt: now,
      version: 1,
      privacy: PrivacyLevel.PUBLIC,
      tags: [],
      verified: false,
      name: { en: profile.profile?.name || '', zh: profile.profile?.name_zh || '' },
      namePreferred: profile.profile?.name || '',
      title: { en: profile.profile?.title || '', zh: profile.profile?.title_zh || '' },
      location: profile.profile?.location ? { current: profile.profile.location } : undefined,
      avatar: profile.profile?.avatar || undefined,
      contact: {
        email: profile.profile?.contact || undefined,
        urls: Object.fromEntries(
          (profile.social || []).map((s: ProfileSocial) => [s.platform.toLowerCase(), s.url])
        ),
      },
      about: { en: profile.profile?.about || '', zh: profile.profile?.about_zh || '' },
    },
    skills: (profile.skills || []).map((s: ProfileSkill) => ({
      id: genId(),
      type: 'skill' as const,
      createdAt: now,
      updatedAt: now,
      version: 1,
      privacy: PrivacyLevel.PUBLIC,
      tags: [],
      verified: false,
      category: 'programming' as const,
      name: { en: s.name || '', zh: s.name_zh || '' },
      proficiency: mapLevel(s.level),
      certifications: [],
      endorsements: [],
    })),
    experience: (profile.experience || []).map((e: ProfileExperience) => ({
      id: genId(),
      type: 'experience' as const,
      createdAt: now,
      updatedAt: now,
      version: 1,
      privacy: PrivacyLevel.PUBLIC,
      tags: [],
      verified: false,
      category: 'work' as const,
      title: { en: e.title || '', zh: e.title_zh || '' },
      organization: e.company || '',
      period: parsePeriod(e.period),
      description: { en: e.description || '', zh: e.description_zh || '' },
      achievements: (e.achievements || []).map((a: string) => ({
        type: 'manual' as const,
        source: 'profile-import',
        retrievedAt: now,
        confidence: 1,
        description: a,
      })),
    })),
    knowledge: [],
    interests: [],
    relationships: [],
    goals: [],
    resources: [],
    defaults: {
      privacy: PrivacyLevel.PUBLIC,
      defaultLocale: 'en',
    },
    meta: {
      sources: ['profile-json'],
      locale: 'en',
      schemaVersion: '2.0.0',
    },
  };
}

/**
 * Convert Hub back to the flat profile.json format for backward compatibility.
 */
export function hubToProfile(hub: Hub): Record<string, unknown> {
  return {
    profile: {
      name: hub.identity.namePreferred || hub.identity.name?.en || '',
      name_zh: hub.identity.name?.zh || '',
      title: hub.identity.title?.en || '',
      title_zh: hub.identity.title?.zh || '',
      location: hub.identity.location?.current || '',
      about: hub.identity.about?.en || '',
      about_zh: hub.identity.about?.zh || '',
      avatar: hub.identity.avatar || '',
      contact: hub.identity.contact?.email || '',
    },
    social: Object.entries(hub.identity.contact?.urls || {}).map(([platform, url]) => ({
      platform: platform.charAt(0).toUpperCase() + platform.slice(1),
      url,
      icon: '',
    })),
    skills: hub.skills.map((s) => ({
      name: s.name?.en || '',
      name_zh: s.name?.zh || '',
      level: unmapLevel(s.proficiency),
      level_zh: '',
      technologies: [],
    })),
    experience: hub.experience.map((e) => ({
      title: e.title?.en || '',
      title_zh: e.title?.zh || '',
      company: e.organization || '',
      company_zh: '',
      period: e.period.current
        ? `${e.period.start} - Present`
        : `${e.period.start} - ${e.period.end || ''}`,
      description: e.description?.en || '',
      description_zh: e.description?.zh || '',
      achievements: e.achievements.map((a) => a.description),
      achievements_zh: [],
    })),
    projects: [],
  };
}

// --- Helpers ---

function mapLevel(level: string | undefined): 1 | 2 | 3 | 4 | 5 {
  const map: Record<string, 1 | 2 | 3 | 4 | 5> = {
    beginner: 1,
    novice: 1,
    intermediate: 2,
    advanced: 4,
    expert: 5,
  };
  return map[level?.toLowerCase()] || 3;
}

function unmapLevel(level: number): string {
  const map: Record<number, string> = {
    1: 'Beginner',
    2: 'Intermediate',
    3: 'Intermediate',
    4: 'Advanced',
    5: 'Expert',
  };
  return map[level] || 'Intermediate';
}

function parsePeriod(period: string): { start: string; end?: string; current: boolean } {
  if (!period) return { start: '', current: false };
  const parts = period.split(/\s*[-–]\s*/);
  const start = parts[0]?.trim() || '';
  const end = parts[1]?.trim();
  const current = !end || end.toLowerCase() === 'present';
  return { start, end: current ? undefined : end, current };
}
