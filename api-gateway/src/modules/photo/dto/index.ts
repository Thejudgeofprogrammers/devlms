import { IsString } from "class-validator";

export class ResponsePhotoDTO {
    @IsString()
    message: string;

    @IsString()
    file: string;
}