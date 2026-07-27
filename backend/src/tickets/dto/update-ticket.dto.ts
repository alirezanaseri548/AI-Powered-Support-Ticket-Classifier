import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { TicketCategory, TicketPriority, TicketStatus } from '@prisma/client';

export class UpdateTicketDto {
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(120)
  subject?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;

  @IsOptional()
  @IsEnum(TicketPriority)
  priority?: TicketPriority;

  @IsOptional()
  @IsEnum(TicketCategory)
  category?: TicketCategory;
}
