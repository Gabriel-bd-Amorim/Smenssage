import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  msg!: string;
  @IsOptional()
  @IsString()
  name?: string;
  @IsBoolean()
  repost!: boolean;
}
