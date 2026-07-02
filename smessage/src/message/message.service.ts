import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateMessageDto) {
    return this.prisma.message.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.message.findMany();
  }

  findOne(id: number) {
    return this.prisma.message.findUnique({
      where: { id },
    });
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action irrelevant`;
  }

  remove(id: number) {
    return this.prisma.message.delete({
      where: { id },
    });
  }
}
