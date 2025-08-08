import { IsString } from "class-validator";

export class CreateTeacherDTO {
    @IsString()
    department: string;

    @IsString()
    job_title: string;

    @IsString()
    education: string;
}

export class UpdateTeacherDTO {
    @IsString()
    department: string;

    @IsString()
    job_title: string;

    @IsString()
    education: string;    
}
