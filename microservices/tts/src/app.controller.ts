import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  NatsContext,
  Payload,
} from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor() {}

  @MessagePattern({ cmd: 'tts' })
  getHello(): string {
    return 'tts';
  }

  @MessagePattern('notifications')
  getNotifications(@Payload() data: string, @Ctx() context: NatsContext) {
    console.log(`Subject: ${context.getSubject()}`, data);
    return data;
  }
}
