import { Body, Controller, Post } from '@nestjs/common';
import { MlService } from './ml.service';

class ClassifyTicketDto {
  subject: string;
  description: string;
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
