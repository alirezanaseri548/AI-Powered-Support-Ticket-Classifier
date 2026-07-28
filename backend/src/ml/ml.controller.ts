import { Body, Controller, Post } from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { MlService } from './ml.service';

class ClassifyTicketDto {
  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEmail()
  @IsNotEmpty()
  customerEmail: string;
}

@Controller('ml')
export class MlController {
  constructor(private readonly mlService: MlService) {}

  @Post('classify')
  classify(@Body() body: ClassifyTicketDto) {
    return this.mlService.classifyTicket({
      subject: body.subject,
      description: body.description,
      customerEmail: body.customerEmail,
    });
  }
}
