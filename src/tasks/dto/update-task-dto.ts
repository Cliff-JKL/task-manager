import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  text: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isFinished: boolean;
}
