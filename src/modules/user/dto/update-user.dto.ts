import { IsString } from 'class-validator';

export class UpdatedUserDto {
  @IsString()
  readonly username: string;
}
