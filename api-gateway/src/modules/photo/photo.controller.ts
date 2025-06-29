import { Controller, MethodNotAllowedException, Post } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { ResponseDTO } from '../user/dto';

@Controller('photo')
export class PhotoController {
    constructor(
        private readonly photoService: PhotoService
    ) {}

    @Post(':user_id/photo')
    async uploadUserPhoto(

    ): Promise<ResponseDTO> {
        throw new MethodNotAllowedException
    }

    @Post(':course_id/photo')
    async uploadCoursePhoto(

    ): Promise<ResponseDTO> {
        throw new MethodNotAllowedException
    }
}
