export class CreateCourseDto {
    name: string;
    plan_course: string;
}

export class ResponseCourse {
    message: string;
    data: CreateCourseDto;
}
