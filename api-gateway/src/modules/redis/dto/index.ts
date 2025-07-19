import { IsNumber, IsString } from 'class-validator';

export class SaveUserSessionRequestDTO {
  @IsString()
  jwtToken: string;

  @IsNumber()
  userId: number;
}

export class SaveUserSessionResponseDTO {
  @IsString()
  message: string;

  @IsNumber()
  status: number;
}

export class GetUserSessionRequestDTO {
  @IsString()
  jwtToken: string;
}

export class GetUserSessionResponseDTO {
  @IsString()
  jwtToken: string;

  @IsNumber()
  userId: number;
}

export class DeleteUserSessionRequestDTO {
  @IsNumber()
  userId: number;
}

export class DeleteUserSessionResponseDTO {
  @IsString()
  message: string;

  @IsNumber()
  status: number;
}
