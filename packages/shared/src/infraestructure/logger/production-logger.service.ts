import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../core/abstract/logger-service';

@Injectable()
export class ProductionLoggerService extends LoggerService {
  constructor(context: string) {
    super(context);
  }
}
