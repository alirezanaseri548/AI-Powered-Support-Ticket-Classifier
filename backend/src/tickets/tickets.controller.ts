import { MlService } from '../ml/ml.service';
import { Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards, Req } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { AuthUser } from '../auth/types/auth-user.type';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TicketsService } from './tickets.service';

@Controller('tickets')
@UseGuards(JwtAuthGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService,
    private readonly mlService: MlService,
  ) {}

  @Post()
  create(@Body() createTicketDto: CreateTicketDto, @CurrentUser() user: AuthUser) {
    return this.ticketsService.create(createTicketDto, user.userId);
  }

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.ticketsService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.ticketsService.findOne(id, user);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.AGENT)
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketsService.update(id, updateTicketDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(id);
  }

  @Post(':id/classify')
  async classifyTicket(@Param('id') id: string, @Req() req: any) {
    const ticket = await this.ticketsService.findOne(id, req.user);
    const anyTicket = ticket as any;

    return this.mlService.classifyTicket({
      subject: anyTicket.subject || anyTicket.title || '',
      description: anyTicket.description || anyTicket.body || anyTicket.content || '',
      customerEmail: anyTicket.customerEmail || anyTicket.email || req.user?.email || '',
    });
  }
}


