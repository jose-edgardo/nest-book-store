import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdatedUserDto {
  @ApiProperty()
  @IsString()
  readonly username: string;
}
