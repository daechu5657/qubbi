import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { MongooseError } from "mongoose";
import { ExceptionResponseDto } from "../models/exception-response.dto";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();

    const exceptionResponse = new ExceptionResponseDto();
    exceptionResponse.path = req.url;
    exceptionResponse.timestamp = new Date().toISOString();

    switch (true) {
      case exception instanceof HttpException:
        exceptionResponse.source = "server";
        exceptionResponse.statusCode = exception.getStatus();
        exceptionResponse.message = exception.message;
        break;
      case exception instanceof MongooseError:
        exceptionResponse.source = "mongoose";
        exceptionResponse.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        exceptionResponse.message = exception.message;
        break;
      default:
        exceptionResponse.source = "default";
        exceptionResponse.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        exceptionResponse.message = "default";
    }

    res.status(exceptionResponse.statusCode).json(exceptionResponse);
  }
}
