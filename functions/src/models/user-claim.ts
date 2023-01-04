import { DatabaseService } from '@src/services';
import type { ServerTimestamp } from '@src/types';

export interface UserClaim {
  admin: boolean;
  manager: boolean;
  staff: boolean;
  updated_at: ServerTimestamp;
}

export class UserClaimSchema extends DatabaseService<UserClaim> {}

export const UserClaimModel = new UserClaimSchema('user-claims');
