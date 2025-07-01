// src/users/dto/create-user.dto.ts
import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'ashketchum' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'pikachu123' })
  @IsString()
  @MinLength(6)
  password: string;
}
