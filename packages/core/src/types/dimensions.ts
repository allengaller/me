import { BaseEntity, Localized, ProficiencyLevel, Evidence, SkillCategory, InterestCategory, ExperienceCategory, GoalCategory, GoalStatus, ResourceCategory, Achievement, PrivacyLevel } from './base.js';

// ============================================
// IDENTITY DIMENSION
// ============================================
export interface Identity extends BaseEntity {
  type: 'identity';
  name: Localized<string>;
  namePreferred: string;           // Primary name for display
  title: Localized<string>;
  pronouns?: string;
  location?: {
    current: string;
    timezone?: string;
    coordinates?: { lat: number; lng: number };
  };
  avatar?: string;
  contact: {
    email?: string;
    phone?: string;
    urls: Record<string, string>;  // platform -> url
  };
  demographics?: {
    language: string[];
    nationality?: string;
  };
  about?: Localized<string>;
}

// ============================================
// PERSONALITY DIMENSION
// ============================================
export interface Personality extends BaseEntity {
  type: 'personality';
  traits: PersonalityTrait[];
  values: Value[];
  workingStyle: WorkingStyle;
  communication: CommunicationStyle;
}

export interface PersonalityTrait extends Evidence {
  name: string;                   // e.g., "Openness", "Conscientiousness"
  category?: string;              // e.g., "Big Five"
  score: number;                  // 0-100
  description?: Localized<string>;
}

export interface Value extends Evidence {
  name: string;
  weight: number;                 // 0-100
}

export interface WorkingStyle extends Evidence {
  environment: ('remote' | 'hybrid' | 'onsite')[];
  hours: ('flexible' | 'fixed' | 'freelance')[];
  collaboration: ('team' | 'independent' | 'lead')[];
  decisionMaking: ('data-driven' | 'intuitive' | 'consensus')[];
}

export interface CommunicationStyle extends Evidence {
  written: ('formal' | 'casual' | 'technical')[];
  verbal: ('direct' | 'diplomatic' | 'storytelling')[];
  languages: Array<{
    code: string;
    proficiency: ProficiencyLevel;
  }>;
}

// ============================================
// SKILLS DIMENSION
// ============================================
export interface Skill extends BaseEntity {
  type: 'skill';
  category: SkillCategory;
  name: Localized<string>;
  proficiency: ProficiencyLevel;
  yearsOfExperience?: number;
  lastUsed?: string;              // ISO date
  certifications: Certification[];
  endorsements: Endorsement[];
}

export interface Certification extends Evidence {
  name: string;
  issuer: string;
  issuedAt: string;
  expiresAt?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface Endorsement extends Evidence {
  endorserId: string;
  endorserName: string;
  comment?: string;
  createdAt: string;
}

// ============================================
// KNOWLEDGE DIMENSION
// ============================================
export interface Knowledge extends BaseEntity {
  type: 'knowledge';
  domain: string;                 // e.g., "Machine Learning", "Financial Markets"
  name: Localized<string>;
  level: ProficiencyLevel;
  education: Education[];
  courses: Course[];
  reading: Reading[];
}

export interface Education extends Evidence {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  achievements?: string[];
}

export interface Course extends Evidence {
  platform: string;              // e.g., "Coursera", "Udemy"
  name: string;
  instructor?: string;
  completedAt?: string;
  certificateUrl?: string;
}

export interface Reading {
  type: 'book' | 'article' | 'paper' | 'blog';
  source: string;
  retrievedAt: string;
  confidence: number;
  title: string;
  author: string;
  date?: string;
  keyTakeaways?: string[];
}

// ============================================
// INTERESTS DIMENSION
// ============================================
export interface Interest extends BaseEntity {
  type: 'interest';
  name: Localized<string>;
  category: InterestCategory;
  level: 'casual' | 'active' | 'deep-dive';
  relatedSkills: string[];        // Skill IDs
}

// ============================================
// EXPERIENCE DIMENSION
// ============================================
export interface Experience extends BaseEntity {
  type: 'experience';
  category: ExperienceCategory;
  title: Localized<string>;
  organization: string;
  location?: string;
  period: {
    start: string;
    end?: string;               // null = present
    current: boolean;
  };
  description: Localized<string>;
  achievements: Achievement[];
  technologies?: string[];        // Skill IDs
}

// ============================================
// RELATIONSHIPS DIMENSION
// ============================================
export interface Relationship extends BaseEntity {
  type: 'relationship';
  targetId: string;              // ID of related person/entity
  targetName: string;
  relationshipType: string;       // e.g., "colleague", "mentor", "partner"
  context: string;               // e.g., "Work", "Community"
  mutual: boolean;
  strength: number;              // 0-100
  contactInfo?: {
    email?: string;
    url?: string;
  };
}

// ============================================
// HEALTH/LIFESTYLE DIMENSION
// ============================================
export interface HealthLifestyle extends BaseEntity {
  type: 'health';
  physical: {
    activityLevel: 'sedentary' | 'moderate' | 'active' | 'athlete';
    exerciseTypes?: string[];
    dietaryRestrictions?: string[];
  };
  mental: {
    practices: string[];         // e.g., "meditation", "journaling"
    boundaries: string[];          // e.g., "no-meetings-friday"
  };
  lifestyle: {
    schedule: 'regular' | 'flexible' | 'unpredictable';
    sleepPattern?: string;
    hobbies: string[];
  };
}

// ============================================
// GOALS DIMENSION
// ============================================
export interface Goal extends BaseEntity {
  type: 'goal';
  name: Localized<string>;
  description: Localized<string>;
  category: GoalCategory;
  status: GoalStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  targetDate?: string;
  milestones: Milestone[];
  progress: number;              // 0-100
}

export interface Milestone {
  id: string;
  name: string;
  completedAt?: string;
  targetDate?: string;
}

// ============================================
// RESOURCES DIMENSION
// ============================================
export interface Resource extends BaseEntity {
  type: 'resource';
  name: Localized<string>;
  category: ResourceCategory;
  url?: string;
  localPath?: string;
  description?: Localized<string>;
  accessLevel: PrivacyLevel;
  tags: string[];
}

// ============================================
// UNION TYPE
// ============================================
export type Dimension =
  | Identity
  | Personality
  | Skill
  | Knowledge
  | Interest
  | Experience
  | Relationship
  | HealthLifestyle
  | Goal
  | Resource;
