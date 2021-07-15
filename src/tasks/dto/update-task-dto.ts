import { IsBoolean, IsString } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  readonly name: string;

  @IsBoolean()
  readonly isFinished: boolean;
}
