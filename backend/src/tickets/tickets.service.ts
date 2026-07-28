import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { AuthUser } from '../auth/types/auth-user.type';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createTicketDto: CreateTicketDto, createdById: string) {
    return this.prisma.ticket.create({
      data: {
        ...createTicketDto,
        createdById,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
          },
        },
      },
    });
  }

  findAll(user: AuthUser) {
    const where: Prisma.TicketWhereInput =
      user.role === UserRole.USER ? { createdById: user.userId } : {};

    return this.prisma.ticket.findMany({
      where,
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
          },
        },
      },
    });
  }

  async findOne(id: string, user: AuthUser) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
          },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    if (user.role === UserRole.USER && ticket.createdById !== user.userId) {
      throw new ForbiddenException('You can only access your own tickets');
    }

    return ticket;
  }

  async update(id: string, updateTicketDto: UpdateTicketDto) {
    await this.ensureTicketExists(id);

    return this.prisma.ticket.update({
      where: { id },
      data: updateTicketDto,
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.ensureTicketExists(id);

    return this.prisma.ticket.delete({
      where: { id },
    });
  }

  private async ensureTicketExists(id: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    return ticket;
  }
}
