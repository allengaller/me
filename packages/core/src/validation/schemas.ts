import { z } from 'zod';
import { PrivacyLevel, ProficiencyLevel, type SkillCategory, type InterestCategory, type ExperienceCategory, type GoalCategory, type ResourceCategory } from '../types/base.js';
import type { Hub } from '../types/hub.js';

// ============================================
// BASE SCHEMAS
// ============================================

export const localizedStringSchema = z.object({
  en: z.string(),
  zh: z.string().optional()
}) as z.ZodType<{ en: string; zh?: string }>;

export const evidenceSchema = z.object({
  type: z.enum(['url', 'file', 'api', 'manual', 'inference']),
  source: z.string(),
  retrievedAt: z.string(),
  confidence: z.number().min(0).max(1),
  metadata: z.record(z.unknown()).optional()
});

export const baseEntitySchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  version: z.number().int().positive(),
  privacy: z.nativeEnum(PrivacyLevel),
  tags: z.array(z.string()),
  notes: z.string().optional(),
  source: z.string().optional(),
  verified: z.boolean(),
  evidence: z.array(evidenceSchema).optional()
});

// ============================================
// IDENTITY SCHEMA
// ============================================

export const identitySchema = baseEntitySchema.extend({
  type: z.literal('identity'),
  name: localizedStringSchema,
  namePreferred: z.string(),
  title: localizedStringSchema,
  pronouns: z.string().optional(),
  location: z.object({
    current: z.string(),
    timezone: z.string().optional(),
    coordinates: z.object({ lat: z.number(), lng: z.number() }).optional()
  }).optional(),
  avatar: z.string().url().optional(),
  contact: z.object({
    email: z.string().email().optional(),
    phone: z.string().optional(),
    urls: z.record(z.string())
  }),
  demographics: z.object({
    language: z.array(z.string()),
    nationality: z.string().optional()
  }).optional(),
  about: localizedStringSchema.optional()
});

// ============================================
// SKILLS SCHEMA
// ============================================

export const certificationSchema = evidenceSchema.extend({
  name: z.string(),
  issuer: z.string(),
  issuedAt: z.string(),
  expiresAt: z.string().optional(),
  credentialId: z.string().optional(),
  credentialUrl: z.string().optional()
});

export const endorsementSchema = evidenceSchema.extend({
  endorserId: z.string(),
  endorserName: z.string(),
  comment: z.string().optional(),
  createdAt: z.string()
});

export const skillSchema = baseEntitySchema.extend({
  type: z.literal('skill'),
  category: z.string() as z.ZodType<SkillCategory>,
  name: localizedStringSchema,
  proficiency: z.nativeEnum(ProficiencyLevel),
  yearsOfExperience: z.number().optional(),
  lastUsed: z.string().optional(),
  certifications: z.array(certificationSchema),
  endorsements: z.array(endorsementSchema)
});

// ============================================
// EXPERIENCE SCHEMA
// ============================================

export const achievementSchema = evidenceSchema.extend({
  description: z.string(),
  impact: z.string().optional(),
  metrics: z.record(z.number()).optional()
});

export const experienceSchema = baseEntitySchema.extend({
  type: z.literal('experience'),
  category: z.string() as z.ZodType<ExperienceCategory>,
  title: localizedStringSchema,
  organization: z.string(),
  location: z.string().optional(),
  period: z.object({
    start: z.string(),
    end: z.string().optional(),
    current: z.boolean()
  }),
  description: localizedStringSchema,
  achievements: z.array(achievementSchema),
  technologies: z.array(z.string()).optional()
});

// ============================================
// HUB SCHEMA
// ============================================

export const hubSchema = z.object({
  version: z.string(),
  id: z.string(),
  ownerId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  identity: identitySchema,
  personality: z.any().optional(),
  skills: z.array(skillSchema),
  knowledge: z.array(z.any()),
  interests: z.array(z.any()),
  experience: z.array(experienceSchema),
  relationships: z.array(z.any()),
  healthLifestyle: z.any().optional(),
  goals: z.array(z.any()),
  resources: z.array(z.any()),
  defaults: z.object({
    privacy: z.nativeEnum(PrivacyLevel),
    defaultLocale: z.string()
  }),
  meta: z.object({
    sources: z.array(z.string()),
    lastImport: z.string().optional(),
    locale: z.string(),
    schemaVersion: z.string()
  })
});

/**
 * Validate a hub object
 */
export function validateHub(data: unknown): { success: true; data: Hub } | { success: false; errors: string[] } {
  try {
    const result = hubSchema.parse(data);
    return { success: true, data: result as Hub };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.errors.map(e => `${e.path.join('.')}: ${e.message}`) };
    }
    return { success: false, errors: ['Unknown validation error'] };
  }
}

/**
 * Validate a dimension entity
 */
export function validateDimension(dimension: unknown): boolean {
  // Simplified validation - could expand to full schema validation
  return dimension !== null && typeof dimension === 'object' && 'type' in dimension;
}
