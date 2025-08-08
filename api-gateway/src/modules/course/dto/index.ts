import { IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCourseDto {
    @IsString()
    name: string;

    @IsString()
    plan_course: string;
}

export class ResponseCourse {
    @IsString()
    message: string;
    
    data: CreateCourseDto;
}

export class CreateTaskDTO {
    @IsString()
    title: string;
    
    @IsOptional()
    @IsString()
    description?: string;
    
    @IsOptional()
    @IsDateString()
    deadline?: string;
    
    @IsNumber()
    course_id: number;
}

export class UpdateTaskDTO {
    @IsString()
    title: string;
    
    @IsOptional()
    @IsString()
    description?: string;
    
    @IsOptional()
    @IsDateString()
    deadline?: string;
}

export class ResponseTask {
    @IsString()
    message: string;

    @IsNumber()
    status: number;
}
