import { Logger } from "@nestjs/common";

export abstract class LoggerService extends Logger {
  constructor(context: string) {
    super(context);
  }

  setContext(context: string) {
    this.context = context;
  }
}
