import { Module } from '@nestjs/common';
import { CloudModule } from '../../infraestructure/cloud/cloud.module';
import { CardModule } from './card/card.module';
import { DatabaseModule } from '../../infraestructure/database/database.module';
import { LoggerModule } from '../../infraestructure/config/custom/logger/logger.module';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../../infraestructure/config/jwt/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../../infraestructure/guards/auth.guard';
import { PracticeSessionModule } from './practice-session/practice-session.module';

@Module({
  imports: [
    CloudModule,
    DatabaseModule,
    LoggerModule,
    CardModule,
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      global: true,
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRATION') },
      }),
    }),
    PracticeSessionModule,
  ],
  providers: [
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class ControllerModule {}
