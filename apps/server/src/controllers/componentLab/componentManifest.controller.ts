import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiProperty,
} from "@nestjs/swagger";
import { TestModelingService } from "../../services/test/test-modeling.service";
import { TestService } from "../../services/test/test.service";
import { ComponentLabController } from "./base.controller";

import { Post, UploadedFile } from "@nestjs/common";
import { ApiUpload } from "../../common/decorators/apiUpload";

@ComponentLabController("componentManifest")
export class ComponentManifestController {
  constructor() {
    // private readonly testService: TestService,
    // private readonly testModelingService: TestModelingService,
  }

  @Post("upload")
  @ApiUpload("bundle.zip")
  async upload(@UploadedFile() file: Express.Multer.File) {
    // const items = await this.testService.list();
    // return this.testModelingService.list(items);

    if (!file) {
      return { message: "파일이 없습니다." };
    }

    return {
      message: "ZIP 파일 업로드 성공",
      filename: file.originalname,
      size: file.size,
    };
  }
}
