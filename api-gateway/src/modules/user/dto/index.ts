import { IsNumber, IsString } from "class-validator";

export class ResponseDTO {
    @IsString()
    message: string;

    @IsNumber()
    status: number;
}