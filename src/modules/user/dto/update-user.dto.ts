import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsNumber()
  id: number;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsOptional()
  refreshToken;
}
