import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, MaxLength } from 'class-validator';

export class UpdateUserActionDTO {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsEmail()
  @MaxLength(100)
  email?: string;
}
