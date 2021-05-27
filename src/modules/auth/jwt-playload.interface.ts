import { RoleType } from '../../shared/roletype.enum';

export interface IJwtPayload {
  id: number;
  username: string;
  email: string;
  roles: RoleType[];
  iat?: Date;
}
