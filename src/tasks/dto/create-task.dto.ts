import { IsString, IsOptional, IsBoolean, NotEquals } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty()
  @IsString()
  @NotEquals('', { message: 'task text should not be empty' })
  text: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isFinished = false;
}
