import { LoggerService } from '@monorepo/shared';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PrismaService } from 'src/infraestructure/database/prisma/prisma.service';

@Controller()
export class ListenerController {
  constructor(
    private prisma: PrismaService,
    private logger: LoggerService,
  ) {
    this.logger.setContext(ListenerController.name);
  }

  @MessagePattern({ cmd: 'card_tts_completed' })
  async ttsCompleted(
    @Payload() { data }: { data: { cardId: string; audioUrl: string } },
  ) {
    this.logger.log(`tts_completed: ${data.cardId}`);
    await this.prisma.card.update({
      data: { audioUrl: data.audioUrl },
      where: { id: data.cardId },
    });
    return data;
  }

  @MessagePattern({ cmd: 'lesson_tts_completed' })
  async lessonCompleted(
    @Payload() { data }: { data: { lessonLineId: string; audioUrl: string } },
  ) {
    this.logger.log(`lesson_tts_completed: ${data.lessonLineId}`);
    await this.prisma.lessonLine.update({
      data: { audioUrl: data.audioUrl },
      where: { id: data.lessonLineId },
    });

    return data;
  }
}
