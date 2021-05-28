import { Exclude, Expose, Type } from 'class-transformer';
import { IsEmail, IsNumber, IsString } from 'class-validator';
import { ReadRoleDto } from '../../role/dtos';
import { ReadUserDetailsDto } from './read-user-details.dto';

@Exclude()
export class ReadUserDto {
  @Expose()
  @IsNumber()
  readonly id: number;

  @Expose()
  @IsEmail()
  readonly email: string;

  @Expose()
  @IsString()
  readonly username: string;

  @Expose()
  @Type(() => ReadUserDetailsDto)
  readonly details: ReadUserDetailsDto;

  @Expose()
  @Type(() => ReadRoleDto)
  readonly roles: ReadRoleDto[];
}
