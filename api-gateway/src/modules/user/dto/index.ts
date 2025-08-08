import { IsNumber, IsString } from "class-validator";

export class ResponseDTO {
    @IsString()
    message: string;

    @IsNumber()
    status: number;
}

export type ProfileUpdatePayload = {
    userInfo?: Partial<{
      name: string;
      fam: string;
      surname: string;
      citizenship: string;
      faculty: string;
      speciality: string;
      profile: string;
      level_of_training: string;
      form_learning: string;
      study_group: string;
      language: string;
    }>;
    contacts?: Partial<{
      country: string;
      city: string;
      time_zone: string;
    }>;
};
