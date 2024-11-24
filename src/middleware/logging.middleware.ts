import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly loggingService: LoggingService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, query, body } = req;

    this.loggingService.log('Incoming request', {
      method,
      url: originalUrl,
      query,
      body,
    });

    const originalSend = res.send;
    res.send = function (body) {
      const responseBody = body;
      res.send = originalSend;
      res.send(body);

      this.loggingService.log('Response sent', {
        statusCode: res.statusCode,
        body: responseBody,
      });

      return res;
    }.bind(this);

    next();
  }
}
