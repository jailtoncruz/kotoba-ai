import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infraestructure/database/prisma/prisma.service';

@Injectable()
export class DeckService {
  constructor(private prisma: PrismaService) {}

  async listDecksByUserId(userId: string) {
    return this.prisma.deck.findMany({
      where: { userId },
      include: { _count: { select: { cards: true } } },
    });
  }

  async createDeck({
    language,
    name,
    userId,
  }: {
    language: string;
    name: string;
    userId: string;
  }) {
    return this.prisma.deck.create({
      data: {
        language,
        name,
        userId,
      },
    });
  }
}
