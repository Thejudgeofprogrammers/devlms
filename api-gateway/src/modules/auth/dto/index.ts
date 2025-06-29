import { IsNumber, IsString } from "class-validator";

export class LoginFormDTO {
    @IsString()
    data: string;
    
    @IsString()
    password: string;
}

export class validationResponse {
    @IsString()
    type: string;
}

export class LoginUserDTO {
    @IsString()
    body: string;
    
    @IsString()
    password: string;
    
    @IsString()
    type: string;
}

export class LoginUserResponse {
    @IsString()
    jwtToken: string;

    @IsNumber()
    userId: number;
}

export class RegisterUserDTO {
    @IsString()
    login: string;
    
    @IsString()
    email: string;
    
    @IsString()
    phoneNumber: string;
    
    @IsString()
    password: string;
}

export class RegisterUserResponse {
    @IsString()
    message: string;

    @IsNumber()
    status: number;
}