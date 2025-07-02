import { IsString, MinLength } from 'class-validator';

// DTO for creating a new user authentication
// This DTO is used to validate the input data when creating a new user
export class CreateAuthDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(6)
  password: string;
}
