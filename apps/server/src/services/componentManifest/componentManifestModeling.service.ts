import { BadRequestException, Injectable } from "@nestjs/common";
import { BaseService } from "../../common/base/base.service";
import { ComponentManifestUploadModel } from "../../models/componentManifest/componentManifestUpload.model";

@Injectable()
export class ComponentManifestModelingService extends BaseService {
  async modeling(buffer: Buffer) {
    const json = this.bufferToJson<ComponentManifestUploadModel>(buffer);
    // 순차적으로 modeling 하고 validate 할껀하고 TODO: nestia 로 변경할꺼니 일단 두기

    return json as ComponentManifestUploadModel;
  }

  private bufferToJson<T = any>(buffer: Buffer): Partial<T> {
    try {
      const jsonString = buffer.toString("utf-8").trim();

      return JSON.parse(jsonString);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  private uploadModel() {}

  private componentModel() {}

  private variantModel() {}

  private propModel() {}

  private partModel() {}
}
