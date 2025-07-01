// src/users/dto/login_user.dto.ts
import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ example: 'ashketchum' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'pikachu123' })
  @IsString()
  @MinLength(6)
  password: string;
}
