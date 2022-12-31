import { DatabaseService } from '@src/services';
import type { ServerTimestamp } from '@src/types';

export interface UserClaim {
  admin: boolean;
  manager: boolean;
  staff: boolean;
  updated_at: ServerTimestamp;
}

export const UserClaimModel = new DatabaseService<UserClaim>('user-claims');
