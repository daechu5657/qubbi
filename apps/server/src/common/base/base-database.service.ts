import { Inject, Injectable } from "@nestjs/common";
import { MongoContext } from "../../infrastructure/mongodb";
import { BaseService } from "./base.service";

@Injectable()
export class BaseDatabaseService extends BaseService {
  @Inject(MongoContext)
  protected readonly mongoContext: MongoContext;
}
