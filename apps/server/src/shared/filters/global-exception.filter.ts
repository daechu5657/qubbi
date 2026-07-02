import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { MongooseError } from "mongoose";
import { ExceptionModel } from "../models/exception.model";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();

    const exceptionModel = new ExceptionModel();
    exceptionModel.path = req.url;
    exceptionModel.timestamp = new Date().toISOString();

    switch (true) {
      case exception instanceof HttpException:
        exceptionModel.source = "server";
        exceptionModel.statusCode = exception.getStatus();
        exceptionModel.message = exception.message;
        break;
      case exception instanceof MongooseError:
        exceptionModel.source = "mongoose";
        exceptionModel.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        exceptionModel.message = exception.message;
        break;
      default:
        exceptionModel.source = "default";
        exceptionModel.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        exceptionModel.message = "default";
    }

    res.status(exceptionModel.statusCode).json(exceptionModel);
  }
}
