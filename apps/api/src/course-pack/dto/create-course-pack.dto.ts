import { IsBoolean, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreateCoursePackDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsBoolean()
  isFree: boolean;
}
