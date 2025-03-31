import { Injectable } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

@Injectable()
export class SwaggerService {
  constructor() {}

  init(app: INestApplication) {
    const config = new DocumentBuilder()
      .setTitle('Kotoba AI 🇯🇵')
      .setDescription('Powered by AI.')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('Card', 'Collection of endpoints to Card entity')
      .addTag('User', 'Collection of endpoint to User entity')
      .addTag('Practice Session', 'Collection of endpoint to Practice Session')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/swagger', app, document);
  }
}
