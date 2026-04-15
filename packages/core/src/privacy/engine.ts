import { PrivacyLevel } from '../types/base.js';
import { Hub, Dimension } from '../types/hub.js';

/**
 * User roles for privacy checks
 */
export type UserRole = 'owner' | 'authenticated' | 'public';

/**
 * Privacy engine for filtering and access control
 */
export class PrivacyEngine {
  constructor(
    private userId: string,
    private userRole: UserRole,
    private checkOwner: (id: string) => boolean
  ) {}

  /**
   * Check if user can access a specific entry
   */
  canAccess(entry: { privacy: PrivacyLevel; ownerId?: string }): boolean {
    if (this.userRole === 'owner' || (entry.ownerId && this.checkOwner(entry.ownerId))) {
      return true;
    }

    switch (entry.privacy) {
      case PrivacyLevel.PUBLIC:
        return true;
      case PrivacyLevel.INTERNAL:
        return this.userRole === 'authenticated';
      case PrivacyLevel.PRIVATE:
      case PrivacyLevel.ENCRYPTED:
        return false;
      default:
        return false;
    }
  }

  /**
   * Filter hub to only accessible entries
   */
  filterHub(hub: Hub): Hub {
    const isOwner = hub.ownerId === this.userId || this.userRole === 'owner';

    return {
      ...hub,
      skills: hub.skills.filter(s => this.canAccess(s)),
      knowledge: hub.knowledge.filter(k => this.canAccess(k)),
      interests: hub.interests.filter(i => this.canAccess(i)),
      experience: hub.experience.filter(e => this.canAccess(e)),
      relationships: hub.relationships.filter(r => this.canAccess(r)),
      goals: hub.goals.filter(g => this.canAccess(g)),
      resources: hub.resources.filter(r => this.canAccess(r)),
      personality: hub.personality && this.canAccess(hub.personality) ? hub.personality : undefined,
      healthLifestyle: hub.healthLifestyle && this.canAccess(hub.healthLifestyle) ? hub.healthLifestyle : undefined
    };
  }

  /**
   * Filter an array of dimensions by privacy
   */
  filterDimensions<T extends Dimension>(dimensions: T[]): T[] {
    return dimensions.filter(d => this.canAccess(d));
  }

  /**
   * Check access for a single dimension
   */
  canAccessDimension(dimension: Dimension): boolean {
    return this.canAccess(dimension);
  }
}

/**
 * Check if user can access entry based on role
 */
export function checkAccess(
  entry: { privacy: PrivacyLevel },
  userRole: UserRole
): boolean {
  if (userRole === 'owner') return true;

  switch (entry.privacy) {
    case PrivacyLevel.PUBLIC:
      return true;
    case PrivacyLevel.INTERNAL:
      return userRole === 'authenticated';
    case PrivacyLevel.PRIVATE:
    case PrivacyLevel.ENCRYPTED:
      return false;
    default:
      return false;
  }
}

/**
 * Filter hub by privacy for a given role
 */
export function filterByPrivacy(hub: Hub, userRole: UserRole): Hub {
  const engine = new PrivacyEngine(hub.ownerId, userRole, () => false);
  return engine.filterHub(hub);
}
